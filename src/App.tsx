import { useChatPanels } from '@/hooks/use-chat-panels'
import { ChatPanel } from '@/components/chat-panel'
import { APIConfigDialog } from '@/components/api-config-dialog'

function App() {
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
    stopGeneration,
  } = useChatPanels()

  return (
    <div className="h-screen w-screen flex overflow-hidden bg-background">
      <APIConfigDialog />
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
  )
}

export default App
