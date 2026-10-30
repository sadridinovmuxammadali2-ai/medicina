import { StrictMode, useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import AOS from 'aos'
import 'aos/dist/aos.css'
import './index.css'
import App from './App.tsx'
import { LanguageProvider } from './context/LanguageContext.tsx'
import { ThemeProvider } from './context/ThemeContext.tsx'

function Root() {
  useEffect(() => {
    AOS.init({
      duration: 700,
      once: true,
      offset: 80,
    })
  }, [])

  return (
    <ThemeProvider>
      <LanguageProvider>
        <App />
      </LanguageProvider>
    </ThemeProvider>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Root />
  </StrictMode>,
)