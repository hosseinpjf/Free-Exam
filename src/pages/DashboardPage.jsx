import { useState } from "react";
import { Link } from "react-router-dom"

import YourList from "components/templates/YourLitst";

function DashboardPage() {
    const [showAnswers, setShowAnswers] = useState('predefinedExams');
    const [showExams, setShowExams] = useState('private');

    return (
        <div>
            <h2 className="title">Dashboard Page</h2>
            <div style={{ margin: "30px 0 45px", display: "flex", justifyContent: "space-around", gap: '20px', flexWrap: 'wrap' }}>
                <Link to='answerQuizPage'>Answer Quiz Page</Link>
                <Link to='createQuizPage'>Create Quiz Page</Link>
            </div>
            <div style={{ padding: "0 10px", display: "flex", justifyContent: "space-around", gap: '30px', flexWrap: 'wrap' }}>
                <div className="showButtons">
                    <h4>Your Answers</h4>
                    <div>
                        <button style={{ color: showAnswers == 'predefinedExams' ? '#fff' : 'inherit' }} onClick={() => setShowAnswers('predefinedExams')}>Predefined Exams</button>
                        <button style={{ color: showAnswers == 'freeExams' ? '#fff' : 'inherit' }} onClick={() => setShowAnswers('freeExams')}>Free Exams</button>
                    </div>
                    <YourList type={showAnswers} />
                </div>
                <div className="showButtons">
                    <h4>Your Exams</h4>
                    <div>
                        <button style={{ color: showExams == 'private' ? '#fff' : 'inherit' }} onClick={() => setShowExams('private')}>Private</button>
                        <button style={{ color: showExams == 'public' ? '#fff' : 'inherit' }} onClick={() => setShowExams('public')}>Public</button>
                    </div>
                    <YourList type={showExams} />
                </div>
            </div>
        </div>
    )
}

export default DashboardPage