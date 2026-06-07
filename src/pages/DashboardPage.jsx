import { Link } from "react-router-dom"

function DashboardPage() {

    return (
        <div>
            <h2>DashboardPage</h2>
            <div style={{ marginTop: "100px", display: "flex", justifyContent: "space-around" }}>
                <Link to='answerQuizPage'>Answer Quiz Page</Link>
                <Link to='createQuizPage'>Create Quiz Page</Link>
            </div>
        </div>
    )
}

export default DashboardPage