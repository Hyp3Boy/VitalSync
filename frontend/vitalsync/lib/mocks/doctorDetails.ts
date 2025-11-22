import { DoctorDetailResponse } from '@/types/doctor'; // Asegúrate de importar Review si lo tienes definido
import { mockDoctors } from './doctors';

// --- 1. Bancos de Datos para Variedad ---

const universities = [
  'Universidad Nacional Mayor de San Marcos',
  'Universidad Peruana Cayetano Heredia',
  'Universidad de San Martín de Porres',
  'Universidad Científica del Sur',
  'Universidad Nacional Federico Villarreal',
];

const bios = [
  'Especialista apasionado por la medicina preventiva y el bienestar integral del paciente.',
  'Con amplia experiencia en casos complejos, enfocado en brindar un diagnóstico preciso y trato humano.',
  'Investigador activo en nuevas tecnologías médicas y tratamientos mínimamente invasivos.',
  'Comprometido con la salud familiar, brindando atención cercana y seguimiento personalizado.',
  'Destacado por su paciencia y claridad al explicar diagnósticos, con postgrados en el extranjero.',
];

const positiveComments = [
  'Excelente atención, explica todo con mucha paciencia y detalle.',
  'Me sentí muy cómodo, el doctor es muy profesional y acertado.',
  'Las instalaciones son impecables y la atención fue puntual.',
  'Un trato muy humano, realmente se preocupa por sus pacientes.',
  'El tratamiento funcionó a la perfección, muy recomendado.',
  'Gran profesional, resolvió todas mis dudas sobre el procedimiento.',
];

const neutralComments = [
  'Buen doctor, pero la espera en recepción fue un poco larga.',
  'La atención fue correcta, aunque me hubiera gustado más detalle en la receta.',
  'Todo bien, pero es difícil conseguir cita con él.',
  'Profesional y directo, aunque la consulta fue algo rápida.',
];

const userNames = [
  'María Gómez',
  'Luis Fernández',
  'Jorge Quispe',
  'Ana Paula Ruiz',
  'Carlos Mamani',
  'Fiorella Chávez',
  'Miguel Ángel Torres',
  'Andrea Castillo',
  'Roberto Sánchez',
  'Lucía Benavides',
];

// --- 2. Funciones Helper ---

const createPseudoRandom = (seed: number) => {
  let current = seed;
  return () => {
    const x = Math.sin(current++) * 10000;
    return x - Math.floor(x);
  };
};

const pickFrom = <T>(arr: T[], random: () => number): T =>
  arr[Math.floor(random() * arr.length)];

const getRandomDate = (random: () => number) => {
  const start = new Date();
  start.setMonth(start.getMonth() - 6);
  const end = new Date();
  return new Date(
    start.getTime() + random() * (end.getTime() - start.getTime())
  )
    .toISOString()
    .split('T')[0];
};

const generateReviews = (
  doctorId: string,
  count: number,
  random: () => number
) => {
  const reviews = [];
  for (let i = 0; i < count; i++) {
    const isPositive = random() > 0.3;
    const rating = isPositive
      ? Math.floor(random() * 2) + 4
      : Math.floor(random() * 2) + 2;

    reviews.push({
      id: `${doctorId}-review-${i}`,
      doctorId: doctorId,
      authorName: pickFrom(userNames, random),
      rating: rating,
      comment: isPositive
        ? pickFrom(positiveComments, random)
        : pickFrom(neutralComments, random),
      createdAt: getRandomDate(random),
    });
  }
  return reviews.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
};

// --- 3. Generación del Mapa de Detalles ---

const detailMap: Record<string, DoctorDetailResponse> = {};

mockDoctors.forEach((doctor, index) => {
  const random = createPseudoRandom(index + 1);
  const bioIndex = index % bios.length;
  const uniIndex = index % universities.length;

  const reviewCount = Math.floor(random() * 5) + 3;

  detailMap[doctor.id] = {
    doctor: {
      ...doctor,
      bio: bios[bioIndex],
      yearsExperience: 8 + Math.floor(random() * 15),
      languages: [
        'Español',
        random() > 0.5 ? 'Inglés' : random() > 0.5 ? 'Quechua' : 'Portugués',
      ],
      education: universities[uniIndex],
      clinicAddress:
        doctor.location === 'Cusco' || doctor.location === 'Arequipa'
          ? `Av. Principal 123, ${doctor.location}`
          : `Av. Javier Prado 45${index}, ${doctor.location}`, // Dirección fake en Lima
    },
    reviews: generateReviews(doctor.id, reviewCount, random),
  };
});

export const mockDoctorDetails = detailMap;
