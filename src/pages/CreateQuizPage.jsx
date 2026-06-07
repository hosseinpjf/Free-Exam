import { useEffect, useState } from "react"

import useUser from "hooks/useUser";

import CreateQuestion from "components/templates/CreateQuestion";
import CreateExam from "components/templates/CreateExam";

function CreateQuizPage() {
  const [quizType, setQuizType] = useState('question');
  const [questions, setQuestions] = useState([]);
  const { user } = useUser();

  return (
    <div>
      <h2>CreateQuizPage</h2>
      <div>
        <button onClick={() => setQuizType('question')} disabled={quizType == 'question'}>Create question page</button>
        <button onClick={() => setQuizType('exam')} disabled={quizType == 'exam'}>Create exam page</button>
      </div>
      {quizType === 'exam' && (
        <CreateExam userId={user?.$id} questions={questions} />
      )}
      <div style={{ border: '2px solid #ccc', margin: '20px' }}>
        <CreateQuestion userId={user?.$id} quizType={quizType} setQuestions={setQuestions} />
      </div>
    </div>
  )
}

export default CreateQuizPage