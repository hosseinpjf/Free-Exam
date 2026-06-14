import { useState } from "react"
import toast from "react-hot-toast";

import { useCreateExam } from "services/question";
import Questions from "./Questions";

function CreateExam({ userId, questions, setQuestions }) {
    const [examForm, setExamForm] = useState({ name: '', access: '', password: '' });
    const [license, setLicense] = useState(false);
    const { mutate } = useCreateExam();

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
        <div className="createExam">
            <form onSubmit={formHandler}>
                <input
                    type="text"
                    placeholder="name"
                    onChange={e => setExamForm(prevForm => ({ ...prevForm, name: e.target.value }))}
                    value={examForm.name}
                />
                <div className="publicPrivate">
                    <input id="inputPrivate" type="radio" name="access" checked={examForm.access == 'private'} onChange={() => setExamForm(prevForm => ({ ...prevForm, access: 'private' }))} />
                    <label htmlFor="inputPrivate" style={{ borderColor: examForm.access == 'private' ? '#ccc' : 'inherit' }}>Private</label>
                    <input id="inputPublic" type="radio" name="access" checked={examForm.access == 'public'} onChange={() => setExamForm(prevForm => ({ ...prevForm, access: 'public' }))} />
                    <label htmlFor="inputPublic" style={{ borderColor: examForm.access == 'public' ? '#ccc' : 'inherit' }}>Public</label>
                </div>
                {examForm.access === 'private' && (
                    <input
                        type="text"
                        placeholder="password"
                        onChange={e => setExamForm(prevForm => ({ ...prevForm, password: e.target.value }))}
                        value={examForm.password}
                    />
                )}
                <button type="submit">Create Exam</button>
                <div className="license">
                    <input type="checkbox" id="license" checked={license} onChange={e => setLicense(e.target.checked)} />
                    <label htmlFor="license">Can the questions from this test be used as general questions in the program?</label>
                </div>
            </form>

            <div>
                <Questions questions={questions} type='createQuestion' />
            </div>
        </div>
    )
}

export default CreateExam