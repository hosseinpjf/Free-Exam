import { useState } from "react"
import toast from "react-hot-toast";

import { useCreateExam } from "services/question";

function CreateExam({ questions, userId }) {
    const [examForm, setExamForm] = useState({ name: "" });
    const { mutate } = useCreateExam();

    console.log({ questions });

    const formHandler = e => {
        e.preventDefault();
        mutate({ examData: examForm, questionsData: questions, userId }, {
            onSuccess: () => {
                toast.success('Exam creation was successful.', { id: 'createExamSucces' });
            },
            onError: () => {
                toast.error('There was a problem creating the exam.', { id: 'createExamError' })
            }
        })
    }

    return (
        <div>
            <form onSubmit={formHandler}>
                <input
                    type="text"
                    placeholder="name"
                    onChange={e => setExamForm(prevForm => ({ ...prevForm, name: e.target.value }))}
                    value={examForm.name}
                />
                <button type="submit">Send</button>
            </form>

            <div>
                {questions.map((question, index) => (
                    <div key={index}>
                        <span> {question.type} </span>
                        <span> {question.content} </span>
                        <span> {question.score} </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default CreateExam