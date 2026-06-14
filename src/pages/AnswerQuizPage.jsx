import Loader from "components/modules/Loader";
import FreeExamForm from "components/templates/FreeExamForm";
import useUser from "hooks/useUser";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGetExams, useGetMyAnswers } from "services/question"

function AnswerQuizPage() {
  const [showExam, setShowExam] = useState('public')
  const [datas, setDatas] = useState({ userId: '', checkPreviousExams: [] });
  const navigate = useNavigate();
  const { user } = useUser()
  const { data: answers } = useGetMyAnswers(datas.userId);
  const { data: dataPublic, isPending: pendingPublicExams } = useGetExams('public');
  const { data: dataPrivate, isPending: pendingPrivateExams } = useGetExams('private');

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
    <div className="answerQuizPage">
      <h2 className="title">Answer Quiz Page</h2>
      <section>
        <div className="freeExamForm">
          <FreeExamForm />
        </div>
        <div>
          <div className="buttons">
            <button style={{ color: showExam == 'public' ? '#fff' : 'inherit' }} onClick={() => setShowExam('public')}>Public Exams</button>
            <button style={{ color: showExam == 'private' ? '#fff' : 'inherit' }} onClick={() => setShowExam('private')}>Private Exams</button>
          </div>
          <ul>
            {showExam == 'public' ? (
              <>
                {pendingPublicExams ? <Loader position='smallLoader' /> : (
                  <>
                    {dataPublic?.documents.map(exam => (
                      <li key={exam.$id} onClick={() => clickHandler(exam.$id)} style={{ cursor: datas.checkPreviousExams.some(i => i == exam.$id) ? 'not-allowed' : 'pointer' }}>
                        <p>{exam.name}</p>
                        {datas.checkPreviousExams.some(i => i == exam.$id) && <p>done</p>}
                      </li>
                    ))}
                  </>
                )}
              </>
            ) : (
              <>
                {pendingPrivateExams ? <Loader position='smallLoader' /> : (
                  <>
                    {dataPrivate?.documents.map(exam => (
                      <li key={exam.$id} onClick={() => clickHandler(exam.$id)} style={{ cursor: datas.checkPreviousExams.some(i => i == exam.$id) ? 'not-allowed' : 'pointer' }}>
                        <p>{exam.name}</p>
                        {datas.checkPreviousExams.some(i => i == exam.$id) && <p>done</p>}
                      </li>
                    ))}
                  </>
                )}
              </>
            )}
          </ul>
        </div>
      </section>
    </div>
  )
}

export default AnswerQuizPage