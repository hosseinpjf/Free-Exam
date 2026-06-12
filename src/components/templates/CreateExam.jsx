import { useState } from "react"
import toast from "react-hot-toast";

import { useCreateExam } from "services/question";
import Questions from "./Questions";

function CreateExam({ userId, questions, setQuestions }) {
    const [examForm, setExamForm] = useState({ name: '', access: '', password: '' });
    const [license, setLicense] = useState(false);
    const { mutate } = useCreateExam();

    console.log({ questions });

    const formHandler = e => {
        e.preventDefault();

        if (!examForm.name || !examForm.access || !questions.length) {
            toast.error('Please fill in all fields.', { id: 'createExamFields' });
            return
        }
        if ((examForm.access === 'private') && !examForm.password) {
            toast.error('Please fill in all fields.', { id: 'createExamFields' });
            return
        }

        mutate({ examData: examForm, questionsData: questions, userId, license }, {
            onSuccess: () => {
                toast.success('Exam creation was successful.', { id: 'createExamSucces' });
                setExamForm({ name: '', access: '', password: '' });
                setQuestions([]);
                setLicense(false);
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
                <div>
                    <input type="radio" name="access" checked={examForm.access == 'private'} onChange={() => setExamForm(prevForm => ({ ...prevForm, access: 'private' }))} />
                    <span>private</span>
                    <input type="radio" name="access" checked={examForm.access == 'public'} onChange={() => setExamForm(prevForm => ({ ...prevForm, access: 'public' }))} />
                    <span>public</span>
                </div>
                {examForm.access === 'private' && (
                    <input
                        type="text"
                        placeholder="password"
                        onChange={e => setExamForm(prevForm => ({ ...prevForm, password: e.target.value }))}
                        value={examForm.password}
                    />
                )}
                <br />
                <input type="checkbox" checked={license} onChange={e => setLicense(e.target.checked)} />
                <span>Can the questions from this test be used as general questions in the program?</span>
                <br />
                <button type="submit">Send</button>
            </form>

            <div>
                <Questions questions={questions} />
            </div>
        </div>
    )
}

export default CreateExam