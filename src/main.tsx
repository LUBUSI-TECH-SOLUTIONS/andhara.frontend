import { createRoot } from 'react-dom/client'
import App from '@/app/App'
import '@/index.css'
import { useAuthStore } from '@/app/stores/authStore'

useAuthStore.getState().initalize()

createRoot(document.getElementById('root')!).render(
    <App />
)
