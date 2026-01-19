import { useState } from 'react'
import { useChatPanels } from '@/hooks/use-chat-panels'
import { ChatPanel } from '@/components/chat-panel'
import { SyncInput } from '@/components/sync-input'
import { APIConfigDialog } from '@/components/api-config-dialog'
import { Button } from '@/components/ui/button'
import { Link2, Link2Off } from 'lucide-react'
import { cn } from '@/lib/utils'

function App() {
  const [isSyncMode, setIsSyncMode] = useState(false)
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
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setIsSyncMode(!isSyncMode)}
          className={cn(isSyncMode && 'bg-primary text-primary-foreground hover:bg-primary/90')}
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
