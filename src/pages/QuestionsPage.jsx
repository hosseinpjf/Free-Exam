import { useState } from "react";
import { useParams } from "react-router-dom"

import useUser from "hooks/useUser";
import { useCreateAnswers, useGetExamQuestions } from "services/question";
import toast from "react-hot-toast";

function QuestionsPage() {
    const [form, setForm] = useState([]);
    const { examId } = useParams();
    const { user } = useUser();
    const { data } = useGetExamQuestions(examId);
    const { mutate } = useCreateAnswers();

    const answerHandler = (questionId, content) => {
        const findItem = form.findIndex(i => i.questionId == questionId);
        if (findItem !== -1) {
            const copyForm = [...form];
            copyForm[findItem] = { questionId, content };
            setForm(copyForm);
        }
        else {
            setForm(prevForm => ([...prevForm, { questionId, content }]))
        }
    }

    const formHandler = e => {
        e.preventDefault();

        let finalForm = [...form];
        const missingIds = data.documents.filter(item1 => !form.some(item2 => item2.questionId == item1.$id));

        if (!!missingIds.length) {
            const newForm = missingIds.map(item => (
                { questionId: item.$id, content: 'no answer' }
            ))
            finalForm = [...form, ...newForm];
        }

        mutate({ data: finalForm, examId, createdBy: user.$id }, {
            onSuccess: () => {
                toast.success('Yes')
            },
            onError: () => toast.error('No')
        })
    }

    return (
        <div>
            <h2>QuestionsPage</h2>
            <form onSubmit={formHandler}>
                <ul>
                    {data?.documents.map(question => (
                        <li key={question.$id}>
                            <p>score: {question.score}</p>
                            <p>{question.content}</p>
                            {question.type === 'descriptive' && (
                                <textarea onChange={e => answerHandler(question.$id, e.target.value)}></textarea>
                            )}
                            {question.type === 'true-false' && (
                                <>
                                    <input type="radio" name={question.$id} onChange={() => answerHandler(question.$id, '20')} />
                                    <span>True</span>
                                    <br />
                                    <input type="radio" name={question.$id} onChange={() => answerHandler(question.$id, '10')} />
                                    <span>False</span>
                                </>
                            )}
                            {question.type === 'multiple-choice' && (
                                <>
                                    {question.options.map((option, index) => (
                                        <div key={index}>
                                            <input name={question.$id} type="radio" onChange={() => answerHandler(question.$id, String(index + 1))} />
                                            <span>{option}</span>
                                        </div>
                                    ))}
                                </>
                            )}
                        </li>
                    ))}
                </ul>
                <button type="submit">End</button>
            </form>
        </div>
    )
}

export default QuestionsPage