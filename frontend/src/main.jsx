import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter} from 'react-router-dom'
import StoreContentProvider from './Context/StoreContext.jsx'
import { registerSW } from 'virtual:pwa-register'

registerSW({
  immediate: true,
  onRegisteredSW(swUrl, registration) {
    if (registration) {
      setInterval(() => {
        registration.update()
      }, 1000 * 60 * 60)
    }
    console.info(`PWA service worker registered: ${swUrl}`)
  },
  onOfflineReady() {
    console.info('App ready to work offline.')
  }
})

createRoot(document.getElementById('root')).render(
<BrowserRouter>
<StoreContentProvider>
  <App />
</StoreContentProvider>
</BrowserRouter>
    
  
)
