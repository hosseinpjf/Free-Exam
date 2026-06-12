import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"

import useUser from "hooks/useUser";
import { useCreateAnswers, useCreateFreeExam, useGetCheckSingleExam, useGetExam, useGetExamQuestions, useGetExams, useUpdateScoreExam } from "services/question";
import toast from "react-hot-toast";
import Questions from "components/templates/Questions";
import { useQueryClient } from "@tanstack/react-query";

function QuestionsPage() {
    const [form, setForm] = useState([]);
    const [password, setPassword] = useState([false, '']);
    const [checkData, setCheckData] = useState([]);
    const [singleExamId, setSingleExamId] = useState('');
    const [verifiedExamID, setVerifiedExamID] = useState('');

    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const { examId } = useParams();
    const { user } = useUser();
    const { data: examData, isSuccess } = useGetExam(examId);
    const { data: questionsData } = useGetExamQuestions(checkData);
    const { mutate } = useCreateAnswers();
    const { mutate: mutateSingleExam } = useCreateFreeExam();
    const { data: checkSingle } = useGetCheckSingleExam(examId);
    const { data: exams } = useGetExams('single');
    const { mutate: updateScoreExam } = useUpdateScoreExam();

    console.log({questionsData});


    useEffect(() => {
        if (!exams || !user || !checkSingle) return

        if (checkPrevExam()) {
            // toast.error('You have already taken this Exam.', { id: 'checkPrevExam' })
            return
        }

        const confirmSingle = checkSingle.documents[0]?.questions[0]?.split(':')[0] == 'examId';

        // از قبل ساخته نشده (میخواد آزمون بده)
        if (user && !checkSingle.total) {
            mutateSingleExam({ createdBy: user.$id, access: 'single', questions: [`examId:${examId}`] }, {
                onSuccess: result => {
                    setSingleExamId(result.$id);
                    setVerifiedExamID(examId);
                }
            });
        }
        // از قبل ساخته شده بعدش آزمون ول کرده
        else if (!!checkSingle.total && confirmSingle) {
            setSingleExamId(checkSingle.documents[0].$id);
            setVerifiedExamID(checkSingle.documents[0].questions[0].split(':')[1]);
        }
        // از قبل ساخته شده (میخواد آزمون آزاد بده)
        else if (!!checkSingle.total && !confirmSingle) {
            setSingleExamId(checkSingle.documents[0].$id);
            setVerifiedExamID(checkSingle.documents[0].$id);
        }

    }, [user, checkSingle, exams])

    useEffect(() => {
        if (examData?.access === 'private')
            setPassword([true, '']);
    }, [examData]);

    useEffect(() => {
        if (isSuccess) {
            setCheckData([examId, examData.questions]);
        }
    }, [isSuccess])

    const checkPrevExam = () => {
        return exams.documents
            .map(exam => exam.createdBy == user.$id && exam.questions[0].split(':')[0] == 'examId' && exam.questions[0].split(':')[1])
            .filter(exam => !!exam)
            .some(exam => exam == examId);
    }

    const passwordHandler = e => {
        e.preventDefault();
        if (password[1] === examData.password) {
            setPassword([false, '']);
            toast.success('The password is correct', { id: 'SuccessPassword' });
        }
        else {
            toast.error('The password is incorrect', { id: 'errorPassword' });
        }
    }

    const formHandler = e => {
        e.preventDefault();

        if (!exams || checkPrevExam()) {
            toast.error('You have already taken this Exam.', { id: 'checkPrevExam' })
            return
        }

        let finalForm = [...form];
        const missingIds = questionsData.filter(item1 => !form.some(item2 => item2.questionId == item1.$id));

        if (!!missingIds.length) {
            const newForm = missingIds.map(item => (
                { questionId: item.$id, content: 'no answer', scoreAnswer: 0, numberCorrect: false }
            ))
            finalForm = [...form, ...newForm];
        }

        let scoreSingle;
        const confirmSingle = checkSingle.documents[0]?.questions[0]?.split(':')[0] == 'examId';
        if (!!checkSingle.total && !confirmSingle) {
            scoreSingle = finalForm.map(item => item.numberCorrect).filter(item => !!item);
            updateScoreExam({ examId: singleExamId, scoreExam: scoreSingle.length });
        }

        const dataToSend = finalForm.map(({ numberCorrect, ...rest }) => rest);

        mutate({ data: dataToSend, examId: verifiedExamID, myExamId: singleExamId, createdBy: user.$id }, {
            onSuccess: () => {
                toast.success('Yes');
                queryClient.removeQueries({ queryKey: ['checkEndExam', singleExamId] })
                navigate('/dashboard');
            },
            onError: () => toast.error('No')
        })
    }

    return (
        <div>
            <h2>QuestionsPage - {examData?.name || 'Free Exam'}</h2>
            {password[0] ? (
                <form onSubmit={passwordHandler}>
                    <p>Enter the password for this exam...</p>
                    <input type="password" onChange={e => setPassword([true, e.target.value])} />
                    <button type="submit">Check Password</button>
                </form>
            ) : (
                <form onSubmit={formHandler}>
                    <Questions type='answerForm' access={(singleExamId == verifiedExamID)} questions={questionsData} form={form} setForm={setForm} />
                    <button type="submit">End</button>
                </form>
            )}
        </div>
    )
}

export default QuestionsPage