import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import useUser from "hooks/useUser";
import { useCheckEndExam, useGetExams } from "services/question";
import Loader from "components/modules/Loader";

function YourList({ type }) {
  const [correctData, setCorrectData] = useState([]);
  const [datas, setDatas] = useState({ myExamId: '', examId: '' });
  const navigate = useNavigate();

  const { user } = useUser();
  const { data: exams, isPending: pendingGetExams } = useGetExams(undefined, undefined, 'all');
  const { data: checkEndExam, isSuccess } = useCheckEndExam(datas.myExamId);

  useEffect(() => {
    if (datas.myExamId && isSuccess) clickItemHandler(datas.myExamId);
  }, [datas.myExamId, isSuccess]);

  useEffect(() => {
    if (!exams || !user) return;

    const myExams = exams.documents.filter(item => item.createdBy == user.$id);

    if (type == 'freeExams') {
      const data = myExams.filter(item => (item.access == 'single') && (item.questions[0].split(':')[0] != 'examId'));
      setCorrectData(data);
    }
    else if (type == 'predefinedExams') {
      const data = myExams.filter(item => (item.access == 'single') && item.questions[0].split(':')[0] == 'examId');
      setCorrectData(data);
    }
    else if (type == 'private') {
      const data = myExams.filter(item => item.access == 'private');
      setCorrectData(data);
    }
    else if (type == 'public') {
      const data = myExams.filter(item => item.access == 'public');
      setCorrectData(data);
    }
  }, [type, exams, user]);

  const findExamName = id => {
    const findMyExam = exams?.documents.find(item => item.$id == id);
    const findExam = findMyExam?.questions[0].split(':')[1];
    if (!findExam) return `${findMyExam.questions.length} question exam`;
    const findName = exams?.documents.find(item => item.$id == findExam)?.name;
    return findName
  }

  const clickItemHandler = id => {
    if (type == 'freeExams' || type == 'predefinedExams') {

      if (!checkEndExam.total) navigate(`/dashboard/answerQuizPage/${id}`)
      else navigate(`/dashboard/answers/${id}`);

    } else if (type == 'private' || type == 'public') navigate(`/dashboard/myExam/${id}`);
  }

  if(pendingGetExams) return <Loader position='smallLoader' />
  return (
    <div className="yourList">
      {!!correctData.length ? (
        <ul>
          {correctData.map(item => (
            <li key={item.$id} onClick={() => (type == 'freeExams' || type == 'predefinedExams') ? setDatas(prevDatas => ({ ...prevDatas, myExamId: item.$id })) : clickItemHandler(item.$id)}>
              <>
                <p>
                  {!!item.name ? item.name : findExamName(item.$id)}
                </p>
                <p>
                  {new Date(item.$createdAt).toLocaleTimeString("fa-IR")}
                </p>
                <p>
                  {new Date(item.$createdAt).toLocaleDateString("fa-IR")}
                </p>
              </>
            </li>
          ))}
        </ul>
      ) : (
        <p>There is nothing</p>
      )}
    </div>
  )
}

export default YourList