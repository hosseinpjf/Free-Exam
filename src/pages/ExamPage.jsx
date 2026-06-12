import Questions from "components/templates/Questions";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

import { useGetAnswersUser, useGetExamUsers, useGetQuestions } from "services/question";

function ExamPage() {
    const [datas, setDatas] = useState({ personId: '', questionsId: '' });
    const [checkData, setCheckData] = useState(false);
    const { examId } = useParams();

    const { data } = useGetExamUsers(examId);

    const { data: answers } = useGetAnswersUser(datas.personId, examId);
    const { data: questions } = useGetQuestions(datas.questionsId);

    useEffect(() => {
        if (answers) {
            const questionsId = answers.documents.map(item => item.questionId);
            setDatas(prevDatas => ({ ...prevDatas, questionsId }))
        }
    }, [answers])

    useEffect(() => {
        if (answers && questions) setCheckData(true);
    }, [answers, questions])

    const clickHandler = personId => {
        if(personId == datas.personId) setCheckData(false);
        setDatas(prevDatas => ({ ...prevDatas, personId }));
    }
    return (
        <div>
            <h2>ExamPage</h2>
            <ul>
                {data?.map(id => (
                    <li key={id}>
                        <p onClick={() => clickHandler(id)}>{id}</p>
                        {checkData && (datas.personId == id) && questions && answers && (
                            <Questions questions={questions} answers={answers.documents} type='TeacherForm' />
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ExamPage