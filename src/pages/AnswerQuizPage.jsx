import FreeExamForm from "components/templates/FreeExamForm";
import { useNavigate } from "react-router-dom";
import { useGetExams } from "services/question"

function AnswerQuizPage() {
  const navigate = useNavigate();
  const { data: dataPublic } = useGetExams('public');
  const { data: dataPrivate } = useGetExams('private');

  const clickHandler = examId => {
    navigate(`/dashboard/answerQuizPage/${examId}`);
  }

  return (
    <div>
      <h2>AnswerQuizPage</h2>
      <div>
        <p>Public Exams</p>
        <ul>
          {dataPublic?.documents.map(exam => (
            <li key={exam.$id} onClick={() => clickHandler(exam.$id)}>{exam.name}</li>
          ))}
        </ul>
        <p>Private Exams</p>
        <ul>
          {dataPrivate?.documents.map(exam => (
            <li key={exam.$id} onClick={() => clickHandler(exam.$id)}>{exam.name}</li>
          ))}
        </ul>
      </div>
      <div>
        <FreeExamForm />
      </div>
    </div>
  )
}

export default AnswerQuizPage