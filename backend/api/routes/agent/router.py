"""FastAPI routes exposing the medicine LangGraph agent."""

from __future__ import annotations

from typing import Awaitable, Callable

from fastapi import APIRouter, Depends

from schemas.agent import MedicineAgentResumeRequest, MedicineAgentRunRequest
from services.agent.agent import (
    MedicineAgentTurn,
    resume_medicine_agent,
    run_medicine_agent,
)

RunAgentCallable = Callable[..., Awaitable[MedicineAgentTurn]]
ResumeAgentCallable = Callable[..., Awaitable[MedicineAgentTurn]]


def get_run_medicine_agent() -> RunAgentCallable:
    return run_medicine_agent


def get_resume_medicine_agent() -> ResumeAgentCallable:
    return resume_medicine_agent


router = APIRouter(prefix="/agent/medicine", tags=["medicine-agent"])


@router.post("/run", response_model=MedicineAgentTurn)
async def run_medicine_chat(
    payload: MedicineAgentRunRequest,
    runner: RunAgentCallable = Depends(get_run_medicine_agent),
) -> MedicineAgentTurn:
    """Kick off or continue a conversation with the agent."""

    return await runner(payload.message, thread_id=payload.thread_id)


@router.post("/resume", response_model=MedicineAgentTurn)
async def resume_medicine_chat(
    payload: MedicineAgentResumeRequest,
    runner: ResumeAgentCallable = Depends(get_resume_medicine_agent),
) -> MedicineAgentTurn:
    """Resume the workflow once the user provides the requested selection/details."""

    return await runner(payload.resume_value, thread_id=payload.thread_id)
