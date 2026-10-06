import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import LandingScreen from './screens/Landing/LandingScreen.jsx'
import { APP_PATH } from './screens/Landing/content.js'
import { initAnalytics } from './lib/analytics'

// "/" = trang giới thiệu (Home), "/app" = ứng dụng. Chỉ có 2 điểm vào nên
// chưa cần thư viện router. Hosting production phải trả index.html cho cả "/app".
const isAppRoute = window.location.pathname.startsWith(APP_PATH)

// Khởi tạo 1 lần cho cả 2 điểm vào để khách ở trang giới thiệu cũng được đo.
initAnalytics()

createRoot(document.getElementById('root')).render(
  <StrictMode>{isAppRoute ? <App /> : <LandingScreen />}</StrictMode>,
)
