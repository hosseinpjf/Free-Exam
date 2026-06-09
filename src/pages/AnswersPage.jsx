import useUser from "hooks/useUser";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import { useGetAnswers, useGetExam, useGetQuestions } from "services/question";

function AnswersPage() {
    const [datas, setDatas] = useState({ userId: '', questionsId: '' });
    const { examId } = useParams();
    const { user } = useUser();
    const { data: exam } = useGetExam(examId);
    const { data: answers } = useGetAnswers(datas.userId, examId);
    const { data: questions } = useGetQuestions(datas.questionsId);

    useEffect(() => {
        if (user) setDatas(prevDatas => ({ ...prevDatas, userId: user.$id }))
    }, [user])

    useEffect(() => {
        if (answers) {
            const questionsId = answers.documents.map(answer => answer.questionId);
            setDatas(prevDatas => ({ ...prevDatas, questionsId }))
        }
    }, [answers])

    const findAnswer = questionId => {
        return answers.documents.find(item => item.questionId == questionId)
    }

    console.log({ exam, answers, questions });
    return (
        <div>
            <h2>AnswersPage</h2>
            <h4>{exam?.name ? exam.name : 'Free Exam'}</h4>
            <ul style={{ padding: 0 }}>
                {questions?.map(question => (
                    <li key={question.$id} style={{ border: '1px solid #474747', listStylePosition: 'inside' }}>
                        <p>{question.score} - { question.content}</p>
                        {question.type == 'multiple-choice' && (
                            <>
                                <ul>
                                    {question.options.map(option => (
                                        <li key={option}>{option}</li>
                                    ))}
                                </ul>
                                <p>Correct answer option: {question.correctOption}</p>
                                <p>Your answer option: {findAnswer(question.$id).content}</p>
                            </>
                        )}
                        {question.type == 'true-false' && (
                            <>
                                <p>Correct answer option: {question.correctOption == 20 ? 'true' : 'false'}</p>
                                <p>Your answer option: {findAnswer(question.$id).content == 20 ? 'true' : (question.correctOption == 10 ? 'false' : 'no answer')}</p>
                            </>
                        )}
                        {question.type == 'descriptive' && (
                            <p>{findAnswer(question.$id).content}</p>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default AnswersPage