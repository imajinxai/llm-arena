import { X } from "@phosphor-icons/react"

interface InterruptPromptProps {
  isOpen: boolean
  close: () => void
}

export function InterruptPrompt({ isOpen, close }: InterruptPromptProps) {
  if (!isOpen) return null
  
  return (
    <div className="absolute -top-10 left-1/2 flex -translate-x-1/2 overflow-hidden whitespace-nowrap rounded-full border bg-background py-1 text-center text-sm text-muted-foreground animate-in fade-in-0 slide-in-from-bottom-2 duration-200">
      <span className="ml-2.5">Press Enter again to interrupt</span>
      <button
        className="ml-1 mr-2.5 flex items-center"
        type="button"
        onClick={close}
        aria-label="Close"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  )
}
