import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import CopilotPage from '@/pages/CopilotPage'
import SettingsPage from '@/pages/SettingsPage'

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<CopilotPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                {/* History page placeholder — routes back to main */}
                <Route path="/history" element={<Navigate to="/" replace />} />
                {/* Catch-all */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    )
}
