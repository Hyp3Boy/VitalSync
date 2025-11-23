"""LangGraph-orchestrated medicine agent built on top of Pydantic AI."""

from __future__ import annotations

import json
import os
from enum import Enum
from typing import Any, Annotated, Dict, List, Optional, TypedDict
from uuid import uuid4

from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, START, StateGraph
from langgraph.types import Command, interrupt
from pydantic import BaseModel
from pydantic_ai import Agent as PydanticAgent, ModelSettings
from pydantic_ai.models.bedrock import BedrockConverseModel
from pydantic_ai.providers.bedrock import BedrockProvider

from schemas.meds import Medication, MedicationWithPriceAndStore
from .tools.search_medicine import (
	MedicineSearchDependencies,
	retrieve_medicine_names,
	retrieve_medicine_with_price_and_store,
)


def _overwrite(_current: Any, new_value: Any) -> Any:
	return new_value


class SearchNextAction(str, Enum):
	ASK_SELECTION = "ask_selection"
	CLARIFY = "clarify_query"
	COMPLETE = "complete"


class MedicineAgentReply(BaseModel):
	"""Structured output returned by the Pydantic AI agent."""

	action: SearchNextAction
	reply: str
	candidates: List[Medication] = []
	results: List[MedicationWithPriceAndStore] = []
	selected_comp_name: Optional[str] = None


class MedicineAgentState(TypedDict, total=False):
	message_history: Annotated[Optional[List[Any]], _overwrite]
	user_message: Annotated[Optional[str], _overwrite]
	agent_reply: Annotated[Optional[MedicineAgentReply], _overwrite]


class MedicineAgentTurn(BaseModel):
	"""Public response returned by the LangGraph workflow after each turn."""

	thread_id: str
	reply: Optional[MedicineAgentReply]
	interrupted: bool
	interrupt_payload: Optional[List[Dict[str, Any]]]


AGENT_INSTRUCTIONS = """
Eres el agente de búsqueda de medicamentos de VitalSync para usuarios en Perú.
Tu flujo obligatorio es:
1. Si el usuario busca un medicamento, SIEMPRE usa el tool `retrieve_medicine_names` para obtener la lista oficial de `comp_name`, concentración y forma farmacéutica.
2. Resume esa lista (máx. 5 opciones) con índices y pídele al usuario que seleccione una opción antes de continuar. Establece `action="ask_selection"` y llena `candidates` con los objetos completos que recibiste de Typesense.
3. Cuando el usuario confirme una opción (ej. "quiero la opción 2" o mencione el `comp_name`), llama a `retrieve_medicine_with_price_and_store` pasando todos los campos necesarios del objeto `Medication` que elegiste. Después describe los resultados y establece `action="complete"` llenando `results`.
4. Si necesitas más contexto antes de llamar a los tools (por ejemplo, la forma farmacéutica o concentración), haz preguntas aclaratorias y establece `action="clarify_query"`.

Responde siempre en español neutro, incluye un breve resumen y una lista estructurada con {farmacia, dirección, precio} al finalizar.
""".strip()


def _resolve_model(spec: str) -> str | BedrockConverseModel:
	if spec.startswith("gateway/"):
		return spec
	model_name = spec
	if spec.startswith("bedrock:"):
		model_name = spec.split("bedrock:", 1)[1]
	region = os.getenv("AWS_REGION", os.getenv("BEDROCK_REGION", "us-east-1"))
	provider = BedrockProvider(region_name=region)
	return BedrockConverseModel(model_name, provider=provider)


MODEL_SPEC = os.getenv("MEDICINE_AGENT_MODEL", "us.anthropic.claude-3-7-sonnet-20250219-v1:0")
TEMPERATURE = float(os.getenv("MEDICINE_AGENT_TEMPERATURE", "0.2"))
MEDICINE_DEPS = MedicineSearchDependencies.from_env()

medicine_agent = PydanticAgent[
	MedicineSearchDependencies, MedicineAgentReply
](
	_resolve_model(MODEL_SPEC),
	deps_type=MedicineSearchDependencies,
	output_type=MedicineAgentReply,
	instructions=AGENT_INSTRUCTIONS,
	tools=[retrieve_medicine_names, retrieve_medicine_with_price_and_store],
	model_settings=ModelSettings(temperature=TEMPERATURE),
)


async def _call_agent(state: MedicineAgentState) -> Dict[str, Any]:
	user_message = state.get("user_message")
	if not user_message:
		return {}

	result = await medicine_agent.run(
		user_message,
		deps=MEDICINE_DEPS,
		message_history=state.get("message_history"),
	)
	return {
		"message_history": result.new_messages(),
		"agent_reply": result.output,
		"user_message": None,
	}


