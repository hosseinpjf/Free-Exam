import { Route, Routes } from 'react-router-dom'

import HomePage from 'pages/HomePage'
import AuthPage from 'pages/AuthPage'

function Router() {
    return (
        <Routes>
            <Route index element={<HomePage />} />
            <Route path='auth' element={<AuthPage />} />
        </Routes>
    )
}

export default Router