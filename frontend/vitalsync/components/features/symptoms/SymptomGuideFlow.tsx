'use client';

import { useEffect, useMemo } from 'react';
import { useSymptomGuide } from '@/hooks/useSymptomGuide';
import { useSymptomConversation } from '@/hooks/useSymptomConversation';
import { useSymptomGuideStore } from '@/store/useSymptomGuideStore';
import { SymptomGuideShell } from '@/components/features/symptoms/SymptomGuideShell';
import { BodyAreaSelector } from '@/components/features/symptoms/BodyAreaSelector';
import { CommonSymptomsGrid } from '@/components/features/symptoms/CommonSymptomsGrid';
import { SymptomConversation } from '@/components/features/symptoms/SymptomConversation';
import { SymptomResultsPanel } from '@/components/features/symptoms/SymptomResultsPanel';
import { Button } from '@/components/ui/button';
import type { SymptomGuideResult, SymptomGuideStep } from '@/types/symptom';
import Image from 'next/image';
import { Loader2 } from 'lucide-react';

const fallbackStep: SymptomGuideStep = {
  id: 'area',
  label: 'Preparando experiencia',
  description: 'Cargando guía interactiva de síntomas',
  progress: 0,
};

const emptyResult: SymptomGuideResult = {
  title: 'Resultado preliminar',
  subtitle: '',
  disclaimer: '',
  possibleCauses: [],
  actions: [],
};

export const SymptomGuideFlow = () => {
  const { query, mutation } = useSymptomGuide();
  const conversationMutation = useSymptomConversation();

  const stepIndex = useSymptomGuideStore((state) => state.currentStepIndex);
  const setArea = useSymptomGuideStore((state) => state.setArea);
  const toggleSymptom = useSymptomGuideStore((state) => state.toggleSymptom);
  const selectedAreaId = useSymptomGuideStore((state) => state.selectedAreaId);
  const selectedSymptomIds = useSymptomGuideStore(
    (state) => state.selectedSymptomIds
  );
  const conversationAnswers = useSymptomGuideStore(
    (state) => state.conversationAnswers
  );
  const conversationFeedback = useSymptomGuideStore(
    (state) => state.conversationFeedback
  );
  const saveConversationAnswer = useSymptomGuideStore(
    (state) => state.saveConversationAnswer
  );
  const goNext = useSymptomGuideStore((state) => state.goNext);
  const goBack = useSymptomGuideStore((state) => state.goBack);
  const reset = useSymptomGuideStore((state) => state.reset);
  const setMaxStepIndex = useSymptomGuideStore(
    (state) => state.setMaxStepIndex
  );

  const steps = query.data?.steps ?? [];
  const areas = query.data?.areas ?? [];
  const symptoms = query.data?.symptoms ?? [];
  const conversationData = query.data?.conversation ?? {
    heading: '',
    subheading: '',
    blocks: [],
  };
  const resultData = query.data?.result ?? emptyResult;

  const stepsCount = steps.length;

  useEffect(() => {
    if (stepsCount > 0) {
      setMaxStepIndex(stepsCount - 1);
    }
  }, [stepsCount, setMaxStepIndex]);

  const questionBlocks = useMemo(
    () =>
      conversationData.blocks.filter(
        (block) => block.options && block.options.length > 0
      ),
    [conversationData.blocks]
  );

  const currentStep = steps[stepIndex] ?? fallbackStep;

  const allConversationAnswered = questionBlocks.every((block) =>
    conversationAnswers.some((answer) => answer.blockId === block.id)
  );

  const isNextDisabled = useMemo(() => {
    switch (currentStep.id) {
      case 'area':
        return !selectedAreaId;
      case 'symptom':
        return selectedSymptomIds.length === 0;
      case 'conversation':
        return !allConversationAnswered || mutation.isPending;
      default:
        return false;
    }
  }, [
    currentStep.id,
    selectedAreaId,
    selectedSymptomIds.length,
    allConversationAnswered,
    mutation.isPending,
  ]);

  if (query.isLoading || !query.data) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  const handleConversationSelect = (
    blockId: string,
    option: { id: string; label: string }
  ) => {
    const answer = { blockId, optionId: option.id, label: option.label };
    const nextHistory = [
      ...conversationAnswers.filter((item) => item.blockId !== blockId),
      answer,
    ];
    saveConversationAnswer(answer);
    conversationMutation.mutate({
      blockId,
      optionId: option.id,
      label: option.label,
      history: nextHistory,
    });
  };

  const handleNext = () => {
    if (currentStep.id === 'results') {
      reset();
      return;
    }

    if (currentStep.id === 'conversation') {
      if (mutation.isPending) return;
      mutation.mutate(undefined, {
        onSuccess: () => {
          goNext();
        },
      });
      return;
    }

    goNext();
  };

  return (
    <SymptomGuideShell
      step={currentStep}
      stepIndex={stepIndex}
      totalSteps={steps.length}
    >
      {currentStep.id === 'area' && (
        <div className="grid gap-8 py-6 md:grid-cols-[1fr_1.2fr]">
          <div className="flex items-center justify-center">
            <Image
              src="/assets/images/body-diagram.png"
              alt="Diagrama del cuerpo humano"
              width={320}
              height={480}
              className="h-auto max-h-[360px] w-full object-contain"
            />
          </div>
          <div className="space-y-4">
            <p className="text-lg font-semibold text-foreground">
              Selecciona el área donde sientes malestar
            </p>
            <BodyAreaSelector
              areas={areas}
              selectedId={selectedAreaId}
              onSelect={setArea}
            />
          </div>
        </div>
      )}

      {currentStep.id === 'symptom' && (
        <div className="space-y-4 rounded-3xl border border-border/70 bg-card/70 p-6 shadow-sm">
          <p className="text-lg font-semibold text-foreground">
            Selecciona los síntomas que se aplican a tu caso
          </p>
          <CommonSymptomsGrid
            symptoms={symptoms}
            selectedIds={selectedSymptomIds}
            onToggle={toggleSymptom}
          />
        </div>
      )}

      {currentStep.id === 'conversation' && (
        <div className="space-y-6 rounded-3xl border border-border/70 bg-card/70 p-6 shadow-sm">
          <div className="space-y-1 text-center">
            <p className="text-2xl font-bold text-foreground">
              {conversationData.heading}
            </p>
            <p className="text-base text-muted-foreground">
              {conversationData.subheading}
            </p>
          </div>
          <SymptomConversation
            blocks={conversationData.blocks}
            answers={conversationAnswers}
            feedback={conversationFeedback}
            isSending={conversationMutation.isPending}
            onSelect={handleConversationSelect}
          />
        </div>
      )}

      {currentStep.id === 'results' && (
        <div className="space-y-6 rounded-3xl border border-border/70 bg-card/70 p-6 shadow-sm">
          <SymptomResultsPanel result={resultData} />
        </div>
      )}

      <div className="flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Button
          type="button"
          variant="ghost"
          className="h-12 rounded-full border border-border/80 bg-muted text-muted-foreground"
          disabled={stepIndex === 0 || mutation.isPending}
          onClick={goBack}
        >
          Atrás
        </Button>
        <Button
          type="button"
          className="h-12 rounded-full bg-secondary text-secondary-foreground"
          disabled={isNextDisabled}
          onClick={handleNext}
        >
          {currentStep.id === 'results'
            ? 'Finalizar'
            : mutation.isPending && currentStep.id === 'conversation'
            ? 'Generando resultado...'
            : 'Siguiente paso'}
        </Button>
      </div>
    </SymptomGuideShell>
  );
};
