import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"

import useUser from "hooks/useUser";
import { useGetAnswers, useGetExam, useGetQuestions, useGetSingleExam } from "services/question";

import Questions from "components/templates/Questions";

function AnswersPage() {
    const [datas, setDatas] = useState({ userId: '', questionsId: [] });
    const { examId } = useParams();
    const { user } = useUser();
    const { data: exam } = useGetExam(examId);
    const { data: singleExam } = useGetSingleExam(examId);
    const { data: answers } = useGetAnswers(datas.userId, examId);
    const { data: questions } = useGetQuestions(datas.questionsId);

    useEffect(() => {
        if (user) setDatas(prevDatas => ({ ...prevDatas, userId: user.$id }));
    }, [user])

    useEffect(() => {
        if (answers) {
            const questionsId = answers.documents.map(answer => answer.questionId);
            setDatas(prevDatas => ({ ...prevDatas, questionsId }))
        }
    }, [answers])

    return (
        <div>
            <h2>AnswersPage</h2>
            <h4>{exam?.name ? exam.name : 'Free Exam'}</h4>
            {exam && (
                <Questions type='show' access={exam.access == 'single'} scoreExam={singleExam?.scoreExam} questions={questions} answers={answers?.documents} />
            )}
        </div>
    )
}

export default AnswersPage