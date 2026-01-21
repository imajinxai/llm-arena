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

### Full App Component

```tsx
import { LLMArena } from 'llm-arena'
import 'llm-arena/styles.css'

function App() {
  return <LLMArena />
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
