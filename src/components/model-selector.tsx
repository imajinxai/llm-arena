import { useState } from 'react'
import { Check, CaretDown, MagnifyingGlass, CircleNotch } from '@phosphor-icons/react'
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
import { useModels } from '@/hooks/use-models'
import type { LLMModel } from '@/types'
import { cn } from '@/lib/utils'

interface ModelSelectorProps {
  value: LLMModel | null
  onValueChange: (model: LLMModel) => void
}

export function ModelSelector({ value, onValueChange }: ModelSelectorProps) {
  const [open, setOpen] = useState(false)
  const { models, isLoading, error } = useModels()

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
                <img src={value.icon} alt={value.provider} className="h-4 w-4" />
                <span className="truncate">{value.name}</span>
              </>
            ) : (
              <>
                <MagnifyingGlass className="h-4 w-4 text-muted-foreground" />
                <span className="text-muted-foreground">Select model...</span>
              </>
            )}
          </div>
          <CaretDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0" align="start">
        <Command>
          <CommandInput placeholder="Search models..." />
          <CommandList>
            {isLoading && (
              <div className="flex items-center justify-center py-6 text-sm text-muted-foreground">
                <CircleNotch className="mr-2 h-4 w-4 animate-spin" />
                Loading models...
              </div>
            )}
            {error && (
              <div className="py-6 text-center text-sm text-muted-foreground">
                <p className="text-destructive">{error}</p>
                <p className="mt-1">Check your API settings</p>
              </div>
            )}
            {!isLoading && !error && models.length === 0 && (
              <CommandEmpty>
                <p>No models found.</p>
                <p className="text-xs mt-1">Configure API key in settings</p>
              </CommandEmpty>
            )}
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
                    <img src={model.icon} alt={model.provider} className="h-4 w-4" />
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
