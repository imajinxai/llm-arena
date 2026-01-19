import { useState } from 'react'
import { Check, ChevronDown, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { models } from '@/data/models'
import type { LLMModel } from '@/types'
import { cn } from '@/lib/utils'

interface ModelSelectorProps {
  value: LLMModel | null
  onValueChange: (model: LLMModel) => void
}

export function ModelSelector({ value, onValueChange }: ModelSelectorProps) {
  const [open, setOpen] = useState(false)

  const groupedModels = models.reduce((acc, model) => {
    if (!acc[model.provider]) {
      acc[model.provider] = []
    }
    acc[model.provider].push(model)
    return acc
  }, {} as Record<string, LLMModel[]>)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[240px] justify-between font-normal"
        >
          <div className="flex items-center gap-2 truncate">
            {value ? (
              <>
                <span className="text-base">{value.icon}</span>
                <span className="truncate">{value.name}</span>
              </>
            ) : (
              <>
                <Search className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Select model...</span>
              </>
            )}
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search models..." />
          <CommandList>
            <CommandEmpty>No model found.</CommandEmpty>
            {Object.entries(groupedModels).map(([provider, providerModels]) => (
              <CommandGroup key={provider} heading={provider}>
                {providerModels.map((model) => (
                  <CommandItem
                    key={model.id}
                    value={`${model.name} ${model.provider}`}
                    onSelect={() => {
                      onValueChange(model)
                      setOpen(false)
                    }}
                    className="flex items-center gap-2"
                  >
                    <span className="text-base">{model.icon}</span>
                    <span className="flex-1 truncate">{model.name}</span>
                    <Check
                      className={cn(
                        'h-4 w-4',
                        value?.id === model.id ? 'opacity-100' : 'opacity-0'
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
