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

    const verifyAnswer = (correctOption, content, index) => {
        if (correctOption == index) return '#00750a'
        if (content == index && content != correctOption) return '#880000'
        else return '#878787'
    }

    return (
        <div className="questions">
            {type == 'show' && (
                <p className="examScore">Your exam score: {access ? `${scoreExam} out of ${questions?.length}` : `${scoreExam || '(Awaiting confirmation)'} out of ${questions?.reduce((acc, cur) => cur.score + acc, 0)}`}</p>
            )}
            <ul className="mainList">
                {questions?.map((question, index) => (
                    <li className="boxShadow" key={question.$id || index}>
                        {!access && (<p className="order">{question.order}</p>)}
                        {!access && (<p className="score">score: {question.score}</p>)}
                        <p className="content">{question.content}</p>
                        {(type == 'show' || type == 'TeacherForm') && findAnswer(question.$id).content == 'no answer' && <p className="noAnswer">You have not answered this question.</p>}
                        {question.type === 'descriptive' && (
                            <div className="descriptive">
                                {(type == 'answerForm') && (<textarea onChange={e => answerHandler(question.$id, e.target.value)}></textarea>)}
                                {(type == 'show' || type == 'TeacherForm') && (
                                    <>
                                        <p>{findAnswer(question.$id).content != 'no answer' && findAnswer(question.$id).content}</p>
                                        {!access && (<p className="yourScore">Your Score: {findAnswer(question.$id).scoreAnswer || (findAnswer(question.$id).scoreAnswer == 0 && '0') || '(Awaiting confirmation)'}</p>)}
                                    </>
                                )}
                                {(type == 'TeacherForm') && (<input className="grading" placeholder="Give a score" type="number" onChange={e => sendScore(question.$id, e.target.value)} min={0} max={question.score} />)}
                            </div>
                        )}
                        {question.type === 'true-false' && (
                            <div className="trueFalse">
                                {(type == 'answerForm') && (
                                    <div className="trueFalseAnswerForm">
                                        <input type="radio" id={`multipleOne${question.$id}`} name={question.$id} onChange={() => answerHandler(question.$id, '20', question.correctOption, question.score)} />
                                        <label htmlFor={`multipleOne${question.$id}`} style={{ borderColor: form.find(item => item.questionId == question.$id)?.content == '20' ? '#00a30b' : '#878787' }}>True</label>

                                        <input type="radio" id={`multipleTwo${question.$id}`} name={question.$id} onChange={() => answerHandler(question.$id, '10', question.correctOption, question.score)} />
                                        <label htmlFor={`multipleTwo${question.$id}`} style={{ borderColor: form.find(item => item.questionId == question.$id)?.content == '10' ? '#00a30b' : '#878787' }}>False</label>
                                    </div>
                                )}

                                {/* {(type == 'answerForm') && (<input type="radio" name={question.$id} onChange={() => answerHandler(question.$id, '20', question.correctOption, question.score)} />)}
                                <span>True</span>
                                {(type == 'answerForm') && (<input type="radio" name={question.$id} onChange={() => answerHandler(question.$id, '10', question.correctOption, question.score)} />)}
                                <span>False</span> */}
                                {(type == 'show' || type == 'TeacherForm') && (
                                    <div>
                                        <span style={{ borderColor: verifyAnswer(question.correctOption, findAnswer(question.$id).content, 20) }}>True</span>
                                        <span style={{ borderColor: verifyAnswer(question.correctOption, findAnswer(question.$id).content, 10) }}>False</span>


                                        {/* <p>Correct answer option: {question.correctOption == 20 ? 'true' : 'false'}</p>
                                        <p>Your answer option: {findAnswer(question.$id).content == 20 ? 'true' : (findAnswer(question.$id).content == 10 ? 'false' : 'no answer')}</p> */}
                                        {!access && (<p className="yourScore">Your Score: {findAnswer(question.$id).scoreAnswer}</p>)}
                                    </div>
                                )}
                                {type == 'createQuestion' && (
                                    <div>
                                        <span style={{ borderColor: verifyAnswer(question.correctOption, undefined, 20) }}>True</span>
                                        <span style={{ borderColor: verifyAnswer(question.correctOption, undefined, 10) }}>False</span>
                                    </div>
                                )}
                            </div>
                        )}
                        {question.type === 'multiple-choice' && (
                            <div className="multiple">
                                <ul>
                                    {(type != 'answerForm') ? (
                                        <>
                                            {question.options.map((option, index) => (
                                                <li className="showLi" key={index} style={(type == 'show' || type == 'TeacherForm' || type == 'createQuestion') ? { borderColor: verifyAnswer(question.correctOption, (type == 'createQuestion' ? undefined : findAnswer(question.$id).content), (index + 1)) } : {}}>
                                                    <span>{option}</span>
                                                </li>
                                            ))}
                                        </>
                                    ) : (
                                        <>
                                            {question.options.map((option, index) => (
                                                <li className="answerLi" key={index}>
                                                    <input id={`multiple${question.$id}-${index}`} name={question.$id} type="radio" onChange={() => answerHandler(question.$id, String(index + 1), question.correctOption, question.score)} />
                                                    <label htmlFor={`multiple${question.$id}-${index}`} style={{ borderColor: form.find(item => item.questionId == question.$id)?.content == index + 1 ? '#00a30b' : '#878787' }}>{option}</label>
                                                </li>
                                            ))}
                                        </>
                                    )}
                                </ul>
                                {(type == 'show' || type == 'TeacherForm') && (
                                    <>
                                        {/* <p>Correct answer option: {question.correctOption}</p>
                                        <p>Your answer option: {findAnswer(question.$id).content}</p> */}
                                        {!access && (<p className="yourScore">Your Score: {findAnswer(question.$id).scoreAnswer}</p>)}
                                    </>
                                )}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Questions