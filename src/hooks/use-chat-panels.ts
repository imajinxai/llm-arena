import { useState, useCallback, useRef, useEffect } from 'react'
import { nanoid } from 'nanoid'
import type { ChatPanel, ChatMessage, LLMModel, ModelConfig } from '@/types'
import { defaultModelConfig } from '@/types'
import { useAPIConfig } from '@/stores/api-config'

interface StreamChoice {
  index: number
  delta: {
    role?: string
    content?: string
  }
  finish_reason: string | null
}

interface StreamChunk {
  id: string
  object: string
  created: number
  model: string
  choices: StreamChoice[]
}

const THROTTLE_MS = 50

export function useChatPanels() {
  const [panels, setPanels] = useState<ChatPanel[]>(() => [
    createPanel(),
  ])
  const { config: apiConfig } = useAPIConfig()
  const abortControllersRef = useRef<Map<string, AbortController>>(new Map())
  const panelsRef = useRef(panels)

  useEffect(() => {
    panelsRef.current = panels
  }, [panels])

  useEffect(() => {
    const controllers = abortControllersRef.current
    return () => {
      controllers.forEach((controller) => controller.abort())
      controllers.clear()
    }
  }, [])

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
    const controller = abortControllersRef.current.get(panelId)
    if (controller) {
      controller.abort()
      abortControllersRef.current.delete(panelId)
    }
    
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
    const panel = panelsRef.current.find((p) => p.id === panelId)
    if (!panel || !panel.model) return

    const modelId = panel.model.id
    const config = { ...panel.config }

    const userMessage: ChatMessage = {
      id: nanoid(),
      role: 'user',
      content,
      createdAt: new Date(),
    }

    const assistantMessageId = nanoid()
    const updatedMessages = [...panel.messages, userMessage]

    updatePanel(panelId, {
      messages: updatedMessages,
      input: '',
      isGenerating: true,
    })

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

    const abortController = new AbortController()
    abortControllersRef.current.set(panelId, abortController)

    try {
      const response = await fetch(`${apiConfig.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiConfig.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: modelId,
          messages: updatedMessages.map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          max_tokens: config.maxOutputTokens,
          temperature: config.temperature,
          top_p: config.topP,
          stream: true,
        }),
        signal: abortController.signal,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`)
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('No response body')

      const decoder = new TextDecoder()
      const contentRef = { current: '' }
      let buffer = ''
      let lastUpdateTime = 0
      let pendingUpdate = false

      const assistantMessage: ChatMessage = {
        id: assistantMessageId,
        role: 'assistant',
        content: '',
        createdAt: new Date(),
      }

      setPanels((prev) =>
        prev.map((p) =>
          p.id === panelId
            ? { ...p, messages: [...updatedMessages, assistantMessage] }
            : p
        )
      )

      const flushUpdate = () => {
        setPanels((prev) =>
          prev.map((p) =>
            p.id === panelId
              ? {
                  ...p,
                  messages: p.messages.map((m) =>
                    m.id === assistantMessageId
                      ? { ...m, content: contentRef.current }
                      : m
                  ),
                }
              : p
          )
        )
        pendingUpdate = false
      }

      const scheduleUpdate = () => {
        if (pendingUpdate) return
        
        const now = Date.now()
        const timeSinceLastUpdate = now - lastUpdateTime
        
        if (timeSinceLastUpdate >= THROTTLE_MS) {
          lastUpdateTime = now
          flushUpdate()
        } else {
          pendingUpdate = true
          setTimeout(() => {
            lastUpdateTime = Date.now()
            flushUpdate()
          }, THROTTLE_MS - timeSinceLastUpdate)
        }
      }

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          const trimmed = line.trim()
          if (!trimmed || !trimmed.startsWith('data: ')) continue
          
          const data = trimmed.slice(6)
          if (data === '[DONE]') continue

          try {
            const parsed: StreamChunk = JSON.parse(data)
            const delta = parsed.choices[0]?.delta?.content
            if (delta) {
              contentRef.current += delta
              scheduleUpdate()
            }
          } catch {
            // Skip invalid JSON chunks
          }
        }
      }

      if (buffer.trim()) {
        const trimmed = buffer.trim()
        if (trimmed.startsWith('data: ') && trimmed.slice(6) !== '[DONE]') {
          try {
            const parsed: StreamChunk = JSON.parse(trimmed.slice(6))
            const delta = parsed.choices[0]?.delta?.content
            if (delta) {
              contentRef.current += delta
            }
          } catch {
            // Skip invalid JSON
          }
        }
      }

      flushUpdate()

      setPanels((prev) =>
        prev.map((p) =>
          p.id === panelId ? { ...p, isGenerating: false } : p
        )
      )
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        setPanels((prev) =>
          prev.map((p) =>
            p.id === panelId ? { ...p, isGenerating: false } : p
          )
        )
        return
      }

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
    } finally {
      abortControllersRef.current.delete(panelId)
    }
  }, [updatePanel, apiConfig])

  const sendToAllPanels = useCallback(async (content: string) => {
    const panelsWithModels = panelsRef.current.filter((p) => p.model !== null)
    if (panelsWithModels.length === 0) return

    await Promise.all(
      panelsWithModels.map((panel) => sendMessage(panel.id, content))
    )
  }, [sendMessage])

  const stopGeneration = useCallback((panelId: string) => {
    const controller = abortControllersRef.current.get(panelId)
    if (controller) {
      controller.abort()
      abortControllersRef.current.delete(panelId)
    }
    updatePanel(panelId, { isGenerating: false })
  }, [updatePanel])

  const stopAllGenerations = useCallback(() => {
    panelsRef.current.forEach((panel) => {
      if (panel.isGenerating) {
        stopGeneration(panel.id)
      }
    })
  }, [stopGeneration])

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
    sendToAllPanels,
    stopGeneration,
    stopAllGenerations,
  }
}
