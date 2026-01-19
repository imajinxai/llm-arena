import { useState, useEffect } from 'react'
import { useAPIConfig } from '@/stores/api-config'
import type { LLMModel } from '@/types'

interface OpenAIModel {
  id: string
  object: string
  created: number
  owned_by: string
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
          name: model.id,
          provider: model.owned_by || 'Unknown',
          description: `Model: ${model.id}`,
          contextWindow: 0,
          inputPricing: 0,
          outputPricing: 0,
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

function getModelIcon(owner: string): string {
  const ownerLower = owner?.toLowerCase() || ''
  
  if (ownerLower.includes('openai')) return '💚'
  if (ownerLower.includes('anthropic')) return '🎭'
  if (ownerLower.includes('google')) return '💎'
  if (ownerLower.includes('meta') || ownerLower.includes('llama')) return '🦙'
  if (ownerLower.includes('mistral')) return '🌬️'
  if (ownerLower.includes('cerebras')) return '🧠'
  if (ownerLower.includes('groq')) return '⚡'
  if (ownerLower.includes('together')) return '🤝'
  if (ownerLower.includes('deepseek')) return '🔍'
  
  return '🤖'
}
