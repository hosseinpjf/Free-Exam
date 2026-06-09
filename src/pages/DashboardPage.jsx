import { Link } from "react-router-dom"

import useUser from "hooks/useUser"
import { useGetMyAnswers, useGetMyExams } from "services/question";

function DashboardPage() {
    const { user } = useUser();
    const { data: exams } = useGetMyExams(user?.$id);
    const { data: answers } = useGetMyAnswers(user?.$id);

    return (
        <div>
            <h2>DashboardPage</h2>
            <div style={{ marginTop: "100px", display: "flex", justifyContent: "space-around" }}>
                <Link to='answerQuizPage'>Answer Quiz Page</Link>
                <Link to='createQuizPage'>Create Quiz Page</Link>
            </div>
            <div>
                <p>Your Answers</p>
                <ul>
                    {answers?.documents.map(answer => (
                        <li key={answer.$id}>
                            <p>
                                {new Date(answer.$createdAt).toLocaleDateString("fa-IR")}---
                                {new Date(answer.$createdAt).toLocaleTimeString("fa-IR")}---
                                {!!answer.name ? answer.name: 'no name'}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
            <div>
                <p>Your Exams</p>
                <ul>
                    {exams?.documents.map(exam => (
                        <li key={exam.$id}>
                            <p>
                                {new Date(exam.$createdAt).toLocaleDateString("fa-IR")}--- 
                                {new Date(exam.$createdAt).toLocaleTimeString("fa-IR")}---
                                {exam.access}---
                                {!!exam.name ? exam.name: 'no name'}
                            </p>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    )
}

export default DashboardPage