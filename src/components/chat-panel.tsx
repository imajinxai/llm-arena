import { useCallback, type ChangeEvent } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ChatContainer, ChatMessages, ChatForm } from '@/components/ui/chat'
import { MessageInput } from '@/components/ui/message-input'
import { MessageList } from '@/components/ui/message-list'
import { CopyButton } from '@/components/ui/copy-button'
import { ModelSelector } from '@/components/model-selector'
import { ModelConfigPopover } from '@/components/model-config-popover'
import { PanelActionsMenu } from '@/components/panel-actions-menu'
import { ModelInfoCard } from '@/components/model-info-card'
import type { ChatPanel as ChatPanelType, LLMModel, ModelConfig, ChatMessage } from '@/types'
import type { Message } from '@/components/ui/chat-message'

interface ChatPanelProps {
  panel: ChatPanelType
  index: number
  totalPanels: number
  onModelChange: (model: LLMModel) => void
  onConfigChange: (config: ModelConfig) => void
  onInputChange: (input: string) => void
  onSendMessage: (content: string) => void
  onStopGeneration: () => void
  onClearChat: () => void
  onMoveLeft: () => void
  onMoveRight: () => void
  onDelete: () => void
  onAddPanel: () => void
}

function convertToMessages(messages: ChatMessage[]): Message[] {
  return messages.map((msg) => ({
    id: msg.id,
    role: msg.role,
    content: msg.content,
    createdAt: msg.createdAt,
  }))
}

export function ChatPanel({
  panel,
  index,
  totalPanels,
  onModelChange,
  onConfigChange,
  onInputChange,
  onSendMessage,
  onStopGeneration,
  onClearChat,
  onMoveLeft,
  onMoveRight,
  onDelete,
  onAddPanel,
}: ChatPanelProps) {
  const messages = convertToMessages(panel.messages)
  const isEmpty = messages.length === 0
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
    <div className="flex flex-col h-full border-r last:border-r-0">
      <div className="flex items-center gap-1 p-2 border-b">
        <ModelSelector value={panel.model} onValueChange={onModelChange} />
        <ModelConfigPopover config={panel.config} onConfigChange={onConfigChange} />
        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onAddPanel}>
          <Plus className="h-4 w-4" />
        </Button>
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
        {isEmpty && panel.model && <ModelInfoCard model={panel.model} />}
        
        {!isEmpty && panel.model && (
          <div className="px-4 pt-4">
            <ModelInfoCard model={panel.model} />
          </div>
        )}

        {messages.length > 0 && (
          <ChatMessages messages={messages}>
            <MessageList
              messages={messages}
              isTyping={isTyping}
              messageOptions={messageOptions}
            />
          </ChatMessages>
        )}

        <ChatForm
          className="mt-auto p-4"
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
      </ChatContainer>
    </div>
  )
}
