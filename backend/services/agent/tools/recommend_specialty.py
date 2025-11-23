"""Specialty catalog tool for the VitalSync medicine agent."""

from __future__ import annotations

from typing import Any, Dict, List

from pydantic import BaseModel
from pydantic_ai import RunContext

SPECIALTY_LIST = [
    "MEDICINA GENERAL",
    "MEDICINA INTERNA",
    "PEDIATRÍA",
    "GINECOLOGÍA Y OBSTETRICIA",
    "CARDIOLOGÍA",
    "GASTROENTEROLOGÍA",
    "DERMATOLOGÍA",
    "OFTALMOLOGÍA",
    "OTORRINOLARINGOLOGÍA",
    "TRAUMATOLOGÍA Y ORTOPEDIA",
    "CIRUGÍA GENERAL",
    "UROLOGÍA",
    "NEUMOLOGÍA",
    "NEUROLOGÍA",
    "ENDOCRINOLOGÍA",
    "REUMATOLOGÍA",
    "NEFROLOGÍA",
    "ONCOLOGÍA",
    "PSIQUIATRÍA",
    "PSICOLOGÍA",
    "ODONTOLOGÍA",
    "NUTRICIÓN",
    "TERAPIA FÍSICA Y REHABILITACIÓN",
    "LABORATORIO CLÍNICO",
    "RADIOLOGÍA",
    "MEDICINA DE EMERGENCIA Y DESASTRES",
    "MEDICINA FAMILIAR",
    "GERIATRÍA",
    "ANESTESIOLOGÍA",
    "HEMATOLOGÍA",
]


class SpecialtyInfo(BaseModel):
    name: str
    description: str
    common_signs: List[str]
    caution: str | None = None


class SpecialtyCatalog(BaseModel):
    concern: str
    specialties: List[SpecialtyInfo]
    reminder: str


SPECIALTY_DESCRIPTIONS: Dict[str, str] = {
    "MEDICINA GENERAL": "Primer punto de contacto para molestias inespecíficas, chequeos y derivaciones.",
    "MEDICINA INTERNA": "Diagnóstico integral de adultos con enfermedades crónicas o multisistémicas.",
    "PEDIATRÍA": "Crecimiento, vacunas y enfermedades en niñas, niños y adolescentes.",
    "GINECOLOGÍA Y OBSTETRICIA": "Salud reproductiva femenina, planificación familiar y control prenatal.",
    "CARDIOLOGÍA": "Prevención, estudio y tratamiento de enfermedades del corazón y vasos sanguíneos.",
    "GASTROENTEROLOGÍA": "Tracto digestivo: esófago, estómago, intestinos, hígado y páncreas.",
    "DERMATOLOGÍA": "Piel, cabello y uñas, alergias, infecciones y lesiones cutáneas.",
    "OFTALMOLOGÍA": "Salud ocular, corrección visual y enfermedades de la vista.",
    "OTORRINOLARINGOLOGÍA": "Oídos, nariz, garganta, equilibrio y voz.",
    "TRAUMATOLOGÍA Y ORTOPEDIA": "Lesiones óseas y articulares, rehabilitación postraumática.",
    "CIRUGÍA GENERAL": "Procedimientos quirúrgicos abdominales y de tejidos blandos.",
    "UROLOGÍA": "Vías urinarias y sistema reproductor masculino.",
    "NEUMOLOGÍA": "Patologías pulmonares y respiratorias crónicas.",
    "NEUROLOGÍA": "Sistema nervioso central y periférico, migrañas, convulsiones y neuropatías.",
    "ENDOCRINOLOGÍA": "Trastornos hormonales, tiroides y metabolismo.",
    "REUMATOLOGÍA": "Enfermedades autoinmunes y articulares persistentes.",
    "NEFROLOGÍA": "Función renal, insuficiencia y terapias de reemplazo.",
    "ONCOLOGÍA": "Diagnóstico y tratamiento integral del cáncer.",
    "PSIQUIATRÍA": "Trastornos mentales que requieren abordaje médico y farmacológico.",
    "PSICOLOGÍA": "Soporte emocional y terapias psicológicas sin medicación.",
    "ODONTOLOGÍA": "Salud bucal, dientes, encías y articulaciones mandibulares.",
    "NUTRICIÓN": "Planes alimenticios, control de peso y educación nutricional.",
    "TERAPIA FÍSICA Y REHABILITACIÓN": "Recuperación funcional y manejo del movimiento.",
    "LABORATORIO CLÍNICO": "Pruebas diagnósticas de laboratorio para orientar tratamientos.",
    "RADIOLOGÍA": "Estudios de imagen para diagnóstico y seguimiento.",
    "MEDICINA DE EMERGENCIA Y DESASTRES": "Atención inmediata a eventos agudos que comprometen la vida.",
    "MEDICINA FAMILIAR": "Acompañamiento integral a lo largo de las etapas de la vida.",
    "GERIATRÍA": "Salud de personas mayores, fragilidad y memoria.",
    "ANESTESIOLOGÍA": "Manejo del dolor y sedación en procedimientos.",
    "HEMATOLOGÍA": "Trastornos de la sangre, médula ósea y coagulación.",
}


