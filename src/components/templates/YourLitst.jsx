import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import useUser from "hooks/useUser";
import { filterData, useGetExams } from "services/question";

function YourList({ type }) {
  const [datas, setDatas] = useState({ userId: '', examId: '' });
  const navigate = useNavigate();

  const { user } = useUser();
  const { data: exams } = useGetExams(undefined, datas.userId);
  const { data: filterAnswers, isSuccess } = filterData('answers', 'myExamId', datas.examId);

  useEffect(() => {
    if (user) setDatas(prevDatas => ({ ...prevDatas, userId: user.$id }))
  }, [user]);

  useEffect(() => {
    if (datas.examId && isSuccess) clickItemHandler(datas.examId);
  }, [datas, isSuccess])

  const clickItemHandler = id => {
    if (type == 'single') {
      // setDatas(prevDatas => ({ ...prevDatas, examId: id }))
      // await refetch();
      console.log(filterAnswers.total);
      if (!filterAnswers.total) {
        navigate(`/dashboard/answerQuizPage/${id}`);
      }
      else{
        navigate(`/dashboard/answers/${id}`);
      }
    }
    else if (type == 'private' || 'public') {
      navigate(`/dashboard/myExam/${id}`);
    }
  }

  return (
    <div>
      <ul>
        {exams?.documents.filter(item => item.access == type).map(item => (
          // <li key={item.$id} onClick={() => clickItemHandler(item.$id)}>
          <li key={item.$id} onClick={() => setDatas(prevDatas => ({ ...prevDatas, examId: item.$id }))}>
            <p>
              {new Date(item.$createdAt).toLocaleDateString("fa-IR")}---
              {new Date(item.$createdAt).toLocaleTimeString("fa-IR")}---
              {item.access && item.access}---
              {!!item.name ? item.name : 'free exam '}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default YourList