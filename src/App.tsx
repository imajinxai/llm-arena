import { useState, useRef, useCallback, useEffect } from 'react'
import { useChatPanels } from '@/hooks/use-chat-panels'
import { ChatPanel } from '@/components/chat-panel'
import { SyncInput } from '@/components/sync-input'
import { APIConfigDialog } from '@/components/api-config-dialog'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Link, LinkBreak, DotsSix, Plus, Eraser, Sun, Moon } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { useTheme } from '@/stores/theme'

function App() {
  const [isSyncMode, setIsSyncMode] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef<HTMLDivElement>(null)
  const positionRef = useRef({ x: window.innerWidth - 60, y: window.innerHeight / 2 - 60 })
  const dragStartRef = useRef({ x: 0, y: 0, posX: 0, posY: 0 })

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return
    e.preventDefault()
    setIsDragging(true)
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      posX: positionRef.current.x,
      posY: positionRef.current.y,
    }
  }, [])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragRef.current) return
      const dx = e.clientX - dragStartRef.current.x
      const dy = e.clientY - dragStartRef.current.y
      const newX = Math.max(0, Math.min(window.innerWidth - 48, dragStartRef.current.posX + dx))
      const newY = Math.max(0, Math.min(window.innerHeight - 120, dragStartRef.current.posY + dy))
      positionRef.current = { x: newX, y: newY }
      dragRef.current.style.transform = `translate3d(${newX}px, ${newY}px, 0)`
    }

    const handleMouseUp = () => setIsDragging(false)

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging])

  useEffect(() => {
    if (dragRef.current) {
      dragRef.current.style.transform = `translate3d(${positionRef.current.x}px, ${positionRef.current.y}px, 0)`
    }
  }, [])

  const {
    panels,
    addPanel,
    removePanel,
    setModel,
    setConfig,
    clearMessages,
    clearAllMessages,
    movePanel,
    sendMessage,
    sendToAllPanels,
    stopGeneration,
    stopAllGenerations,
  } = useChatPanels()

  const isAnyGenerating = panels.some((p) => p.isGenerating)
  const panelsWithModels = panels.filter((p) => p.model !== null).length
  const { theme, toggleTheme } = useTheme()

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background">
      <div
        ref={dragRef}
        onMouseDown={handleMouseDown}
        className={cn(
          'fixed z-50 p-[2px] rounded-lg animate-gradient-border',
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        )}
        style={{ left: 0, top: 0, willChange: 'transform' }}
      >
        <div className="flex flex-col gap-1 p-1 rounded-[8px] bg-background/95 backdrop-blur-sm">
          <div className="flex justify-center py-0.5">
            <DotsSix className="h-3 w-3 text-muted-foreground" weight="bold" />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={addPanel}
            className="h-8 w-8"
          >
            <Plus className="h-4 w-4" weight="bold" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsSyncMode(!isSyncMode)}
            className={cn('h-8 w-8', isSyncMode && 'bg-primary text-primary-foreground hover:bg-primary/90')}
          >
            {isSyncMode ? <Link className="h-4 w-4" weight="bold" /> : <LinkBreak className="h-4 w-4" weight="bold" />}
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <Eraser className="h-4 w-4" weight="bold" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Clear all chats?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will clear all chat messages from all panels. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={clearAllMessages}>Clear all</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button
            variant="outline"
            size="icon"
            onClick={toggleTheme}
            className="h-8 w-8"
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" weight="bold" /> : <Moon className="h-4 w-4" weight="bold" />}
          </Button>
          <APIConfigDialog />
        </div>
      </div>
      <div className={cn(
        "flex-1 flex p-2 gap-2",
        panels.length > 1 ? "overflow-x-auto md:overflow-hidden" : "overflow-hidden",
        panels.length > 3 && "md:overflow-x-auto"
      )}>
        {panels.map((panel, index) => (
          <div
            key={panel.id}
            className={cn(
              "h-full",
              panels.length > 1 ? "flex-shrink-0 w-[85vw] md:w-auto md:flex-shrink md:flex-1 md:min-w-0" : "flex-1 min-w-0",
              panels.length > 3 && "md:flex-shrink-0 md:w-[400px] md:flex-auto"
            )}
          >
            <ChatPanel
              panel={panel}
              index={index}
              totalPanels={panels.length}
              isSyncMode={isSyncMode}
              onModelChange={(model) => setModel(panel.id, model)}
              onConfigChange={(config) => setConfig(panel.id, config)}
              onSendMessage={(content) => sendMessage(panel.id, content)}
              onStopGeneration={() => stopGeneration(panel.id)}
              onClearChat={() => clearMessages(panel.id)}
              onMoveLeft={() => movePanel(panel.id, 'left')}
              onMoveRight={() => movePanel(panel.id, 'right')}
              onDelete={() => removePanel(panel.id)}
            />
          </div>
        ))}
      </div>
      {isSyncMode && (
        <SyncInput
          onSendToAll={sendToAllPanels}
          onStopAll={stopAllGenerations}
          isAnyGenerating={isAnyGenerating}
          panelCount={panels.length}
          panelsWithModels={panelsWithModels}
        />
      )}
    </div>
  )
}

export default App