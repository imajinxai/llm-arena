import { useState } from 'react'
import { Sliders } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import type { ModelConfig } from '@/types'

interface ModelConfigPopoverProps {
  config: ModelConfig
  onConfigChange: (config: ModelConfig) => void
}

export function ModelConfigPopover({ config, onConfigChange }: ModelConfigPopoverProps) {
  const [open, setOpen] = useState(false)

  const updateConfig = (key: keyof ModelConfig, value: number) => {
    onConfigChange({ ...config, [key]: value })
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Sliders className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium text-sm">Model Configuration</h4>
            <p className="text-xs text-muted-foreground">
              Adjust parameters for this model
            </p>
          </div>
          
          <Separator />

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Max Output Tokens</label>
                <Input
                  type="number"
                  value={config.maxOutputTokens}
                  onChange={(e) => updateConfig('maxOutputTokens', parseInt(e.target.value) || 0)}
                  className="w-20 h-7 text-xs"
                />
              </div>
              <Slider
                value={[config.maxOutputTokens]}
                onValueChange={([value]) => updateConfig('maxOutputTokens', value)}
                min={256}
                max={16384}
                step={256}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Temperature</label>
                <span className="text-xs text-muted-foreground">{config.temperature.toFixed(2)}</span>
              </div>
              <Slider
                value={[config.temperature]}
                onValueChange={([value]) => updateConfig('temperature', value)}
                min={0}
                max={2}
                step={0.01}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Top P</label>
                <span className="text-xs text-muted-foreground">{config.topP.toFixed(2)}</span>
              </div>
              <Slider
                value={[config.topP]}
                onValueChange={([value]) => updateConfig('topP', value)}
                min={0}
                max={1}
                step={0.01}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Top K</label>
                <Input
                  type="number"
                  value={config.topK ?? 40}
                  onChange={(e) => updateConfig('topK', parseInt(e.target.value) || 0)}
                  className="w-20 h-7 text-xs"
                />
              </div>
              <Slider
                value={[config.topK ?? 40]}
                onValueChange={([value]) => updateConfig('topK', value)}
                min={1}
                max={100}
                step={1}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Presence Penalty</label>
                <span className="text-xs text-muted-foreground">{(config.presencePenalty ?? 0).toFixed(2)}</span>
              </div>
              <Slider
                value={[config.presencePenalty ?? 0]}
                onValueChange={([value]) => updateConfig('presencePenalty', value)}
                min={-2}
                max={2}
                step={0.01}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium">Frequency Penalty</label>
                <span className="text-xs text-muted-foreground">{(config.frequencyPenalty ?? 0).toFixed(2)}</span>
              </div>
              <Slider
                value={[config.frequencyPenalty ?? 0]}
                onValueChange={([value]) => updateConfig('frequencyPenalty', value)}
                min={-2}
                max={2}
                step={0.01}
              />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
