import { useState, useRef, useCallback, useEffect } from 'react'
import { useChatPanels } from '@/hooks/use-chat-panels'
import { ChatPanel } from '@/components/chat-panel'
import { SyncInput } from '@/components/sync-input'
import { APIConfigDialog } from '@/components/api-config-dialog'
import { Button } from '@/components/ui/button'
import { Link2, Link2Off, GripVertical } from 'lucide-react'
import { cn } from '@/lib/utils'

function App() {
  const [isSyncMode, setIsSyncMode] = useState(false)
  const [position, setPosition] = useState({ x: window.innerWidth - 60, y: window.innerHeight / 2 - 60 })
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef<HTMLDivElement>(null)
  const dragStartRef = useRef({ x: 0, y: 0, posX: 0, posY: 0 })

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return
    setIsDragging(true)
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      posX: position.x,
      posY: position.y,
    }
  }, [position])

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const dx = e.clientX - dragStartRef.current.x
      const dy = e.clientY - dragStartRef.current.y
      setPosition({
        x: Math.max(0, Math.min(window.innerWidth - 48, dragStartRef.current.posX + dx)),
        y: Math.max(0, Math.min(window.innerHeight - 120, dragStartRef.current.posY + dy)),
      })
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

  const {
    panels,
    addPanel,
    removePanel,
    setModel,
    setConfig,
    setInput,
    clearMessages,
    movePanel,
    sendMessage,
    sendToAllPanels,
    stopGeneration,
    stopAllGenerations,
  } = useChatPanels()

  const isAnyGenerating = panels.some((p) => p.isGenerating)
  const panelsWithModels = panels.filter((p) => p.model !== null).length

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden bg-background">
      <div
        ref={dragRef}
        onMouseDown={handleMouseDown}
        className={cn(
          'fixed z-50 flex flex-col gap-1 p-1 rounded-lg border bg-background/80 backdrop-blur-sm shadow-md',
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        )}
        style={{ left: position.x, top: position.y }}
      >
        <div className="flex justify-center py-0.5">
          <GripVertical className="h-3 w-3 text-muted-foreground" />
        </div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsSyncMode(!isSyncMode)}
          className={cn('h-8 w-8', isSyncMode && 'bg-primary text-primary-foreground hover:bg-primary/90')}
        >
          {isSyncMode ? <Link2 className="h-4 w-4" /> : <Link2Off className="h-4 w-4" />}
        </Button>
        <APIConfigDialog />
      </div>
      <div className="flex-1 flex overflow-hidden p-2 gap-2">
        {panels.map((panel, index) => (
          <div
            key={panel.id}
            className="flex-1 min-w-[360px] h-full"
            style={{ maxWidth: `${100 / panels.length}%` }}
          >
            <ChatPanel
              panel={panel}
              index={index}
              totalPanels={panels.length}
              isSyncMode={isSyncMode}
              onModelChange={(model) => setModel(panel.id, model)}
              onConfigChange={(config) => setConfig(panel.id, config)}
              onInputChange={(input) => setInput(panel.id, input)}
              onSendMessage={(content) => sendMessage(panel.id, content)}
              onStopGeneration={() => stopGeneration(panel.id)}
              onClearChat={() => clearMessages(panel.id)}
              onMoveLeft={() => movePanel(panel.id, 'left')}
              onMoveRight={() => movePanel(panel.id, 'right')}
              onDelete={() => removePanel(panel.id)}
              onAddPanel={addPanel}
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
