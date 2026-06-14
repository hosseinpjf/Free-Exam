import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

import useUser from "hooks/useUser";
import { useGetAnswers, useGetExam, useGetQuestions, useGetSingleExam } from "services/question";

import Questions from "components/templates/Questions";
import Loader from "components/modules/Loader";

function AnswersPage() {
    const [datas, setDatas] = useState({ userId: '', questionsId: [] });
    const { examId } = useParams();
    const { user } = useUser();
    const { data: exam , isPending: pendingExam } = useGetExam(examId);
    const { data: singleExam , isPending: pendingSingleExam } = useGetSingleExam(examId);
    const { data: answers , isPending: pendingAnswers } = useGetAnswers(datas.userId, examId);
    const { data: questions , isPending: pendingQuestions } = useGetQuestions(datas.questionsId);

    useEffect(() => {
        if (user) setDatas(prevDatas => ({ ...prevDatas, userId: user.$id }));
    }, [user])

    useEffect(() => {
        if (answers) {
            const questionsId = answers.documents.map(answer => answer.questionId);
            setDatas(prevDatas => ({ ...prevDatas, questionsId }))
        }
    }, [answers])

    if(pendingAnswers || pendingExam || pendingQuestions || pendingSingleExam) return <Loader position='centerLoader' />
    return (
        <div className="answersPage">
            <h2 className="title">Answers Page</h2>
            <h2 className="nameExam">{exam?.name ? exam.name : 'Free Exam'}</h2>
            {exam && (
                <Questions type='show' access={exam.access == 'single'} scoreExam={singleExam?.scoreExam} questions={questions} answers={answers?.documents} />
            )}
        </div>
    )
}

export default AnswersPage