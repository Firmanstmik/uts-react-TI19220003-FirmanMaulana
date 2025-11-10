import './index.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { Toaster } from 'react-hot-toast'

import App from './App.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { LanguageProvider } from './context/LanguageContext.jsx'
import { store } from './store/index.js'
import logoEco from './assets/img/logo eco.png'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <LanguageProvider>
        <ThemeProvider>
          <BrowserRouter>
            <App />
            <Toaster position="top-right" reverseOrder={false} />
          </BrowserRouter>
        </ThemeProvider>
      </LanguageProvider>
    </Provider>
  </StrictMode>,
)

const favicon = document.querySelector("link[rel='icon']")
if (favicon) {
  favicon.href = logoEco
}
