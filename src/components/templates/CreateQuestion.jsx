import { useState } from "react";
import toast from "react-hot-toast";

import { useCreateQuestion } from "services/question";

function CreateQuestion({ userId, quizType, setQuestions }) {
    const [form, setForm] = useState({ type: "", content: "", score: 0, options: [], correctOption: 0 });
    const { mutate } = useCreateQuestion();

    const formHandler = e => {
        e.preventDefault();
        if ((!form.content || !form.score || !form.type)) {
            toast.error('Please fill in all fields.', { id: 'createQuestionFilds' })
            return
        }
        if (((form.type === "multiple-choice" || form.type === "true-false") && (!form.correctOption))) {
            toast.error('Please fill in all fields.', { id: 'createQuestionFilds' })
            return
        }
        if ((form.type === "multiple-choice") && !form.options.every(i => !!i)) {
            toast.error('Please fill in all fields.', { id: 'createQuestionFilds' })
            return
        }

        if (quizType == 'question') {
            mutate([{ ...form, score: parseFloat(form.score) }, userId], {
                onSuccess: () => {
                    toast.success('Question creation was successful.', { id: 'createQuestionSucces' });
                    setForm({ type: "", content: "", score: 0, options: [] })
                },
                onError: () => {
                    toast.error('There was a problem creating the question.', { id: 'createQuestionError' })
                }
            });
        }
        else if (quizType == 'exam') {
            setQuestions(prevQuestions => ([...prevQuestions, ({ ...form, score: parseFloat(form.score) })]))
            setForm({ type: "", content: "", score: 0, options: [] })
            toast.success('Question creation was successful.', { id: 'createQuestionSucces' });
        }

    }

    const multipleChoiceHandler = (index, newValue) => {
        const updateInputs = [...form.options];
        updateInputs[index] = newValue;
        setForm(prevForm => ({ ...prevForm, options: updateInputs }));
    }

    const selectHandler = newType => {
        if (newType === "multiple-choice")
            setForm(prevForm => ({ ...prevForm, type: newType, options: ["", ""], correctOption: 0 }))
        else if (newType === "true-false")
            setForm(prevForm => ({ ...prevForm, type: newType, options: ["true", "false"], correctOption: 0 }))
        else
            setForm(prevForm => ({ ...prevForm, type: newType, options: [], correctOption: 0 }))
    }

    return (
        <form onSubmit={formHandler}>
            <h2>CreateQuestion</h2>
            <input
                type="text"
                placeholder="content"
                onChange={e => setForm(prevForm => ({ ...prevForm, content: e.target.value }))}
                value={form.content}
            />
            <select onChange={e => selectHandler(e.target.value)} value={form.type}>
                <option value="" disabled>choose...</option>
                {quizType === 'exam' && <option value="descriptive">descriptive</option>}
                <option value="true-false">true false</option>
                <option value="multiple-choice">multiple choice</option>
            </select>
            <input
                type="number"
                placeholder="score"
                onChange={e => setForm(prevForm => ({ ...prevForm, score: e.target.value }))}
                value={form.score}
            />
            <br />
            {form.type === "multiple-choice" && (
                <>
                    {form.options.map((_, index) => (
                        <div key={index}>
                            <input
                                type="radio"
                                name="multipleChoice"
                                checked={index + 1 === form.correctOption}
                                onChange={() => setForm(prevForm => ({ ...prevForm, correctOption: index + 1 }))}
                            />
                            <input
                                type="text"
                                placeholder={index + 1}
                                onChange={e => multipleChoiceHandler(index, e.target.value)}
                            />
                        </div>
                    ))}

                    {form.options.length < 5 && (
                        <button
                            type="button"
                            onClick={() => setForm(prevForm => ({ ...prevForm, options: [...form.options, ""] }))}
                        >+</button>
                    )}
                    {form.options.length !== 2 && (
                        <button
                            type="button"
                            onClick={() => setForm(prevForm => ({ ...prevForm, options: prevForm.options.filter((_, i) => i !== (prevForm.options.length - 1)), correctOption: 0 }))}
                        >-</button>
                    )}
                </>
            )}

            {form.type === "true-false" && (
                <>
                    <input
                        type="radio"
                        name="multipleChoice"
                        onChange={() => setForm(prevForm => ({ ...prevForm, correctOption: 20 }))}
                    />
                    <p> True </p>
                    <input
                        type="radio"
                        name="multipleChoice"
                        onChange={() => setForm(prevForm => ({ ...prevForm, correctOption: 10 }))}
                    />
                    <p> False </p>
                </>
            )}
            <br />
            <button type="submit">Create</button>
        </form>
    )
}

export default CreateQuestion