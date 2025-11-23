"""Interactive CLI harness for the VitalSync medicine agent."""

from __future__ import annotations

import argparse
import asyncio
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional
from uuid import uuid4

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from services.agent.agent import (  # noqa: E402
    MedicineAgentReply,
    MedicineAgentTurn,
    run_medicine_agent,
    resume_medicine_agent,
)


def _print_agent_reply(turn: MedicineAgentTurn) -> None:
    if not turn.reply:
        print("\n[agent] Sin respuesta del agente aún.\n")
        return

    reply: MedicineAgentReply = turn.reply
    print("\n[agent]", reply.reply)
    if reply.results:
        print("\n[resultado]")
        for idx, result in enumerate(reply.results, start=1):
            print(
                f"  {idx}. {result.store_name} - {result.store_address} | S/ {result.price:.2f}"
            )
    print()


def _format_option(option: Dict[str, Any]) -> str:
    display = option.get("display_name") or option.get("comp_name") or "opción"
    medication = option.get("medication")
    extra = ""
    if medication:
        extra = f" -> {medication.get('name')} ({medication.get('concentration')})"
    return f"{display}{extra}"


def _prompt_selection(payload: Dict[str, Any]) -> Dict[str, Any]:
    options: List[Dict[str, Any]] = payload.get("options") or []
    if options:
        print("Selecciona uno de los siguientes medicamentos oficiales:")
        for idx, option in enumerate(options, start=1):
            print(f"  [{idx}] {_format_option(option)}")
        print("  [0] Ingresar texto libre")
    else:
        print("No se recibieron opciones. Puedes describir manualmente tu selección.")

    while True:
        choice = input("Tu selección: ").strip()
        if choice.isdigit() and options:
            index = int(choice)
            if index == 0:
                break
            if 1 <= index <= len(options):
                chosen = options[index - 1]
                utterance = input("Explica tu decisión (enter para usar el default): ").strip()
                if not utterance:
                    utterance = f"Selecciono {chosen.get('comp_name')}"
                return {
                    "comp_name": chosen.get("comp_name"),
                    "medication": chosen.get("medication"),
                    "utterance": utterance,
                }
        if choice:
            break
        print("Ingresa un número válido o cualquier texto.")

    free_text = choice or input("Describe tu selección: ")
    return {"utterance": free_text}


def _prompt_clarification(payload: Dict[str, Any]) -> Dict[str, Any]:
    print(payload.get("message") or "Necesito más información.")
    clarification = input("Tu respuesta: ").strip()
    return {"utterance": clarification}


async def _interactive_loop(prompt: str, thread_id: Optional[str]) -> None:
    thread = thread_id or str(uuid4())
    turn = await run_medicine_agent(prompt, thread_id=thread)

    while True:
        _print_agent_reply(turn)
        if not turn.interrupted:
            print(f"Conversación finalizada. thread_id={thread}")
            break

        payloads = turn.interrupt_payload or []
        if not payloads:
            print("El agente solicitó interacción pero no devolvió payload. Terminando.")
            break

        payload = payloads[0]
        interrupt_type = payload.get("type")
        if interrupt_type == "medicine_selection":
            resume_value = _prompt_selection(payload)
        else:
            resume_value = _prompt_clarification(payload)

        turn = await resume_medicine_agent(resume_value, thread_id=thread)


def main() -> None:
    parser = argparse.ArgumentParser(description="Prueba el agente de medicamentos desde la CLI.")
    parser.add_argument("prompt", help="Solicitud inicial del usuario (ej. 'Muéstrame dónde venden Panadol').")
    parser.add_argument(
        "--thread-id",
        help="Identificador de conversación para retomar una sesión anterior.",
    )
    args = parser.parse_args()

    asyncio.run(_interactive_loop(args.prompt, args.thread_id))


if __name__ == "__main__":
    main()
