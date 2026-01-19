export interface LLMModel {
  id: string
  name: string
  provider: string
  description: string
  contextWindow: number
  inputPricing: number
  outputPricing: number
  icon?: string
  links?: {
    modelPage?: string
    pricing?: string
    terms?: string
    privacy?: string
    website?: string
  }
}

export interface ModelConfig {
  maxOutputTokens: number
  temperature: number
  topP: number
  topK?: number
  presencePenalty?: number
  frequencyPenalty?: number
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  reasoning?: string
  createdAt: Date
}

export interface ChatPanel {
  id: string
  model: LLMModel | null
  config: ModelConfig
  messages: ChatMessage[]
  isGenerating: boolean
}

export const defaultModelConfig: ModelConfig = {
  maxOutputTokens: 4096,
  temperature: 0.7,
  topP: 0.95,
  topK: 40,
  presencePenalty: 0,
  frequencyPenalty: 0,
}
