import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../shared/lib/logger.js' // Import logger FIRST to override console methods immediately
import '../shared/styles/globals.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)