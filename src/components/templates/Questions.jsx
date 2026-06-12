function Questions({ type, access, scoreExam, questions, answers, form, setForm }) {

    const answerHandler = (questionId, content, correctOption, score) => {
        const findItem = form.findIndex(i => i.questionId == questionId);
        let yourScore, numberCorrect;

        if (correctOption) {

            if (correctOption == content) {
                yourScore = score;
                numberCorrect = true;
            }
            else {
                yourScore = 0;
                numberCorrect = false;
            }
        }

        if (findItem !== -1) {
            const copyForm = [...form];
            copyForm[findItem] = { questionId, content, scoreAnswer: parseFloat(yourScore), numberCorrect };
            setForm(copyForm);
        }
        else {
            setForm(prevForm => ([...prevForm, { questionId, content, scoreAnswer: parseFloat(yourScore), numberCorrect }]))
        }
    }

    const findAnswer = questionId => {
        return answers.find(item => item.questionId == questionId)
    }

    const sendScore = (questionId, value) => {
        const findItem = form.findIndex(({ answerId, scoreAnswer }) => (answerId == findAnswer(questionId).$id));
        if (findItem !== -1) {
            const copyForm = [...form];
            copyForm[findItem] = { answerId: findAnswer(questionId).$id, scoreAnswer: value };
            setForm(copyForm)
        }
        else {
            setForm(prevForm => ([...prevForm, { answerId: findAnswer(questionId).$id, scoreAnswer: value }]))
        }
    }

    return (
        <div>
            {type == 'show' && (
                <p>Your Exam score: {access ? `${scoreExam} out of ${questions?.length}` : `${scoreExam || 'Awaiting confirmation'} out of ${questions?.reduce((acc, cur) => cur.score + acc, 0)}`}</p>
            )}
            <ul>
                {questions?.map((question, index) => (
                    <li key={question.$id || index}>
                        {!access && (<p>{question.order}</p>)}
                        {!access && (<p>score: {question.score}</p>)}
                        <p>{question.content}</p>
                        {question.type === 'descriptive' && (
                            <>
                                {(type == 'answerForm') && (<textarea onChange={e => answerHandler(question.$id, e.target.value)}></textarea>)}
                                {(type == 'show' || type == 'TeacherForm') && (
                                    <>
                                        <p>{findAnswer(question.$id).content}</p>
                                        {!access && (<p>--- Your Score: {findAnswer(question.$id).scoreAnswer || (findAnswer(question.$id).scoreAnswer == 0 && '0') || 'Awaiting confirmation'} ---</p>)}
                                    </>
                                )}
                                {(type == 'TeacherForm') && (<input type="number" onChange={e => sendScore(question.$id, e.target.value)} min={0} max={question.score} />)}
                            </>
                        )}
                        {question.type === 'true-false' && (
                            <div>
                                {(type == 'answerForm') && (<input type="radio" name={question.$id} onChange={() => answerHandler(question.$id, '20', question.correctOption, question.score)} />)}
                                <span>True</span>
                                <br />
                                {(type == 'answerForm') && (<input type="radio" name={question.$id} onChange={() => answerHandler(question.$id, '10', question.correctOption, question.score)} />)}
                                <span>False</span>
                                {(type == 'show' || type == 'TeacherForm') && (
                                    <>
                                        <p>Correct answer option: {question.correctOption == 20 ? 'true' : 'false'}</p>
                                        <p>Your answer option: {findAnswer(question.$id).content == 20 ? 'true' : (findAnswer(question.$id).content == 10 ? 'false' : 'no answer')}</p>
                                        {!access && (<p>--- Your Score: {findAnswer(question.$id).scoreAnswer} ---</p>)}
                                    </>
                                )}
                            </div>
                        )}
                        {question.type === 'multiple-choice' && (
                            <>
                                <ul>
                                    {question.options.map((option, index) => (
                                        <li key={index}>
                                            {(type == 'answerForm') && (<input name={question.$id} type="radio" onChange={() => answerHandler(question.$id, String(index + 1), question.correctOption, question.score)} />)}
                                            <span>{option}</span>
                                        </li>
                                    ))}
                                </ul>
                                {(type == 'show' || type == 'TeacherForm') && (
                                    <>
                                        <p>Correct answer option: {question.correctOption}</p>
                                        <p>Your answer option: {findAnswer(question.$id).content}</p>
                                        {!access && (<p>--- Your Score: {findAnswer(question.$id).scoreAnswer} ---</p>)}
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