import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import DemoPage from './DemoPage.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DemoPage />
  </StrictMode>,
)
