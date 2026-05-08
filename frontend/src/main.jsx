import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#111140',
            color: '#d9d9e8',
            border: '1px solid #2d2d70',
            fontFamily: 'DM Sans, sans-serif',
            fontSize: '14px',
          },
          success: { iconTheme: { primary: '#6c63ff', secondary: '#111140' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#111140' } },
        }}
      />
    </BrowserRouter>
  </React.StrictMode>
)
