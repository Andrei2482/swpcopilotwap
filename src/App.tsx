import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import CopilotPage from '@/pages/CopilotPage'
import SettingsPage from '@/pages/SettingsPage'
import { ThemeProvider } from '@/context/ThemeContext'

export default function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<CopilotPage />} />
                    <Route path="/settings" element={<SettingsPage />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    )
}
