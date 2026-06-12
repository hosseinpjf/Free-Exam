import Questions from "components/templates/Questions";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom"

import { useGetAnswersUser, useGetExamUsers, useGetQuestions, useUpdateScoreAnswer, useUpdateScoreExam } from "services/question";

function ExamPage() {
    const [form, setForm] = useState([]); // { answerId: '', scoreAnswer: '' }
    const [datas, setDatas] = useState({ personId: '', questionsId: '' });
    const [checkData, setCheckData] = useState(false);

    const { examId } = useParams();

    const { data } = useGetExamUsers(examId);
    const { data: answers } = useGetAnswersUser(datas.personId, examId);
    const { data: questions } = useGetQuestions(datas.questionsId);
    const { mutate: updateScoreAnswer } = useUpdateScoreAnswer();
    const { mutate: updateScoreExam } = useUpdateScoreExam();


    console.log({answers});

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
        if (personId == datas.personId) setCheckData(false);
        setDatas(prevDatas => ({ ...prevDatas, personId }));
    }

    const formHandler = e => {
        e.preventDefault();

        const findAnswer = data.findIndex(id => id == datas.personId);
        const nextAnswer = data[findAnswer + 1] && data[findAnswer + 1];

        const myExamId = answers.documents[0].myExamId;
        const scoreExam = answers.documents.reduce((acc, cur) => (cur.scoreAnswer || 0) + acc, 0);
        
        updateScoreAnswer(form, {
            onSuccess: () => {
                toast.success('Score successfully recorded.', { id: 'scoreSuccess' });
                nextAnswer && setDatas(prevDatas => ({ ...prevDatas, personId: nextAnswer }));
                updateScoreExam({ examId: myExamId, scoreExam });
            },
            onError: () => toast.error('There was a problem registering the score.', { id: 'scoreError' })
        })
    }
    return (
        <div>
            <h2>ExamPage</h2>
            <ul>
                {data?.map(id => (
                    <li key={id}>
                        <p onClick={() => clickHandler(id)}>{id}</p>
                        {checkData && (datas.personId == id) && questions && answers && (
                            <form onSubmit={formHandler}>
                                <Questions questions={questions} answers={answers.documents} form={form} setForm={setForm} type='TeacherForm' />
                                <button type="submit">submit</button>
                            </form>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ExamPage