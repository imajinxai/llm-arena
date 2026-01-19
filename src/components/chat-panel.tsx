import React, { useCallback, useMemo, useState, type ChangeEvent } from 'react'
import { ChatContainer, ChatMessages, ChatForm } from '@/components/ui/chat'
import { MessageInput } from '@/components/ui/message-input'
import { MessageList } from '@/components/ui/message-list'
import { CopyButton } from '@/components/ui/copy-button'
import { ModelSelector } from '@/components/model-selector'
import { ModelConfigPopover } from '@/components/model-config-popover'
import { PanelActionsMenu } from '@/components/panel-actions-menu'
import type { ChatPanel as ChatPanelType, LLMModel, ModelConfig, ChatMessage } from '@/types'
import type { Message } from '@/components/ui/chat-message'

interface ChatPanelProps {
  panel: ChatPanelType
  index: number
  totalPanels: number
  isSyncMode: boolean
  onModelChange: (model: LLMModel) => void
  onConfigChange: (config: ModelConfig) => void
  onSendMessage: (content: string) => void
  onStopGeneration: () => void
  onClearChat: () => void
  onMoveLeft: () => void
  onMoveRight: () => void
  onDelete: () => void
}

function convertToMessages(messages: ChatMessage[], isGenerating: boolean): Message[] {
  return messages.map((msg, index) => ({
    id: msg.id,
    role: msg.role,
    content: msg.content,
    reasoning: msg.reasoning,
    createdAt: msg.createdAt,
    isStreaming: isGenerating && msg.role === 'assistant' && index === messages.length - 1,
  }))
}

interface ChatComposerProps {
  model: LLMModel | null
  isGenerating: boolean
  onSendMessage: (content: string) => void
  onStopGeneration: () => void
}

const ChatComposer = React.memo(function ChatComposer({
  model,
  isGenerating,
  onSendMessage,
  onStopGeneration,
}: ChatComposerProps) {
  const [input, setInput] = useState('')

  const handleInputChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }, [])

  const handleSubmit = useCallback(
    (event?: { preventDefault?: () => void }) => {
      event?.preventDefault?.()
      if (input.trim() && model) {
        onSendMessage(input.trim())
        setInput('')
      }
    },
    [input, model, onSendMessage]
  )

  return (
    <ChatForm
      className="mt-auto p-4 bg-muted/50 rounded-b-lg"
      isPending={isGenerating}
      handleSubmit={handleSubmit}
    >
      {({ files, setFiles }) => (
        <MessageInput
          value={input}
          onChange={handleInputChange}
          allowAttachments
          files={files}
          setFiles={setFiles}
          stop={onStopGeneration}
          isGenerating={isGenerating}
          placeholder={model ? `Message ${model.name}...` : 'Select a model first...'}
        />
      )}
    </ChatForm>
  )
})

export function ChatPanel({
  panel,
  index,
  totalPanels,
  isSyncMode,
  onModelChange,
  onConfigChange,
  onSendMessage,
  onStopGeneration,
  onClearChat,
  onMoveLeft,
  onMoveRight,
  onDelete,
}: ChatPanelProps) {
  const messages = useMemo(
    () => convertToMessages(panel.messages, panel.isGenerating),
    [panel.messages, panel.isGenerating]
  )
  const lastMessage = messages.at(-1)
  const isTyping = lastMessage?.role === 'user'

  const messageOptions = useCallback(
    (message: Message) => ({
      actions: (
        <CopyButton
          content={message.content}
          copyMessage="Copied response to clipboard!"
        />
      ),
    }),
    []
  )

  return (
    <div className="flex flex-col h-full border rounded-lg bg-card">
      <div className="flex items-center justify-between p-2 border-b bg-muted/50 rounded-t-lg">
        <ModelSelector value={panel.model} onValueChange={onModelChange} />
        <div className="flex items-center gap-1">
          <ModelConfigPopover config={panel.config} onConfigChange={onConfigChange} />
          <PanelActionsMenu
            onClearChat={onClearChat}
            onMoveLeft={onMoveLeft}
            onMoveRight={onMoveRight}
            onDelete={onDelete}
            canMoveLeft={index > 0}
            canMoveRight={index < totalPanels - 1}
            canDelete={totalPanels > 1}
          />
        </div>
      </div>

      <ChatContainer className="flex-1 min-h-0">
        {messages.length > 0 && (
          <ChatMessages messages={messages}>
            <div className="p-2">
              <MessageList
                messages={messages}
                isTyping={isTyping}
                messageOptions={messageOptions}
              />
            </div>
          </ChatMessages>
        )}

        {!isSyncMode && (
          <ChatComposer
            model={panel.model}
            isGenerating={panel.isGenerating}
            onSendMessage={onSendMessage}
            onStopGeneration={onStopGeneration}
          />
        )}
      </ChatContainer>
    </div>
  )
}
