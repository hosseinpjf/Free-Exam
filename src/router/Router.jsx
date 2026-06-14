import { Navigate, Route, Routes } from 'react-router-dom'

import useUser from 'hooks/useUser'

import HomePage from 'pages/HomePage'
import AuthPage from 'pages/AuthPage'
import DashboardPage from 'pages/DashboardPage'
import AnswerQuizPage from 'pages/AnswerQuizPage'
import CreateQuizPage from 'pages/CreateQuizPage'
import QuestionsPage from 'pages/QuestionsPage'
import AnswersPage from 'pages/AnswersPage'
import ExamPage from 'pages/ExamPage'

function Router() {
    const { user } = useUser();
    return (
        <Routes>
            <Route index element={<HomePage />} />
            <Route path='/auth' element={!user ? <AuthPage /> : <Navigate to='/dashboard' />} />

            <Route path='/dashboard' element={user ? <DashboardPage /> : <Navigate to='/auth' />} />

            <Route path='/dashboard/answerQuizPage' element={user ? <AnswerQuizPage /> : <Navigate to='/auth' />} />
            <Route path='/dashboard/createQuizPage' element={user ? <CreateQuizPage /> : <Navigate to='/auth' />} />

            <Route path='/dashboard/answerQuizPage/:examId' element={user ? <QuestionsPage /> : <Navigate to='/auth' />} />

            <Route path='/dashboard/answers/:examId' element={user ? <AnswersPage /> : <Navigate to='/auth' />} />
            <Route path='/dashboard/myExam/:examId' element={user ? <ExamPage /> : <Navigate to='/auth' />} />
        </Routes>
    )
}

export default Router