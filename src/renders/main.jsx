import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '../styles/styles.css'
import App from '../aplications/App.jsx'
import '../pages/18n.js'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

