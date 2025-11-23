from __future__ import annotations

from types import SimpleNamespace
import unittest

from services.agent.tools.recommend_specialty import (
    SPECIALTY_LIST,
    SpecialtyCatalog,
    recommend_specialty,
)
from services.agent.tools.search_medicine import (
    MedicineSearchConfig,
    MedicineSearchDependencies,
    retrieve_medicine_names,
    retrieve_medicine_with_price_and_store,
)
from schemas.agent_meds import Medication


class FakeTypesenseDocuments:
    def __init__(self, hits):
        self._hits = hits

    def search(self, _params):
        return {"hits": [{"document": hit} for hit in self._hits]}


class FakeTypesenseCollection:
    def __init__(self, hits):
        self.documents = FakeTypesenseDocuments(hits)


class FakeTypesenseClient(dict):
    def __init__(self, hits):
        super().__init__()
        self.update({"medications": FakeTypesenseCollection(hits)})

    @property
    def collections(self):  # pragma: no cover - attribute style access
        return self


class FakeResponse:
    def __init__(self, payload):
        self._payload = payload

    def raise_for_status(self):  # pragma: no cover - no error path in tests
        return None

    def json(self):
        return self._payload


class FakeSession:
    def __init__(self, payload):
        self._payload = payload
        self.headers = {}

    def post(self, *_args, **_kwargs):
        return FakeResponse(self._payload)


class MedicineToolsTest(unittest.TestCase):
    def setUp(self):
        self.config = MedicineSearchConfig()
        self.config.typesense_collection = "medications"
        self.base_medication = Medication(
            comp_name="PARACETAMOL",
            name="Panadol",
            concentration="500 mg",
            pharmaceutical_form="Tableta",
            group=1,
            FFgroup="A1",
        )

    def test_retrieve_medicine_names_returns_structured_models(self):
        hits = [
            {
                "comp_name": "PARACETAMOL",
                "name": "Panadol",
                "concentration": "500 mg",
                "pharmaceutical_form": "Tableta",
                "group": 1,
                "FFgroup": "A1",
            }
        ]
        deps = MedicineSearchDependencies(
            typesense_client=FakeTypesenseClient(hits),
            session=FakeSession({}),
            config=self.config,
        )
        ctx = SimpleNamespace(deps=deps)

        results = retrieve_medicine_names(ctx, "panadol")

        self.assertEqual(len(results), 1)
        self.assertEqual(results[0].comp_name, "PARACETAMOL")
        self.assertEqual(results[0].pharmaceutical_form, "Tableta")

    def test_retrieve_medicine_with_price_and_store_maps_payload(self):
        payload = {
            "data": [
                {
                    "nombre_comp": "PARACETAMOL",
                    "nombreProducto": "Panadol",
                    "concent": "500 mg",
                    "nombreFormaFarmaceutica": "Tableta",
                    "grupo": 1,
                    "codGrupoFF": "A1",
                    "codProdE": 123,
                    "precio2": 4.5,
                    "codEstab": "999",
                    "direccion": "Av. Siempre Viva 742",
                    "telefono": "(01)999-999",
                    "nombreComercial": "MiFarma",
                }
            ]
        }
        deps = MedicineSearchDependencies(
            typesense_client=FakeTypesenseClient([]),
            session=FakeSession(payload),
            config=self.config,
        )
        ctx = SimpleNamespace(deps=deps)

        results = retrieve_medicine_with_price_and_store(ctx, self.base_medication)

        self.assertEqual(len(results), 1)
        self.assertEqual(results[0].store_name, "MiFarma")
        self.assertAlmostEqual(results[0].price, 4.5)

    def test_recommend_specialty_returns_catalog_for_llm_reasoning(self):
        ctx = SimpleNamespace(deps=None)
        concern = "Tengo dolor de estómago y náusea desde ayer"
        response = recommend_specialty(ctx, concern)
        self.assertIsInstance(response, SpecialtyCatalog)
        self.assertIn("estómago", response.concern.lower())
        specialty_names = [item.name for item in response.specialties]
        self.assertEqual(len(specialty_names), len(SPECIALTY_LIST))
        self.assertIn("GASTROENTEROLOGÍA", specialty_names)
        self.assertIn("MEDICINA GENERAL", specialty_names)
        self.assertIn("automedicación", response.reminder.lower())

    def test_recommend_specialty_handles_empty_description(self):
        ctx = SimpleNamespace(deps=None)
        response = recommend_specialty(ctx, "  ")
        self.assertIsInstance(response, SpecialtyCatalog)
        self.assertIn("consulta general", response.concern.lower())
        self.assertGreater(len(response.specialties), 0)


if __name__ == "__main__":  # pragma: no cover
    unittest.main()
