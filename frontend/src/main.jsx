import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import { Toaster } from 'react-hot-toast'
import App from './App.jsx'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
        <Toaster
          position="bottom-center"
          reverseOrder={false}
          gutter={12}
          containerStyle={{ bottom: 32 }}
          toastOptions={{
            duration: 3500,
            style: {
              background: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(12px)',
              color: '#1e293b',
              borderRadius: '14px',
              padding: '14px 20px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.08)',
              fontSize: '14px',
              fontWeight: '500',
              border: '1px solid rgba(255,255,255,0.6)',
              maxWidth: '380px',
            },
            success: {
              duration: 3000,
              iconTheme: { primary: '#7c3aed', secondary: '#fff' },
              style: {
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(12px)',
                color: '#1e293b',
                borderRadius: '14px',
                padding: '14px 20px',
                boxShadow: '0 8px 32px rgba(124,58,237,0.15), 0 2px 8px rgba(0,0,0,0.08)',
                border: '1px solid rgba(124,58,237,0.2)',
                borderLeft: '4px solid #7c3aed',
                fontSize: '14px',
                fontWeight: '500',
                maxWidth: '380px',
              },
            },
            error: {
              duration: 5000,
              iconTheme: { primary: '#ef4444', secondary: '#fff' },
              style: {
                background: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(12px)',
                color: '#1e293b',
                borderRadius: '14px',
                padding: '14px 20px',
                boxShadow: '0 8px 32px rgba(239,68,68,0.15), 0 2px 8px rgba(0,0,0,0.08)',
                border: '1px solid rgba(239,68,68,0.2)',
                borderLeft: '4px solid #ef4444',
                fontSize: '14px',
                fontWeight: '500',
                maxWidth: '380px',
              },
            },
          }}
        />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
)