SPECIALTY_SIGNS: Dict[str, List[str]] = {
    "MEDICINA GENERAL": ["malestar general", "control preventivo", "duda inespecífica"],
    "GASTROENTEROLOGÍA": ["dolor abdominal", "acidez", "reflujo"],
    "CARDIOLOGÍA": ["dolor torácico", "palpitaciones", "falta de aire"],
    "DERMATOLOGÍA": ["erupciones", "picazón", "lesiones en la piel"],
    "NEUMOLOGÍA": ["tos crónica", "asma", "dificultad respiratoria"],
    "OTORRINOLARINGOLOGÍA": ["sinusitis", "dolor de garganta", "otitis"],
    "NEUROLOGÍA": ["migrañas", "mareos", "debilidad"],
    "PEDIATRÍA": ["fiebre infantil", "control de crecimiento", "vacunas"],
    "GINECOLOGÍA Y OBSTETRICIA": ["dolor pélvico", "embarazo", "cambios menstruales"],
    "PSICOLOGÍA": ["estrés", "ansiedad", "procesos emocionales"],
    "PSIQUIATRÍA": ["depresión severa", "psicosis", "bipolaridad"],
    "UROLOGÍA": ["dolor al orinar", "cálculos", "problemas prostáticos"],
    "ENDOCRINOLOGÍA": ["tiroides", "metabolismo", "resistencia a la insulina"],
    "REUMATOLOGÍA": ["inflamación articular", "rigidez matutina", "dolor crónico"],
    "NEFROLOGÍA": ["edema", "alteraciones de orina", "insuficiencia renal"],
    "ONCOLOGÍA": ["masa palpable", "lesiones persistentes", "pérdida de peso"],
    "ODONTOLOGÍA": ["dolor dental", "sangrado de encías", "fractura dental"],
    "NUTRICIÓN": ["sobrepeso", "desnutrición", "dieta específica"],
    "TRAUMATOLOGÍA Y ORTOPEDIA": ["fracturas", "esguinces", "dolor articular"],
    "MEDICINA DE EMERGENCIA Y DESASTRES": ["trauma severo", "dificultad respiratoria aguda", "pérdida de conciencia"],
    "GERIATRÍA": ["caídas recurrentes", "deterioro cognitivo", "fragilidad"],
}


SPECIALTY_CAUTION: Dict[str, str] = {
    "MEDICINA DE EMERGENCIA Y DESASTRES": "Ante signos de alarma (dolor torácico intenso, falta de aire súbita, trauma severo) indica acudir a emergencias de inmediato.",
    "CARDIOLOGÍA": "Si hay dolor torácico opresivo, derivar a emergencias antes de cualquier recomendación.",
    "NEUROLOGÍA": "La pérdida súbita de fuerza o habla es una urgencia neurológica.",
}


def _build_specialty_details() -> List[SpecialtyInfo]:
    details: List[SpecialtyInfo] = []
    for name in SPECIALTY_LIST:
        description = SPECIALTY_DESCRIPTIONS.get(name, f"Especialidad enfocada en {name.lower()}.")
        common_signs = SPECIALTY_SIGNS.get(name, [f"Síntomas asociados a {name.lower()}"])
        caution = SPECIALTY_CAUTION.get(name)
        details.append(
            SpecialtyInfo(
                name=name,
                description=description,
                common_signs=common_signs,
                caution=caution,
            )
        )
    return details


SPECIALTY_DETAILS = _build_specialty_details()


def recommend_specialty(
    _ctx: RunContext[Any],
    description: str,
) -> SpecialtyCatalog:
    """Provide the full specialty catalog so the LLM can pick the best option."""

    concern = description.strip() if description and description.strip() else "Consulta general sin síntomas específicos."
    return SpecialtyCatalog(
        concern=concern,
        specialties=SPECIALTY_DETAILS,
        reminder="Analiza el motivo del paciente, elige la especialidad más adecuada y recuerda que está prohibida la automedicación.",
    )


__all__ = [
    "SPECIALTY_LIST",
    "SpecialtyInfo",
    "SpecialtyCatalog",
    "recommend_specialty",
]