import { Circle } from "@phosphor-icons/react"

export function TypingIndicator() {
  return (
    <div className="justify-left flex space-x-1">
      <div className="rounded-lg bg-muted p-3">
        <div className="flex space-x-1">
          <Circle className="h-2 w-2 animate-typing-dot-bounce" weight="fill" />
          <Circle className="h-2 w-2 animate-typing-dot-bounce [animation-delay:90ms]" weight="fill" />
          <Circle className="h-2 w-2 animate-typing-dot-bounce [animation-delay:180ms]" weight="fill" />
        </div>
      </div>
    </div>
  )
}
