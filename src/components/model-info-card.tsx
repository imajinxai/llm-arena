import { ExternalLink } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import type { LLMModel } from '@/types'

interface ModelInfoCardProps {
  model: LLMModel
}

function formatTokens(tokens: number): string {
  if (tokens >= 1000000) {
    return `${(tokens / 1000000).toFixed(1)}M tokens`
  }
  return `${tokens.toLocaleString()} tokens`
}

function formatPrice(price: number): string {
  return `$${price.toFixed(2)} / million tokens`
}

export function ModelInfoCard({ model }: ModelInfoCardProps) {
  const links = [
    { label: 'Model Page', href: model.links?.modelPage },
    { label: 'Pricing', href: model.links?.pricing },
    { label: 'Terms', href: model.links?.terms },
    { label: 'Privacy', href: model.links?.privacy },
    { label: 'Website', href: model.links?.website },
  ].filter((link) => link.href && link.href !== '#')

  return (
    <Card className="mx-4 mt-4">
      <CardContent className="p-4 space-y-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{model.icon}</span>
            <span className="text-sm text-muted-foreground">{model.provider}</span>
            <span className="text-muted-foreground">/</span>
            <span className="font-semibold">{model.name}</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {model.description}
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Context</span>
            <span className="font-medium">{formatTokens(model.contextWindow)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Input Pricing</span>
            <span className="font-medium">{formatPrice(model.inputPricing)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Output Pricing</span>
            <span className="font-medium">{formatPrice(model.outputPricing)}</span>
          </div>
        </div>

        {links.length > 0 && (
          <>
            <Separator />
            <div className="flex flex-wrap gap-x-4 gap-y-2">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
                >
                  {link.label}
                  <ExternalLink className="h-3 w-3" />
                </a>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
