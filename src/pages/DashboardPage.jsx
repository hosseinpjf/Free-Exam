import { useState } from "react";
import { Link } from "react-router-dom"

import useUser from "hooks/useUser"
import { useGetExams, useGetMyAnswers, useGetMyExams } from "services/question";

import YourList from "components/templates/YourLitst";

function DashboardPage() {


    return (
        <div>
            <h2>DashboardPage</h2>
            <div style={{ marginTop: "30px", display: "flex", justifyContent: "space-around" }}>
                <Link to='answerQuizPage'>Answer Quiz Page</Link>
                <Link to='createQuizPage'>Create Quiz Page</Link>
            </div>
            <div style={{ padding: "0 10px", display: "flex", justifyContent: "space-around" }}>
                <div style={{ flex: '1' }}>
                    <h4>Your Answers</h4>
                    <YourList type='single' />
                </div>
                <div style={{ flex: '1' }}>
                    <h4>Your Exams</h4>
                    <p>--Private--</p>
                    <YourList type='private' />
                    <p>--Public--</p>
                    <YourList type='public' />
                </div>
            </div>
        </div>
    )
}

export default DashboardPage