def _route_after_agent(state: MedicineAgentState) -> str:
	reply = state.get("agent_reply")
	if reply is None:
		return SearchNextAction.COMPLETE.value
	return reply.action.value


def _await_selection(state: MedicineAgentState) -> Dict[str, Any]:
	reply = state.get("agent_reply")
	candidates = reply.candidates if reply else []
	options_payload: List[Dict[str, Any]] = [
		{
			"comp_name": med.comp_name,
			"display_name": f"{med.name} | {med.concentration} | {med.pharmaceutical_form}",
			"medication": med.model_dump(),
		}
		for med in candidates
	]

	selection = interrupt(
		{
			"type": "medicine_selection",
			"message": reply.reply if reply else "Selecciona un medicamento",
			"options": options_payload,
		}
	)

	selection_text = None
	medication_payload: Optional[Dict[str, Any]] = None

	if isinstance(selection, dict):
		selection_text = selection.get("utterance")
		medication_payload = selection.get("medication")
		comp_name = selection.get("comp_name")
		if comp_name and medication_payload is None:
			medication_payload = next(
				(med.model_dump() for med in candidates if med.comp_name == comp_name),
				None,
			)
		if selection_text is None and comp_name:
			selection_text = f"Elijo el medicamento con nombre compuesto {comp_name}."
	elif isinstance(selection, str):
		selection_text = selection

	if medication_payload is not None and selection_text:
		detailed = json.dumps(medication_payload, ensure_ascii=False)
		selection_text = f"{selection_text}\nDetalles seleccionados: {detailed}"
	elif medication_payload is not None:
		selection_text = "He elegido este medicamento: " + json.dumps(medication_payload, ensure_ascii=False)

	return {
		"user_message": selection_text or "Elijo la primera opción disponible.",
		"agent_reply": None,
	}


def _await_clarification(state: MedicineAgentState) -> Dict[str, Any]:
	reply = state.get("agent_reply")
	clarification = interrupt(
		{
			"type": "clarify_query",
			"message": reply.reply if reply else "Necesito más detalles.",
		}
	)

	if isinstance(clarification, str):
		text = clarification
	elif isinstance(clarification, dict):
		text = clarification.get("utterance") or json.dumps(clarification, ensure_ascii=False)
	else:
		text = str(clarification)

	return {
		"user_message": text,
		"agent_reply": None,
	}


builder = StateGraph(MedicineAgentState)
builder.add_node("call_agent", _call_agent)
builder.add_node("await_selection", _await_selection)
builder.add_node("await_clarification", _await_clarification)
builder.add_edge(START, "call_agent")
builder.add_conditional_edges(
	"call_agent",
	_route_after_agent,
	{
		SearchNextAction.ASK_SELECTION.value: "await_selection",
		SearchNextAction.CLARIFY.value: "await_clarification",
		SearchNextAction.COMPLETE.value: END,
	},
)
builder.add_edge("await_selection", "call_agent")
builder.add_edge("await_clarification", "call_agent")

MEDICINE_GRAPH = builder.compile(checkpointer=MemorySaver())


def _graph_config(thread_id: Optional[str]) -> Dict[str, Dict[str, str]]:
	return {"configurable": {"thread_id": thread_id or str(uuid4())}}


def _build_turn_result(state: Dict[str, Any], thread_id: str) -> MedicineAgentTurn:
	raw_interrupts = state.get("__interrupt__") or []
	payload: Optional[List[Dict[str, Any]]] = None
	if raw_interrupts:
		payload = [getattr(interrupt_obj, "value", interrupt_obj) for interrupt_obj in raw_interrupts]
	return MedicineAgentTurn(
		thread_id=thread_id,
		reply=state.get("agent_reply"),
		interrupted=bool(raw_interrupts),
		interrupt_payload=payload,
	)


async def run_medicine_agent(user_message: str, *, thread_id: Optional[str] = None) -> MedicineAgentTurn:
	"""Start or continue a conversation by sending a new user utterance."""

	config = _graph_config(thread_id)
	state = await MEDICINE_GRAPH.ainvoke({"user_message": user_message}, config=config)
	return _build_turn_result(state, config["configurable"]["thread_id"])


async def resume_medicine_agent(resume_value: Any, *, thread_id: str) -> MedicineAgentTurn:
	"""Resume an interrupted conversation providing the external input requested."""

	config = _graph_config(thread_id)
	state = await MEDICINE_GRAPH.ainvoke(Command(resume=resume_value), config=config)
	return _build_turn_result(state, thread_id)


__all__ = [
	"MedicineAgentReply",
	"MedicineAgentTurn",
	"SearchNextAction",
	"MEDICINE_GRAPH",
	"run_medicine_agent",
	"resume_medicine_agent",
]
