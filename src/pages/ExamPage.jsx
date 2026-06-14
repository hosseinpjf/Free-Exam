import Loader from "components/modules/Loader";
import Questions from "components/templates/Questions";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom"

import { useGetAnswersUser, useGetExamUsers, useGetQuestions, useGetUser, useUpdateScoreAnswer, useUpdateScoreExam } from "services/question";

function ExamPage() {
    const [form, setForm] = useState([]); // { answerId: '', scoreAnswer: '' }
    const [datas, setDatas] = useState({ personId: '', questionsId: '' });
    const [checkData, setCheckData] = useState(false);

    const { examId } = useParams();

    const { data, isPending: pendingExamUsers } = useGetExamUsers(examId);
    const { data: answers, refetch: refetchAnswers, isPending: pendingAnswersUser } = useGetAnswersUser(datas.personId, examId);
    const { data: questions, isPending: pendingQuestions } = useGetQuestions(datas.questionsId);
    const { mutate: updateScoreAnswer } = useUpdateScoreAnswer();
    const { mutate: updateScoreExam } = useUpdateScoreExam();
    const { data: userAnswer, isPending: pendingUsers } = useGetUser(data);

    useEffect(() => {
        if (answers) {
            const questionsId = answers.documents.map(item => item.questionId);
            setDatas(prevDatas => ({ ...prevDatas, questionsId }))
        }
    }, [answers])

    useEffect(() => {
        if (answers && questions) setCheckData(true);
    }, [answers, questions])

    const findNameUser = id => {
        const userName = userAnswer?.documents.find(user => user.$id == id);
        return userName?.name
    }

    const clickHandler = personId => {
        if (personId == datas.personId) {
            setCheckData(false);
            setDatas(prevDatas => ({ ...prevDatas, personId: '' }));
        }
        else setDatas(prevDatas => ({ ...prevDatas, personId }));
    }

    const formHandler = e => {
        e.preventDefault();

        const findAnswer = data.findIndex(id => id == datas.personId);
        const nextAnswer = data[findAnswer + 1] && data[findAnswer + 1];

        const myExamId = answers.documents[0].myExamId;

        updateScoreAnswer(form, {
            onSuccess: async () => {
                toast.success('Score successfully recorded.', { id: 'scoreSuccess' });
                nextAnswer && setDatas(prevDatas => ({ ...prevDatas, personId: nextAnswer }));

                const newAnswers = await refetchAnswers();
                const scoreExam = newAnswers.data.documents.reduce((acc, cur) => (cur.scoreAnswer || 0) + acc, 0);
                updateScoreExam({ examId: myExamId, scoreExam });
            },
            onError: () => toast.error('There was a problem registering the score.', { id: 'scoreError' })
        })
    }

    if (pendingExamUsers || pendingUsers) return <Loader position='centerLoader' />
    return (
        <div className="examPage">
            <h2 className="title">Exam Page</h2>
            <ul>
                {data?.map(id => (
                    <li key={id}>
                        <p onClick={() => clickHandler(id)}>{findNameUser(id)}</p>
                        {checkData && (datas.personId == id) && (
                            <>
                                {(pendingAnswersUser || pendingQuestions) ? <Loader position='smallLoader' /> : (
                                    <form onSubmit={formHandler}>
                                        <Questions questions={questions} answers={answers?.documents} form={form} setForm={setForm} type='TeacherForm' />
                                        <button type="submit">submit</button>
                                    </form>
                                )}
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default ExamPage