import { useNavigate } from "react-router-dom";
import { useGetExams } from "services/question"

function AnswerQuizPage() {
  const navigate = useNavigate();
  const { data } = useGetExams();
  console.log(data);

  const clickHandler = examId => {
    navigate(`/dashboard/answerQuizPage/${examId}`);
  }

  return (
    <div>
      <h2>AnswerQuizPage</h2>
      <div>
        <ul>
          {data?.documents.map(exam => (
            <li key={exam.$id} onClick={() => clickHandler(exam.$id)}>{exam.name}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default AnswerQuizPage