import { useState, useEffect } from 'react'
import { useAPIConfig } from '@/stores/api-config'
import type { LLMModel } from '@/types'

interface OpenAIModel {
  id: string
  object: string
  created: number
  owned_by: string
  name?: string
  description?: string
  context_window?: number
  max_tokens?: number
  type?: string
  tags?: string[]
  pricing?: {
    input?: string
    output?: string
  }
}

interface ModelsResponse {
  object: string
  data: OpenAIModel[]
}

export function useModels() {
  const { config } = useAPIConfig()
  const [models, setModels] = useState<LLMModel[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchModels() {
      if (!config.apiKey || !config.baseUrl) {
        setModels([])
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`${config.baseUrl}/models`, {
          headers: {
            'Authorization': `Bearer ${config.apiKey}`,
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          throw new Error(`Failed to fetch models: ${response.statusText}`)
        }

        const data: ModelsResponse = await response.json()
        
        const llmModels: LLMModel[] = data.data.map((model) => ({
          id: model.id,
          name: model.name || model.id,
          provider: model.owned_by || 'Unknown',
          description: model.description || `Model: ${model.id}`,
          contextWindow: model.context_window || 0,
          inputPricing: model.pricing?.input ? parseFloat(model.pricing.input) : 0,
          outputPricing: model.pricing?.output ? parseFloat(model.pricing.output) : 0,
          icon: getModelIcon(model.owned_by),
        }))

        // Sort models by provider, then by name
        llmModels.sort((a, b) => {
          if (a.provider !== b.provider) {
            return a.provider.localeCompare(b.provider)
          }
          return a.name.localeCompare(b.name)
        })

        setModels(llmModels)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch models')
        setModels([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchModels()
  }, [config.apiKey, config.baseUrl])

  const refetch = () => {
    if (config.apiKey && config.baseUrl) {
      setModels([])
      // Trigger re-fetch by updating a dependency
      const event = new CustomEvent('refetch-models')
      window.dispatchEvent(event)
    }
  }

  return { models, isLoading, error, refetch }
}

const ICON_CDN_BASE = 'https://registry.npmmirror.com/@lobehub/icons-static-svg/latest/files/icons'

const PROVIDER_ICON_MAP: Record<string, string> = {
  alibaba: 'alibaba-color',
  amazon: 'aws-color',
  aws: 'aws-color',
  anthropic: 'anthropic',
  'arcee-ai': 'arcee-color',
  arcee: 'arcee-color',
  bfl: 'bfl',
  bytedance: 'bytedance-color',
  cerebras: 'cerebras-color',
  cohere: 'cohere-color',
  deepseek: 'deepseek-color',
  google: 'google-color',
  groq: 'groq',
  inception: 'inception',
  kwaipilot: 'kwaipilot-color',
  meta: 'meta-color',
  llama: 'meta-color',
  minimax: 'minimax-color',
  mistral: 'mistral-color',
  moonshot: 'moonshot',
  moonshotai: 'moonshot',
  morph: 'morph-color',
  nvidia: 'nvidia-color',
  openai: 'openai',
  perplexity: 'perplexity-color',
  recraft: 'recraft',
  together: 'together-color',
  vercel: 'vercel',
  voyage: 'voyage-color',
  xai: 'xai',
  xiaomi: 'xiaomimimo',
  zai: 'zai',
}

function getModelIcon(owner: string): string {
  const ownerLower = owner?.toLowerCase() || ''
  
  for (const [key, iconName] of Object.entries(PROVIDER_ICON_MAP)) {
    if (ownerLower.includes(key)) {
      return `${ICON_CDN_BASE}/${iconName}.svg`
    }
  }
  
  return `${ICON_CDN_BASE}/openai.svg`
}
