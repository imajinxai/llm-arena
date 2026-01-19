import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface APIConfig {
  baseUrl: string
  apiKey: string
}

interface APIConfigStore {
  config: APIConfig
  setConfig: (config: Partial<APIConfig>) => void
}

export const useAPIConfig = create<APIConfigStore>()(
  persist(
    (set) => ({
      config: {
        baseUrl: 'https://api.cerebras.ai/v1',
        apiKey: '',
      },
      setConfig: (newConfig) =>
        set((state) => ({
          config: { ...state.config, ...newConfig },
        })),
    }),
    {
      name: 'sabung-llm-api-config',
    }
  )
)
