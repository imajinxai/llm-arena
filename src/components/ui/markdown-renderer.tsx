import React, { Suspense, lazy, useMemo } from "react"

const LazyMarkdown = lazy(() => import("./lazy-markdown"))

interface MarkdownRendererProps {
  children: string
  isStreaming?: boolean
}

const MARKDOWN_PATTERN = /```|`[^`]+`|\*\*|__|##|^-\s|^\d+\.\s|\[.*\]\(.*\)|^\|/m

function hasMarkdownSyntax(text: string): boolean {
  return MARKDOWN_PATTERN.test(text)
}

export function MarkdownRenderer({ children, isStreaming = false }: MarkdownRendererProps) {
  const shouldRenderMarkdown = useMemo(() => {
    if (isStreaming) return false
    return hasMarkdownSyntax(children)
  }, [children, isStreaming])

  if (!shouldRenderMarkdown) {
    return (
      <div className="space-y-3">
        <p className="whitespace-pre-wrap">{children}</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <Suspense fallback={<p className="whitespace-pre-wrap">{children}</p>}>
        <LazyMarkdown>{children}</LazyMarkdown>
      </Suspense>
    </div>
  )
}

export default MarkdownRenderer
