import { useEffect, useState } from "react"

import useUser from "hooks/useUser";
import { randomNumbers } from "helpers/helper";

import { useCreateFreeExam, useGetFreeQuestionsId } from "services/question";
import { useNavigate } from "react-router-dom";

function FreeExamForm() {
    const [form, setForm] = useState({ numberQuestions: '' });
    const navigate = useNavigate();
    const { user } = useUser();
    const { refetch } = useGetFreeQuestionsId();
    const { mutate } = useCreateFreeExam();


    const formHandler = async e => {
        e.preventDefault();
        const result = await refetch();

        if (result.isSuccess) {
            const numbers = randomNumbers(result.data.total, form.numberQuestions);
            const questions = result.data.documents
                .map((question, index) => numbers.includes(index) ? question.$id : null)
                .filter(question => question !== null);

            mutate({ createdBy: user.$id, access: 'single', questions }, {
                onSuccess: (exam) => {
                    navigate(`/dashboard/answerQuizPage/${exam.$id}`)
                }
            });
        }
    }

    return (
        <>
            {/* <p>Free Exam Form</p> */}
            <form onSubmit={formHandler}>
                <button type="submit">Create A Free Exam</button>
                <input
                    placeholder="Number of questions"
                    type="number"
                    min='1'
                    max='20'
                    value={form.numberQuestions}
                    onChange={e => setForm(prevForm => ({ ...prevForm, numberQuestions: e.target.value }))}
                />
            </form>
        </>
    )
}

export default FreeExamForm