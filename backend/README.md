## VitalSync Backend

This backend powers the VitalSync assistant that helps users locate regulated medicines across Peruvian pharmacies. The latest iteration introduces a LangGraph-orchestrated workflow that wraps a Pydantic AI agent backed by AWS Bedrock (Claude) and the DIGEMID endpoints.

### Prerequisites

- Python 3.11 (a managed virtual environment lives in `.venv`)
- Access to AWS Bedrock with an Anthropic Claude model
- Credentials for the Typesense cluster that mirrors DIGEMID's medication catalogue

### Environment variables

| Variable | Description | Default |
| --- | --- | --- |
| `TYPESENSE_HOST`, `TYPESENSE_PORT`, `TYPESENSE_PROTOCOL`, `TYPESENSE_API_KEY` | Connection info for the medications collection | Values from the previous hardcoded client |
| `TYPESENSE_COLLECTION` | Collection name | `medications` |
| `DIGEMID_API_URL` | Official DIGEMID price API | `https://ms-opm.minsa.gob.pe/msopmcovid/preciovista/ciudadano` |
| `DIGEMID_DEPARTMENT_CODE` | Departamento code for the search | `15` (Lima) |
| `MEDICINE_AGENT_MODEL` | Target LLM. Use `bedrock:<model_id>` or `gateway/<provider:model>` | `bedrock:anthropic.claude-3-5-sonnet-20241022-v1:0` |
| `MEDICINE_AGENT_TEMPERATURE` | Claude temperature | `0.2` |
| `AWS_REGION` | Region for Bedrock runtime | `us-east-1` |

### How the agent works

1. `services/agent/tools/search_medicine.py` exposes two Pydantic AI tool functions:
   - `retrieve_medicine_names` (Typesense) turns colloquial requests into DIGEMID compound names.
   - `retrieve_medicine_with_price_and_store` (DIGEMID) fetches price + pharmacy metadata.
2. `services/agent/agent.py` instantiates a `PydanticAgent` with those tools, enforces a structured output (`MedicineAgentReply`), and embeds it inside a LangGraph state machine that:
   - Stores conversation history.
   - Interrupts execution while waiting for the user's pick among the suggested compound names.
   - Resumes automatically once the selection is provided, then surfaces store-level pricing.

### Running the agent loop

```python
import asyncio
from services.agent.agent import run_medicine_agent, resume_medicine_agent


async def demo():
	turn = await run_medicine_agent("Muéstrame dónde venden panadol", thread_id="demo-thread")
	if turn.interrupted:
		# Show turn.interrupt_payload[0]["options"] to the end-user and capture their selection
		selection = {
			"comp_name": turn.interrupt_payload[0]["options"][0]["comp_name"],
			"utterance": "Elijo la primera opción",
		}
		turn = await resume_medicine_agent(selection, thread_id=turn.thread_id)
	print(turn.reply.reply)


asyncio.run(demo())
```

The helper returns `MedicineAgentTurn`, which contains the thread ID, the latest agent reply, and any outstanding interrupt payloads so transport layers (HTTP/WebSocket/etc.) can orchestrate user confirmations.

### FastAPI endpoints

The backend now exposes the agent over HTTP via two endpoints mounted under `/agent/medicine`.

| Method & Path | Body | Description |
| --- | --- | --- |
| `POST /agent/medicine/run` | `{ "message": "Muéstrame dónde venden panadol", "thread_id": "optional" }` | Starts or continues a conversation. Returns `MedicineAgentTurn`. |
| `POST /agent/medicine/resume` | `{ "thread_id": "<previous-id>", "resume_value": { ... } }` | Sends the structured payload requested by the agent (e.g., selected `comp_name`). |

Example using `uv` (or `python -m httpx` equivalent):

```fish
uv run python - <<'PY'
import httpx

payload = {"message": "donde venden panadol?"}
resp = httpx.post("http://localhost:8000/agent/medicine/run", json=payload)
print(resp.json())
PY
```

When `interrupted` is `true`, inspect `interrupt_payload[0]` for the `options` array and send the chosen option back to `/resume`. This mirrors the LangGraph conditional flow described in the [official docs](https://docs.langchain.com/oss/python/langgraph/graph-api#conditional-edges).

### CLI harness

For quick local manual testing without hitting the HTTP routes, use the interactive script:

```fish
uv run python scripts/medicine_agent_cli.py "donde venden panadol?"
```

The script prints the agent replies, lists the available `comp_name` options when an interrupt occurs, captures your choice, and resumes the workflow automatically.

### Tests

Unit tests cover the tool plumbing without hitting external services:

```fish
/home/adrianjcz/Desktop/VitalSync/backend/.venv/bin/python -m unittest discover -s tests
```

### Useful references

- Pydantic AI Agents & Tools: https://ai.pydantic.dev/agents/
- LangGraph overview & interrupts: https://docs.langchain.com/oss/python/langgraph/overview
