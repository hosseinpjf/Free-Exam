function Questions({ questions, form, setForm, type, answers }) {

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
                {questions?.map(question => (
                    <li key={question.$id}>
                        <p>score: {question.score}</p>
                        <p>{question.content}</p>
                        {question.type === 'descriptive' && (
                            <>
                                {type == 'form' && (<textarea onChange={e => answerHandler(question.$id, e.target.value)}></textarea>)}
                                {type == 'show' && (<p>{findAnswer(question.$id).content}</p>)}
                            </>
                        )}
                        {question.type === 'true-false' && (
                            <>
                                {type == 'form' && (
                                    <>
                                        <input type="radio" name={question.$id} onChange={() => answerHandler(question.$id, '20')} />
                                        <span>True</span>
                                        <br />
                                        <input type="radio" name={question.$id} onChange={() => answerHandler(question.$id, '10')} />
                                        <span>False</span>
                                    </>
                                )}
                                {type == 'show' && (
                                    <>
                                        <p>Correct answer option: {question.correctOption == 20 ? 'true' : 'false'}</p>
                                        <p>Your answer option: {findAnswer(question.$id).content == 20 ? 'true' : (findAnswer(question.$id).content == 10 ? 'false' : 'no answer')}</p>
                                    </>
                                )}
                            </>
                        )}
                        {question.type === 'multiple-choice' && (
                            <>
                                {type == 'form' && (
                                    <ul>
                                        {question.options.map((option, index) => (
                                            <li key={index}>
                                                <input name={question.$id} type="radio" onChange={() => answerHandler(question.$id, String(index + 1))} />
                                                <span>{option}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                {type == 'show' && (
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
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Questions