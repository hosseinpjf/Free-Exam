import { Route, Routes } from 'react-router-dom'

import HomePage from 'pages/HomePage'
import AuthPage from 'pages/AuthPage'
import DashboardPage from 'pages/DashboardPage'
import AnswerQuizPage from 'pages/AnswerQuizPage'
import CreateQuizPage from 'pages/CreateQuizPage'
import QuestionsPage from 'pages/QuestionsPage'

function Router() {
    return (
        <Routes>
            <Route index element={<HomePage />} />
            <Route path='/auth' element={<AuthPage />} />
            <Route path='/dashboard' element={<DashboardPage />} />

            <Route path='/dashboard/answerQuizPage' element={<AnswerQuizPage />} />
            <Route path='/dashboard/createQuizPage' element={<CreateQuizPage />} />

            <Route path='/dashboard/answerQuizPage/:examId' element={<QuestionsPage />} />
        </Routes>
    )
}

export default Router