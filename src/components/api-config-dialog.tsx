import { useState } from 'react'
import { Settings } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useAPIConfig } from '@/stores/api-config'

export function APIConfigDialog() {
  const { config, setConfig } = useAPIConfig()
  const [open, setOpen] = useState(false)
  const [localConfig, setLocalConfig] = useState(config)

  const handleOpen = (isOpen: boolean) => {
    if (isOpen) {
      setLocalConfig(config)
    }
    setOpen(isOpen)
  }

  const handleSave = () => {
    setConfig(localConfig)
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="fixed top-4 right-4 z-50">
          <Settings className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>API Configuration</DialogTitle>
          <DialogDescription>
            Configure your OpenAI-compatible API endpoint. Works with Cerebras, OpenAI, Together, Groq, etc.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Base URL</label>
            <Input
              placeholder="https://api.cerebras.ai/v1"
              value={localConfig.baseUrl}
              onChange={(e) => setLocalConfig({ ...localConfig, baseUrl: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Common endpoints:
            </p>
            <ul className="text-xs text-muted-foreground space-y-1 ml-4">
              <li>• Cerebras: https://api.cerebras.ai/v1</li>
              <li>• OpenAI: https://api.openai.com/v1</li>
              <li>• Together: https://api.together.xyz/v1</li>
              <li>• Groq: https://api.groq.com/openai/v1</li>
            </ul>
          </div>
          <Separator />
          <div className="space-y-2">
            <label className="text-sm font-medium">API Key</label>
            <Input
              type="password"
              placeholder="sk-..."
              value={localConfig.apiKey}
              onChange={(e) => setLocalConfig({ ...localConfig, apiKey: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">
              Your API key is stored locally in your browser.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
