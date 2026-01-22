import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ConfigProvider } from './context/ConfigContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <ConfigProvider>
            <AuthProvider>
                <App />
            </AuthProvider>
        </ConfigProvider>
    </React.StrictMode>,
)
