from pydantic import BaseModel
from typing import Any

class NLPQueryRequest(BaseModel):
    query: str

class NLPQueryResponse(BaseModel):
    code: int
    data: dict[str, Any]