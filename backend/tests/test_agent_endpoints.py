from __future__ import annotations

from typing import Any

from fastapi import FastAPI
from fastapi.testclient import TestClient

from api.routes.agent.router import (
    get_resume_medicine_agent,
    get_run_medicine_agent,
    router as agent_router,
)
from services.agent.agent import MedicineAgentReply, MedicineAgentTurn, SearchNextAction


async def fake_run_agent(message: str, *, thread_id: str | None = None) -> MedicineAgentTurn:
    return MedicineAgentTurn(
        thread_id=thread_id or "thread-run",
        reply=MedicineAgentReply(
            action=SearchNextAction.COMPLETE,
            reply=f"Echo: {message}",
            candidates=[],
            results=[],
        ),
        interrupted=False,
        interrupt_payload=None,
    )


async def fake_resume_agent(resume_value: Any, *, thread_id: str) -> MedicineAgentTurn:
    return MedicineAgentTurn(
        thread_id=thread_id,
        reply=MedicineAgentReply(
            action=SearchNextAction.ASK_SELECTION,
            reply=f"Resume: {resume_value}",
            candidates=[],
            results=[],
        ),
        interrupted=True,
        interrupt_payload=[{"type": "mock"}],
    )


def build_test_client() -> TestClient:
    app = FastAPI()
    app.include_router(agent_router)
    app.dependency_overrides[get_run_medicine_agent] = lambda: fake_run_agent
    app.dependency_overrides[get_resume_medicine_agent] = lambda: fake_resume_agent
    return TestClient(app)


def test_run_endpoint_returns_agent_turn():
    client = build_test_client()
    response = client.post("/agent/medicine/run", json={"message": "dime"})
    assert response.status_code == 200
    data = response.json()
    assert data["thread_id"] == "thread-run"
    assert data["reply"]["reply"] == "Echo: dime"
    assert data["interrupted"] is False


def test_resume_endpoint_returns_agent_turn():
    client = build_test_client()
    response = client.post(
        "/agent/medicine/resume",
        json={"thread_id": "thread-123", "resume_value": {"option": 1}},
    )
    assert response.status_code == 200
    data = response.json()
    assert data["thread_id"] == "thread-123"
    assert data["reply"]["reply"].startswith("Resume")
    assert data["interrupted"] is True
    assert data["interrupt_payload"] == [{"type": "mock"}]
