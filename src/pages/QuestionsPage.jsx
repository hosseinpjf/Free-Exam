import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"

import useUser from "hooks/useUser";
import { useCreateAnswers, useCreateFreeExam, useGetCheckSingleExam, useGetExam, useGetExamQuestions, useGetExams } from "services/question";
import toast from "react-hot-toast";
import Questions from "components/templates/Questions";
import { useQueryClient } from "@tanstack/react-query";

function QuestionsPage() {
    const [form, setForm] = useState([]);
    const [password, setPassword] = useState([false, '']);
    const [checkData, setCheckData] = useState([]);
    const [singleExamId, setSingleExamId] = useState('');
    // const [datas, setDatas] = useState({ userId: '' });

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
    // const { data: checkPrevExam } = useGetCheckPrevExam(examId, datas.userId);

    // useEffect(() => {
    //     if(user) setDatas(prevDatas => ({...prevDatas, userId: user.$id}))
    // }, [user])

    console.log({ exams });

    useEffect(() => {

        if (!exams) return

        if (checkPrevExam()) {
            toast.error('You have already taken this Exam.', { id: 'checkPrevExam' })
            return
        }

        if (user && checkSingle && !checkSingle.total) {
            mutateSingleExam({ createdBy: user.$id, access: 'single', questions: [`examId:${examId}`] }, {
                onSuccess: result => {
                    setSingleExamId(result.$id);
                }
            });
        }
        if (checkSingle?.total) {
            setSingleExamId(checkSingle.documents[0].$id)
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
        const missingIds = questionsData.documents.filter(item1 => !form.some(item2 => item2.questionId == item1.$id));

        if (!!missingIds.length) {
            const newForm = missingIds.map(item => (
                { questionId: item.$id, content: 'no answer' }
            ))
            finalForm = [...form, ...newForm];
        }

        mutate({ data: finalForm, examId, myExamId: singleExamId, createdBy: user.$id }, {
            onSuccess: () => {
                toast.success('Yes');
                queryClient.removeQueries({queryKey: ['filterData','answers', 'myExamId', singleExamId]})
                navigate('/dashboard');
            },
            onError: () => toast.error('No')
        })
    }

    return (
        <div>
            <h2>QuestionsPage - {examData?.name}</h2>
            {password[0] ? (
                <form onSubmit={passwordHandler}>
                    <p>Enter the password for this exam...</p>
                    <input type="password" onChange={e => setPassword([true, e.target.value])} />
                    <button type="submit">Check Password</button>
                </form>
            ) : (
                <form onSubmit={formHandler}>
                    <Questions type='form' questions={questionsData?.documents} form={form} setForm={setForm} />
                    <button type="submit">End</button>
                </form>
            )}
        </div>
    )
}

export default QuestionsPage