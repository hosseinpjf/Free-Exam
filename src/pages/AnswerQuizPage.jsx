import FreeExamForm from "components/templates/FreeExamForm";
import useUser from "hooks/useUser";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCreateFreeExam, useGetExams, useGetMyAnswers } from "services/question"

function AnswerQuizPage() {
  const [datas, setDatas] = useState({ userId: '', checkPreviousExams: [] });
  const navigate = useNavigate();
  const { user } = useUser()
  const { data: answers } = useGetMyAnswers(datas.userId);
  const { data: dataPublic } = useGetExams('public');
  const { data: dataPrivate } = useGetExams('private');

  useEffect(() => {
    if (user)
      setDatas(prevDatas => ({ ...prevDatas, userId: user.$id }));
  }, [user])

  useEffect(() => {
    if (answers) {
      const checkPreviousExams = answers.documents
        .map(answer => answer.questions[0].split(':')[0] == 'examId' && answer.questions[0].split(':')[1])
        .filter(answer => !!answer);

      setDatas(prevDatas => ({ ...prevDatas, checkPreviousExams }));
    }
  }, [answers])

  const clickHandler = examId => {
    if (datas.checkPreviousExams.some(i => i == examId)) return
    navigate(`/dashboard/answerQuizPage/${examId}`);
  }

  return (
    <div>
      <h2>AnswerQuizPage</h2>
      <div>
        <p>Public Exams</p>
        <ul>
          {dataPublic?.documents.map(exam => (
            <li key={exam.$id} onClick={() => clickHandler(exam.$id)} style={{ textDecoration: datas.checkPreviousExams.some(i => i == exam.$id) ? 'line-through' : 'none' }}>{exam.name}</li>
          ))}
        </ul>
        <p>Private Exams</p>
        <ul>
          {dataPrivate?.documents.map(exam => (
            <li key={exam.$id} onClick={() => clickHandler(exam.$id)} style={{ textDecoration: datas.checkPreviousExams.some(i => i == exam.$id) ? 'line-through' : 'none' }}>{exam.name}</li>
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