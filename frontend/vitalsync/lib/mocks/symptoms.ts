import { SymptomGuideResponse } from '@/types/symptom'

export const mockSymptomGuide: SymptomGuideResponse = {
  steps: [
    {
      id: 'area',
      label: 'Paso 1 de 4',
      description: 'Selecciona el área del cuerpo con malestar',
      progress: 25,
    },
    {
      id: 'symptom',
      label: 'Paso 2 de 4',
      description: 'Elige los síntomas que presentas',
      progress: 50,
    },
    {
      id: 'conversation',
      label: 'Paso 3 de 4',
      description: 'Habla con nuestra IA para afinar los detalles',
      progress: 75,
    },
    {
      id: 'results',
      label: 'Paso 4 de 4',
      description: 'Revisa el resultado preliminar y sugerencias',
      progress: 100,
    },
  ],
  areas: [
    {
      id: 'head',
      label: 'Cabeza',
      description: 'Dolor, migraña, mareos',
    },
    {
      id: 'chest',
      label: 'Pecho',
      description: 'Dificultad para respirar, presión',
    },
    {
      id: 'abdomen',
      label: 'Abdomen',
      description: 'Retortijones, náuseas',
    },
    {
      id: 'limbs',
      label: 'Extremidades',
      description: 'Dolor muscular, articulaciones',
    },
  ],
  symptoms: [
    { id: 'fever', label: 'Fiebre', icon: 'local_fire_department' },
    { id: 'headache', label: 'Dolor de cabeza', icon: 'sentiment_dissatisfied' },
    { id: 'nausea', label: 'Náuseas', icon: 'sick' },
    { id: 'cough', label: 'Tos', icon: 'air' },
    { id: 'fatigue', label: 'Fatiga', icon: 'sentiment_very_dissatisfied' },
    { id: 'chills', label: 'Escalofríos', icon: 'ac_unit' },
    { id: 'sore-throat', label: 'Dolor de garganta', icon: 'thermostat' },
    { id: 'dizziness', label: 'Mareo', icon: 'mood_bad' },
    { id: 'other', label: 'Otro', icon: 'more_horiz' },
  ],
  conversation: {
    heading: 'Hablemos con la IA de Symptom Guide',
    subheading:
      'Responde un par de preguntas rápidas para que podamos reducir las posibles causas y elegir la recomendación adecuada.',
    blocks: [
      {
        id: 'intro-1',
        content:
          'Entiendo que estás experimentando dolor de cabeza. Dame un poco más de contexto para ayudarte mejor.',
        icon: 'health_and_safety',
      },
      {
        id: 'pain-quality',
        content: '¿El dolor es punzante o una presión constante?',
        icon: 'health_and_safety',
        options: [
          { id: 'sharp', label: 'Punzante' },
          { id: 'pressure', label: 'Presión constante' },
        ],
      },
      {
        id: 'other-symptoms',
        content: '¿Tienes otros síntomas como náuseas o sensibilidad a la luz?',
        icon: 'health_and_safety',
        options: [
          { id: 'nausea', label: 'Náuseas' },
          { id: 'photophobia', label: 'Sensibilidad a la luz' },
          { id: 'none', label: 'Ninguno' },
        ],
      },
    ],
  },
  result: {
    title: 'Resultado preliminar',
    subtitle: 'Resumen personalizado con posibles causas',
    disclaimer:
      'Esto no es un diagnóstico médico definitivo. Es una orientación inicial que debe ser evaluada por un profesional.',
    possibleCauses: ['Resfriado común', 'Gripe (Influenza)', 'Faringitis estreptocócica'],
    actions: [
      {
        id: 'urgent-care',
        level: 'Nivel 3: Atención urgente',
        emphasis: 'high',
        title: 'Considera buscar atención médica inmediata si los síntomas empeoran rápidamente.',
        description:
          'Dolor intenso, fiebre alta persistente o dificultad para respirar ameritan acudir a un servicio de urgencias.',
        ctaLabel: 'Hospital de emergencia más cercano',
        ctaHref: '#',
      },
      {
        id: 'consultation',
        level: 'Nivel 2: Consulta médica',
        emphasis: 'medium',
        title: 'Agenda una consulta con un médico general para obtener un diagnóstico preciso.',
        description:
          'Un especialista puede solicitar estudios adicionales y definir el tratamiento adecuado.',
        ctaLabel: 'Buscar un médico general',
        ctaHref: '#',
      },
      {
        id: 'self-care',
        level: 'Nivel 1: Autocuidado',
        emphasis: 'low',
        title: 'Descansa, hidrátate y monitorea tus síntomas durante las próximas 24 horas.',
        description:
          'Si notas nuevos síntomas o cambios repentinos, vuelve a contactarnos o consulta a un profesional.',
        ctaLabel: 'Más información',
        ctaHref: '#',
      },
    ],
  },
}
