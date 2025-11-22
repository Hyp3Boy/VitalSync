export type SymptomSeverity = 'low' | 'medium' | 'high'

export type SymptomGuideStepId = 'area' | 'symptom' | 'conversation' | 'results'

export interface BodyArea {
  id: string
  label: string
  description: string
}

export interface CommonSymptom {
  id: string
  label: string
  icon: string
}

export interface SymptomGuideStep {
  id: SymptomGuideStepId
  label: string
  description: string
  progress: number
}

export interface SymptomConversationOption {
  id: string
  label: string
  helper?: string
}

export interface SymptomConversationBlock {
  id: string
  content: string
  icon?: string
  options?: SymptomConversationOption[]
}

export interface SymptomConversationAnswer {
  blockId: string
  optionId: string
  label: string
}

export interface SymptomConversationFeedback {
  blockId: string
  message: string
}

export interface SymptomGuideConversation {
  heading: string
  subheading: string
  blocks: SymptomConversationBlock[]
}

export interface SymptomResultAction {
  id: string
  level: string
  emphasis: SymptomSeverity
  title: string
  description: string
  ctaLabel: string
  ctaHref?: string
}

export interface SymptomGuideResult {
  title: string
  subtitle: string
  disclaimer: string
  possibleCauses: string[]
  actions: SymptomResultAction[]
}

export interface SymptomGuideResponse {
  steps: SymptomGuideStep[]
  areas: BodyArea[]
  symptoms: CommonSymptom[]
  conversation: SymptomGuideConversation
  result: SymptomGuideResult
}

export interface SymptomSubmissionPayload {
  areaId: string
  symptomIds: string[]
  conversationAnswers: SymptomConversationAnswer[]
}

export interface SymptomConversationPayload {
  blockId: string
  optionId: string
  label: string
  history: SymptomConversationAnswer[]
}

export interface SymptomConversationResponse {
  blockId: string
  message: string
}
