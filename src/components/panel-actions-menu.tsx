import { MoreHorizontal, Trash2, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface PanelActionsMenuProps {
  onClearChat: () => void
  onMoveLeft: () => void
  onMoveRight: () => void
  onDelete: () => void
  canMoveLeft: boolean
  canMoveRight: boolean
  canDelete: boolean
}

export function PanelActionsMenu({
  onClearChat,
  onMoveLeft,
  onMoveRight,
  onDelete,
  canMoveLeft,
  canMoveRight,
  canDelete,
}: PanelActionsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={onClearChat}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Clear chat
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onMoveLeft} disabled={!canMoveLeft}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Move left
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onMoveRight} disabled={!canMoveRight}>
          <ArrowRight className="mr-2 h-4 w-4" />
          Move right
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={onDelete}
          disabled={!canDelete}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete chat
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
