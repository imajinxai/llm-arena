import { useState, useCallback, type ChangeEvent } from 'react'
import { ArrowUp, Stop } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface SyncInputProps {
  onSendToAll: (content: string) => void
  onStopAll: () => void
  isAnyGenerating: boolean
  panelCount: number
  panelsWithModels: number
}

export function SyncInput({
  onSendToAll,
  onStopAll,
  isAnyGenerating,
  panelCount,
  panelsWithModels,
}: SyncInputProps) {
  const [input, setInput] = useState('')

  const handleInputChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }, [])

  const handleSubmit = useCallback(
    (event?: { preventDefault?: () => void }) => {
      event?.preventDefault?.()
      if (input.trim() && panelsWithModels > 0) {
        onSendToAll(input.trim())
        setInput('')
      }
    },
    [input, panelsWithModels, onSendToAll]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        handleSubmit()
      }
    },
    [handleSubmit]
  )

  const isDisabled = panelsWithModels === 0

  return (
    <div className="border-t bg-muted/30 p-3">
      <form onSubmit={handleSubmit} className="flex items-end gap-2">
        <div className="relative flex-1">
          <textarea
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={
              isDisabled
                ? 'Select at least one model...'
                : `Send to all ${panelsWithModels} panel${panelsWithModels > 1 ? 's' : ''}...`
            }
            disabled={isDisabled}
            className={cn(
              'w-full resize-none rounded-lg border border-input bg-background px-3 py-2 pr-12 text-sm ring-offset-background',
              'placeholder:text-muted-foreground focus-visible:border-primary focus-visible:outline-none',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'min-h-[40px] max-h-[120px]'
            )}
            rows={1}
          />
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            {isAnyGenerating ? (
              <Button
                type="button"
                size="icon"
                className="h-7 w-7"
                onClick={onStopAll}
              >
                <Stop className="h-3 w-3 animate-pulse" weight="fill" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="icon"
                className="h-7 w-7"
                disabled={!input.trim() || isDisabled}
              >
                <ArrowUp className="h-4 w-4" weight="bold" />
              </Button>
            )}
          </div>
        </div>
      </form>
    </div>
  )
}
