import App from './App'
import { Button } from './components/ui/button'
import { ArrowRight, Robot, Lightning, Scales } from '@phosphor-icons/react'

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Robot className="h-6 w-6 text-primary" weight="duotone" />
            <span className="font-semibold text-lg">LLM Arena</span>
          </div>
          <nav className="flex items-center gap-4">
            <a href="#features" className="text-sm text-muted-foreground hover:text-foreground">
              Features
            </a>
            <a href="#demo" className="text-sm text-muted-foreground hover:text-foreground">
              Demo
            </a>
            <a
              href="https://github.com/imajinxai/llm-arena"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-muted-foreground hover:text-foreground"
            >
              GitHub
            </a>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6">
            Compare AI Models <span className="text-primary">Side by Side</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            A React component library for comparing multiple LLM chat panels simultaneously. 
            Test OpenAI, Anthropic, Google Gemini, and more in real-time.
          </p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" asChild>
              <a href="#demo">
                Try Demo <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="https://www.npmjs.com/package/llm-arena" target="_blank" rel="noopener noreferrer">
                npm install llm-arena
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 px-4 border-t bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-12">Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                <Scales className="h-6 w-6 text-primary" weight="duotone" />
              </div>
              <h3 className="font-semibold mb-2">Side-by-Side Comparison</h3>
              <p className="text-sm text-muted-foreground">
                Compare responses from multiple LLMs simultaneously with synced prompts.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                <Lightning className="h-6 w-6 text-primary" weight="duotone" />
              </div>
              <h3 className="font-semibold mb-2">Real-time Streaming</h3>
              <p className="text-sm text-muted-foreground">
                Watch responses stream in real-time with beautiful markdown rendering.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                <Robot className="h-6 w-6 text-primary" weight="duotone" />
              </div>
              <h3 className="font-semibold mb-2">Multiple Providers</h3>
              <p className="text-sm text-muted-foreground">
                Works with OpenAI, Anthropic, Google, Cerebras, and any OpenAI-compatible API.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Demo Section */}
      <section id="demo" className="py-16 px-4 border-t">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl font-bold text-center mb-4">Live Demo</h2>
          <p className="text-center text-muted-foreground mb-8">
            Configure your API key and start comparing models instantly.
          </p>
          <div className="border rounded-xl overflow-hidden shadow-lg">
            <App className="h-[700px] w-full" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="max-w-7xl mx-auto text-center text-sm text-muted-foreground">
          <p>
            Built with React, Tailwind CSS, and Radix UI.{' '}
            <a
              href="https://github.com/imajinxai/llm-arena"
              className="underline hover:text-foreground"
            >
              View on GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  )
}
