import { SymptomGuideFlow } from '@/components/features/symptoms/SymptomGuideFlow';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Guía Interactiva | VitalSync',
  description:
    'Indica tus síntomas y recibe orientación personalizada sobre posibles condiciones de salud y próximos pasos a seguir.',
};

export default function SymptomGuidePage() {
  return <SymptomGuideFlow />;
}
