import React from 'react'
import { Button } from '@/components/ui/button'

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="flex flex-col items-center justify-center p-4 text-center">
          <p className="text-sm text-muted-foreground">Something went wrong</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-2"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try again
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}

export function MarkdownErrorFallback() {
  return (
    <div className="rounded-md border border-destructive/50 bg-destructive/10 p-2 text-sm text-destructive">
      Failed to render content
    </div>
  )
}
