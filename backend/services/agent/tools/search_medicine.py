"""Medicine search utilities exposed as Pydantic AI tools."""

from __future__ import annotations

import logging
import os
from dataclasses import dataclass, field
from typing import Dict, List, Sequence

import requests
import typesense
from pydantic_ai import ModelRetry, RunContext

from schemas.meds import Medication, MedicationWithPriceAndStore

logger = logging.getLogger(__name__)


@dataclass(slots=True)
class MedicineSearchConfig:
    """Runtime configuration for DIGEMID + Typesense lookups."""

    typesense_host: str = field(default_factory=lambda: os.getenv("TYPESENSE_HOST", "54.208.121.82"))
    typesense_port: str = field(default_factory=lambda: os.getenv("TYPESENSE_PORT", "8108"))
    typesense_protocol: str = field(default_factory=lambda: os.getenv("TYPESENSE_PROTOCOL", "http"))
    typesense_api_key: str = field(default_factory=lambda: os.getenv("TYPESENSE_API_KEY", "sk-QClwVrriqhEYsJoiOE7wfStYfIvdeey5L32qvrk3ruLJqMcN"))
    typesense_collection: str = field(default_factory=lambda: os.getenv("TYPESENSE_COLLECTION", "medications"))
    digemid_url: str = field(default_factory=lambda: os.getenv("DIGEMID_API_URL", "https://ms-opm.minsa.gob.pe/msopmcovid/preciovista/ciudadano"))
    digemid_department_code: str = field(default_factory=lambda: os.getenv("DIGEMID_DEPARTMENT_CODE", "15"))
    digemid_province_code: str = field(default_factory=lambda: os.getenv("DIGEMID_PROVINCE_CODE", "01"))
    digemid_district_code: str = field(default_factory=lambda: os.getenv("DIGEMID_DISTRICT_CODE", "150131"))
    http_timeout_seconds: int = field(default_factory=lambda: int(os.getenv("DIGEMID_HTTP_TIMEOUT", "20")))
    per_page: int = field(default_factory=lambda: int(os.getenv("MEDICINE_SEARCH_PER_PAGE", "10")))
    page_size: int = field(default_factory=lambda: int(os.getenv("MEDICINE_PRICE_PAGE_SIZE", "100")))

    def headers(self) -> Dict[str, str]:
        """Default headers required by the official DIGEMID endpoint."""

        return {
            "User-Agent": os.getenv(
                "DIGEMID_USER_AGENT",
                "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 "
                "(KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            ),
            "Content-Type": "application/json;charset=UTF-8",
            "Origin": "https://opm-digemid.minsa.gob.pe",
            "Referer": "https://opm-digemid.minsa.gob.pe/",
            "Accept-Encoding": "gzip, deflate, br",
        }


@dataclass(slots=True)
class MedicineSearchDependencies:
    """Container shared with the Pydantic agent via RunContext."""

    typesense_client: typesense.Client
    session: requests.Session
    config: MedicineSearchConfig

    @classmethod
    def from_env(cls, config: MedicineSearchConfig | None = None) -> "MedicineSearchDependencies":
        cfg = config or MedicineSearchConfig()
        client = typesense.Client(
            {
                "nodes": [
                    {
                        "host": cfg.typesense_host,
                        "port": cfg.typesense_port,
                        "protocol": cfg.typesense_protocol,
                    }
                ],
                "api_key": cfg.typesense_api_key,
                "connection_timeout_seconds": cfg.http_timeout_seconds,
            }
        )

        session = requests.Session()
        session.headers.update(cfg.headers())
        return cls(typesense_client=client, session=session, config=cfg)


def _deduplicate_by_comp_name(items: Sequence[Medication]) -> List[Medication]:
    unique: Dict[str, Medication] = {}
    for item in items:
        unique.setdefault(item.comp_name, item)
    return list(unique.values())


def retrieve_medicine_names(
    ctx: RunContext[MedicineSearchDependencies],
    query: str,
    per_page: int | None = None,
) -> List[Medication]:
    """Search Typesense to map a colloquial query to DIGEMID compound names."""

    deps = ctx.deps
    cfg = deps.config
    search_parameters = {
        "q": query,
        "query_by": "name,comp_name",
        "per_page": per_page or cfg.per_page,
    }

    try:
        results = deps.typesense_client.collections[cfg.typesense_collection].documents.search(search_parameters)
        hits = results.get("hits", [])
        medication_list: List[Medication] = []
        for hit in hits:
            doc = hit.get("document", {})
            try:
                medication_list.append(
                    Medication(
                        comp_name=doc["comp_name"],
                        name=doc["name"],
                        concentration=str(doc.get("concentration", "")),
                        pharmaceutical_form=str(doc.get("pharmaceutical_form", "")),
                        group=int(doc.get("group", 0)),
                        FFgroup=str(doc.get("FFgroup", "")),
                    )
                )
            except KeyError as exc:  # pragma: no cover - guard against malformed records
                logger.warning("Skipping incomplete Typesense document: %s", exc)
        return _deduplicate_by_comp_name(medication_list)
    except Exception as exc:
        logger.exception("Failed to query Typesense for %s", query)
        raise ModelRetry(f"No pude obtener medicamentos desde Typesense: {exc}") from exc


def retrieve_medicine_with_price_and_store(
    ctx: RunContext[MedicineSearchDependencies],
    medication: Medication,
    page: int | None = None,
    page_size: int | None = None,
) -> List[MedicationWithPriceAndStore]:
    """Query DIGEMID's price API for the selected compound and return store info."""

    deps = ctx.deps
    cfg = deps.config
    payload = {
        "filtro": {
            "codGrupoFF": medication.FFgroup,
            "codigoDepartamento": cfg.digemid_department_code,
            "codigoProvincia": cfg.digemid_province_code,
            "codigoUbigeo": cfg.digemid_district_code,
            "codigoProducto": medication.group,
            "concent": medication.concentration,
            "pagina": page or 1,
            "tamanio": page_size or cfg.page_size,
        }
    }

    try:
        response = deps.session.post(
            cfg.digemid_url,
            json=payload,
            timeout=cfg.http_timeout_seconds,
        )
        response.raise_for_status()
        data = response.json()
        medication_list: List[MedicationWithPriceAndStore] = []
        for item in data.get("data", [])[:5]:
            medication_list.append(
                MedicationWithPriceAndStore(
                    comp_name=item.get("nombre_comp", medication.comp_name),
                    name=item.get("nombreProducto", medication.name),
                    concentration=item.get("concent", medication.concentration),
                    pharmaceutical_form=item.get("nombreFormaFarmaceutica", medication.pharmaceutical_form),
                    group=int(item.get("grupo", medication.group)),
                    FFgroup=str(item.get("codGrupoFF", medication.FFgroup)),
                    medication_code=int(item.get("codProdE", 0)),
                    price=float(item.get("precio2", 0)),
                    store_code=str(item.get("codEstab", "")),
                    store_address=str(item.get("direccion", "")),
                    store_telephone=str(item.get("telefono", "")),
                    store_name=str(item.get("nombreComercial", "")),
                )
            )
        if not medication_list:
            logger.info("DIGEMID returned 0 stores for %s", medication.comp_name)
        return medication_list
    except requests.RequestException as exc:
        logger.exception("DIGEMID price request failed")
        raise ModelRetry(f"La API de DIGEMID falló al buscar precios: {exc}") from exc
    except ValueError as exc:  # JSON decode / casting issues
        logger.exception("Could not parse DIGEMID payload")
        raise ModelRetry(f"Recibí información inválida desde DIGEMID: {exc}") from exc


__all__ = [
    "MedicineSearchConfig",
    "MedicineSearchDependencies",
    "retrieve_medicine_names",
    "retrieve_medicine_with_price_and_store",
]
