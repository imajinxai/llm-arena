// Main App Component
export { default as LLMArena } from './App'

// Components
export { ChatPanel } from './components/chat-panel'
export { ModelSelector } from './components/model-selector'
export { ModelConfigPopover } from './components/model-config-popover'
export { PanelActionsMenu } from './components/panel-actions-menu'
export { SyncInput } from './components/sync-input'
export { APIConfigDialog } from './components/api-config-dialog'

// UI Components
export {
  ChatContainer,
  ChatMessages,
  ChatForm,
} from './components/ui/chat'
export { ChatMessage } from './components/ui/chat-message'
export { MessageInput } from './components/ui/message-input'
export { MessageList } from './components/ui/message-list'
export { CopyButton } from './components/ui/copy-button'
export { Button, buttonVariants } from './components/ui/button'
export { Input } from './components/ui/input'
export { Badge, badgeVariants } from './components/ui/badge'
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './components/ui/card'
export { ScrollArea, ScrollBar } from './components/ui/scroll-area'
export { Separator } from './components/ui/separator'
export { Slider } from './components/ui/slider'
export { Popover, PopoverTrigger, PopoverContent } from './components/ui/popover'
export {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogClose,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from './components/ui/dialog'
export {
  AlertDialog,
  AlertDialogPortal,
  AlertDialogOverlay,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from './components/ui/alert-dialog'
export {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuGroup,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuRadioGroup,
} from './components/ui/dropdown-menu'
export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
} from './components/ui/command'
export {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from './components/ui/collapsible'
export { MarkdownRenderer } from './components/ui/markdown-renderer'
export { default as LazyMarkdown } from './components/ui/lazy-markdown'
export { TypingIndicator } from './components/ui/typing-indicator'
export { FilePreview } from './components/ui/file-preview'
export { AudioVisualizer } from './components/ui/audio-visualizer'
export { InterruptPrompt } from './components/ui/interrupt-prompt'
export { PromptSuggestions } from './components/ui/prompt-suggestions'
export { ErrorBoundary } from './components/ui/error-boundary'
export { Toaster } from './components/ui/sonner'

// Hooks
export { useChatPanels } from './hooks/use-chat-panels'
export { useModels } from './hooks/use-models'
export { useAutoScroll } from './hooks/use-auto-scroll'
export { useAutosizeTextArea } from './hooks/use-autosize-textarea'
export { useCopyToClipboard } from './hooks/use-copy-to-clipboard'
export { useAudioRecording } from './hooks/use-audio-recording'

// Stores
export { useAPIConfig } from './stores/api-config'
export type { APIConfig } from './stores/api-config'
export { useTheme } from './stores/theme'

// Utils
export { cn } from './lib/utils'
export { getHighlighter, highlightCode } from './lib/shiki-highlighter'
export * from './lib/audio-utils'

// Types
export * from './types'

// Styles - consumers need to import this CSS
import './index.css'
