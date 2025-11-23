"""Pydantic schemas for the medicine conversational agent endpoints."""

from __future__ import annotations

from typing import Any, Optional

from pydantic import BaseModel, Field


class MedicineAgentRunRequest(BaseModel):
    """Payload to start or continue a medicine search conversation."""

    message: str = Field(..., description="Usuario solicita información de un medicamento.")
    thread_id: Optional[str] = Field(
        None,
        description="Identificador opcional para continuar una conversación existente.",
    )


class MedicineAgentResumeRequest(BaseModel):
    """Payload for resuming an interrupted conversation after user selection."""

    thread_id: str = Field(..., description="Identificador de la conversación a reanudar.")
    resume_value: Any = Field(
        ...,
        description="Respuesta estructurada solicitada por el agente (ej. selección de medicamento).",
    )
