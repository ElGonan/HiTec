import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* 
      Hecho con amor por Alan y Ale - HITEC 2025
    */}
    <App />
    <footer>
            <div style={{ 
              position: 'fixed', 
              bottom: 0, 
              right: 0, 
              display: 'flex', 
              justifyContent: 'right', 
              alignItems: 'center', 
              fontSize: '8px',
              padding: '5px',
            }}>
              <p>v0.9.0 Beta</p>
            </div>
    </footer>
  </StrictMode>,
)
