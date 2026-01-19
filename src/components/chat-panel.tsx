import { useCallback, useMemo, type ChangeEvent } from 'react'
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
  onInputChange: (input: string) => void
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
    createdAt: msg.createdAt,
    isStreaming: isGenerating && msg.role === 'assistant' && index === messages.length - 1,
  }))
}

export function ChatPanel({
  panel,
  index,
  totalPanels,
  isSyncMode,
  onModelChange,
  onConfigChange,
  onInputChange,
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

  const handleInputChange = useCallback(
    (e: ChangeEvent<HTMLTextAreaElement>) => {
      onInputChange(e.target.value)
    },
    [onInputChange]
  )

  const handleSubmit = useCallback(
    (event?: { preventDefault?: () => void }) => {
      event?.preventDefault?.()
      if (panel.input.trim() && panel.model) {
        onSendMessage(panel.input.trim())
      }
    },
    [panel.input, panel.model, onSendMessage]
  )

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
      <div className="flex items-center gap-1 p-2 border-b bg-muted/50 rounded-t-lg">
        <ModelSelector value={panel.model} onValueChange={onModelChange} />
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
          <ChatForm
            className="mt-auto p-4 bg-muted/50 rounded-b-lg"
            isPending={panel.isGenerating || isTyping}
            handleSubmit={handleSubmit}
          >
            {({ files, setFiles }) => (
              <MessageInput
                value={panel.input}
                onChange={handleInputChange}
                allowAttachments
                files={files}
                setFiles={setFiles}
                stop={onStopGeneration}
                isGenerating={panel.isGenerating}
                placeholder={panel.model ? `Message ${panel.model.name}...` : 'Select a model first...'}
              />
            )}
          </ChatForm>
        )}
      </ChatContainer>
    </div>
  )
}
