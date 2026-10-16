import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './assets/theme/index.css'
import App from './app/App.jsx'
import LandingScreen from './modules/landing/pages/LandingScreen.jsx'
import { APP_PATH } from './modules/landing/content.js'
import { initAnalytics } from './lib/analytics'

// "/" = trang giới thiệu (Home), "/app" = ứng dụng. Chỉ có 2 điểm vào nên
// chưa cần thư viện router. Hosting production phải trả index.html cho cả "/app".
const isAppRoute = window.location.pathname.startsWith(APP_PATH)

// Khởi tạo 1 lần cho cả 2 điểm vào để khách ở trang giới thiệu cũng được đo.
initAnalytics()

createRoot(document.getElementById('root')).render(
  <StrictMode>{isAppRoute ? <App /> : <LandingScreen />}</StrictMode>,
)
