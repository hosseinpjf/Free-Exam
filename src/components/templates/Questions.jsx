function Questions({ questions, form, setForm, type, answers }) {

    // [
    //     'questions -- content',
    //     'questions and answers -- content and answer',
    //     'questions and form and setForm -- content and formAnswer',
    //     'questions and form and setForm -- content and formTeacher',
    // ]
    // console.log({ questions, form, setForm, type, answers });

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

    const findAnswer = questionId => {
        return answers.find(item => item.questionId == questionId)
    }
    return (
        <div>
            <ul>
                {questions?.map((question, index) => (
                    <li key={question.$id || index}>
                        <p>score: {question.score}</p>
                        <p>{question.content}</p>
                        {question.type === 'descriptive' && (
                            <>
                                {(type == 'answerForm') && (<textarea onChange={e => answerHandler(question.$id, e.target.value)}></textarea>)}
                                {(type == 'TeacherForm') && (<input type="number" min={0} max={question.score} />)}
                                {(type == 'show' || type == 'TeacherForm') && (<p>{findAnswer(question.$id).content}</p>)}
                            </>
                        )}
                        {question.type === 'true-false' && (
                            <div>
                                {(type == 'answerForm') && (<input type="radio" name={question.$id} onChange={() => answerHandler(question.$id, '20')} />)}
                                <span>True</span>
                                <br />
                                {(type == 'answerForm') && (<input type="radio" name={question.$id} onChange={() => answerHandler(question.$id, '10')} />)}
                                <span>False</span>
                                {(type == 'show' || type == 'TeacherForm') && (
                                    <>
                                        <p>Correct answer option: {question.correctOption == 20 ? 'true' : 'false'}</p>
                                        <p>Your answer option: {findAnswer(question.$id).content == 20 ? 'true' : (findAnswer(question.$id).content == 10 ? 'false' : 'no answer')}</p>
                                    </>
                                )}
                            </div>
                        )}
                        {question.type === 'multiple-choice' && (
                            <>
                                <ul>
                                    {question.options.map((option, index) => (
                                        <li key={index}>
                                            {(type == 'answerForm') && (<input name={question.$id} type="radio" onChange={() => answerHandler(question.$id, String(index + 1))} />)}
                                            <span>{option}</span>
                                        </li>
                                    ))}
                                </ul>
                                {(type == 'show' || type == 'TeacherForm') && (
                                    <>
                                        <p>Correct answer option: {question.correctOption}</p>
                                        <p>Your answer option: {findAnswer(question.$id).content}</p>
                                    </>
                                )}
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Questions