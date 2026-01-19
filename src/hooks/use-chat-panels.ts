import { useState, useCallback } from 'react'
import { nanoid } from 'nanoid'
import OpenAI from 'openai'
import type { ChatPanel, ChatMessage, LLMModel, ModelConfig } from '@/types'
import { defaultModelConfig } from '@/types'
import { useAPIConfig } from '@/stores/api-config'

export function useChatPanels() {
  const [panels, setPanels] = useState<ChatPanel[]>(() => [
    createPanel(),
  ])
  const { config: apiConfig } = useAPIConfig()

  function createPanel(model: LLMModel | null = null): ChatPanel {
    return {
      id: nanoid(),
      model,
      config: { ...defaultModelConfig },
      messages: [],
      isGenerating: false,
      input: '',
    }
  }

  const addPanel = useCallback(() => {
    setPanels((prev) => [...prev, createPanel()])
  }, [])

  const removePanel = useCallback((panelId: string) => {
    setPanels((prev) => {
      if (prev.length <= 1) return prev
      return prev.filter((p) => p.id !== panelId)
    })
  }, [])

  const updatePanel = useCallback((panelId: string, updates: Partial<ChatPanel>) => {
    setPanels((prev) =>
      prev.map((p) => (p.id === panelId ? { ...p, ...updates } : p))
    )
  }, [])

  const setModel = useCallback((panelId: string, model: LLMModel) => {
    updatePanel(panelId, { model })
  }, [updatePanel])

  const setConfig = useCallback((panelId: string, config: ModelConfig) => {
    updatePanel(panelId, { config })
  }, [updatePanel])

  const setInput = useCallback((panelId: string, input: string) => {
    updatePanel(panelId, { input })
  }, [updatePanel])

  const clearMessages = useCallback((panelId: string) => {
    updatePanel(panelId, { messages: [] })
  }, [updatePanel])

  const movePanel = useCallback((panelId: string, direction: 'left' | 'right') => {
    setPanels((prev) => {
      const index = prev.findIndex((p) => p.id === panelId)
      if (index === -1) return prev
      
      const newIndex = direction === 'left' ? index - 1 : index + 1
      if (newIndex < 0 || newIndex >= prev.length) return prev

      const newPanels = [...prev]
      const [removed] = newPanels.splice(index, 1)
      newPanels.splice(newIndex, 0, removed)
      return newPanels
    })
  }, [])

  const sendMessage = useCallback(async (panelId: string, content: string) => {
    const panel = panels.find((p) => p.id === panelId)
    if (!panel || !panel.model) return

    const userMessage: ChatMessage = {
      id: nanoid(),
      role: 'user',
      content,
      createdAt: new Date(),
    }

    const updatedMessages = [...panel.messages, userMessage]

    updatePanel(panelId, {
      messages: updatedMessages,
      input: '',
      isGenerating: true,
    })

    // Check if API is configured
    if (!apiConfig.apiKey) {
      const errorMessage: ChatMessage = {
        id: nanoid(),
        role: 'assistant',
        content: '⚠️ **API Key not configured**\n\nPlease click the ⚙️ Settings button in the top-right corner to configure your API key and base URL.',
        createdAt: new Date(),
      }

      setPanels((prev) =>
        prev.map((p) =>
          p.id === panelId
            ? {
                ...p,
                messages: [...updatedMessages, errorMessage],
                isGenerating: false,
              }
            : p
        )
      )
      return
    }

    try {
      const openai = new OpenAI({
        apiKey: apiConfig.apiKey,
        baseURL: apiConfig.baseUrl,
        dangerouslyAllowBrowser: true,
      })

      const completion = await openai.chat.completions.create({
        model: panel.model.id,
        messages: updatedMessages.map((msg) => ({
          role: msg.role,
          content: msg.content,
        })),
        max_tokens: panel.config.maxOutputTokens,
        temperature: panel.config.temperature,
        top_p: panel.config.topP,
      })

      const assistantMessage: ChatMessage = {
        id: nanoid(),
        role: 'assistant',
        content: completion.choices[0]?.message?.content || 'No response received.',
        createdAt: new Date(),
      }

      setPanels((prev) =>
        prev.map((p) =>
          p.id === panelId
            ? {
                ...p,
                messages: [...updatedMessages, assistantMessage],
                isGenerating: false,
              }
            : p
        )
      )
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: nanoid(),
        role: 'assistant',
        content: `❌ **Error**\n\n${error instanceof Error ? error.message : 'An unknown error occurred.'}`,
        createdAt: new Date(),
      }

      setPanels((prev) =>
        prev.map((p) =>
          p.id === panelId
            ? {
                ...p,
                messages: [...updatedMessages, errorMessage],
                isGenerating: false,
              }
            : p
        )
      )
    }
  }, [panels, updatePanel, apiConfig])

  const stopGeneration = useCallback((panelId: string) => {
    updatePanel(panelId, { isGenerating: false })
  }, [updatePanel])

  return {
    panels,
    addPanel,
    removePanel,
    updatePanel,
    setModel,
    setConfig,
    setInput,
    clearMessages,
    movePanel,
    sendMessage,
    stopGeneration,
  }
}
