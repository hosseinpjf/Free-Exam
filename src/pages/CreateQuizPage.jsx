import { useEffect, useState } from "react"

import useUser from "hooks/useUser";

import CreateQuestion from "components/templates/CreateQuestion";
import CreateExam from "components/templates/CreateExam";

function CreateQuizPage() {
  const [quizType, setQuizType] = useState('question');
  const [questions, setQuestions] = useState([]);
  const { user } = useUser();

  return (
    <div className="createQuizPage">
      <h2 className="title">Create Quiz Page</h2>
      <div>
        <button style={{ color: quizType == 'question' ? '#fff' : 'inherit' }} onClick={() => setQuizType('question')} disabled={quizType == 'question'}>Create question page</button>
        <button style={{ color: quizType == 'exam' ? '#fff' : 'inherit' }} onClick={() => setQuizType('exam')} disabled={quizType == 'exam'}>Create exam page</button>
      </div>
      {quizType === 'exam' && (
        <CreateExam userId={user?.$id} questions={questions} setQuestions={setQuestions} />
      )}
      {/* <div style={{ border: '2px solid #ccc', margin: '20px' }}> */}
        <CreateQuestion userId={user?.$id} quizType={quizType} questionsLength={questions.length} setQuestions={setQuestions} />
      {/* </div> */}
    </div>
  )
}

export default CreateQuizPage