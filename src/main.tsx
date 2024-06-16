import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom'
import App from './App.tsx'

import './assets/styles/main.css'

const app = createRoot(document.getElementById('root')!)

app.render(
  <StrictMode>
    <Router>
      <App />
    </Router>
  </StrictMode>,
)
