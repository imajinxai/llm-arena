# LLM Arena

A React component library for comparing multiple LLM chat panels side-by-side. Compare responses from OpenAI, Anthropic, Google Gemini, and more in real-time.

<p align="center">
  <strong><a href="https://imajinx.co/tools/llm-arena">Live Demo</a></strong>
</p>

<p align="center">
  <img width="1440" height="788" alt="LLM Arena Screenshot" src="https://github.com/user-attachments/assets/d76bcffa-9f2a-4fd4-acad-7e7404398271" />
</p>

## Installation

```bash
npm install llm-arena
```

## Usage

### Full-Screen App

```tsx
import { LLMArena } from 'llm-arena'
import 'llm-arena/styles.css'

function App() {
  return <LLMArena />
}
```

### Embedded in a Page Section

Use the `className` prop to customize dimensions when embedding in a page:

```tsx
import { LLMArena } from 'llm-arena'
import 'llm-arena/styles.css'

function MyPage() {
  return (
    <div>
      <header>My App Header</header>
      
      <section>
        <h2>Compare AI Models</h2>
        <LLMArena className="h-[600px] w-full" />
      </section>
      
      <footer>My App Footer</footer>
    </div>
  )
}
```

### Individual Components

```tsx
import { 
  ChatPanel, 
  useChatPanels, 
  useModels,
  Button,
  MessageInput 
} from 'llm-arena'
import 'llm-arena/styles.css'

function MyChat() {
  const { panels, addPanel, sendMessage } = useChatPanels()
  
  return (
    <div>
      {panels.map(panel => (
        <ChatPanel 
          key={panel.id}
          panel={panel}
          // ... other props
        />
      ))}
    </div>
  )
}
```

## Features

- 🔄 Compare multiple LLM responses side-by-side
- 🎨 Beautiful UI with dark/light theme support
- ⚡ Real-time streaming responses
- 🔧 Configurable model parameters (temperature, max tokens, etc.)
- 📱 Responsive design
- 🎯 Sync mode for sending prompts to all panels at once

## Supported Providers

- OpenAI (GPT-4, GPT-3.5, etc.)
- Anthropic (Claude)
- Google (Gemini)
- OpenRouter
- Any OpenAI-compatible API

## Server-Side / Production Usage

For production, proxy requests through your backend to keep API keys secure:

1. Set `baseUrl` to your API endpoint (e.g., `/api/chat`)
2. Your backend handles authentication and forwards to LLM providers
3. Never expose real API keys client-side

```tsx
// Example: Configure to use your backend proxy
import { useApiConfigStore } from 'llm-arena'

useApiConfigStore.setState({
  baseUrl: '/api/llm',  // Your backend endpoint
  apiKey: 'session-token'  // Optional session token
})
```

Your backend then proxies requests to the actual LLM providers with the real API keys.

## Requirements

- React 18 or 19
- Tailwind CSS 4.x (for styling)

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build library for publishing
npm run build:lib
```

## License

MIT
