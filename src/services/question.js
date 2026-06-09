import { useMutation, useQuery } from "@tanstack/react-query";
import { databases, ID, Query } from "./config";

const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;

const useCreateQuestion = () => {
    return useMutation({
        mutationFn: async ([data, userId]) => {
            return await databases.createDocument({
                databaseId,
                collectionId: 'questions',
                documentId: ID.unique(),
                data: ({ ...data, createdBy: userId, license: true }),
            })
        }
    })
}

const useCreateExam = () => {
    return useMutation({
        mutationFn: async ({ examData, questionsData, userId, license }) => {
            let questions = []
            for (let index = 0; index < questionsData.length; index++) {
                const question = await databases.createDocument({
                    databaseId,
                    collectionId: 'questions',
                    documentId: ID.unique(),
                    data: ({ ...questionsData[index], createdBy: userId, license }),
                });
                questions.push(question.$id)
            }
            return await databases.createDocument({
                databaseId,
                collectionId: 'exams',
                documentId: ID.unique(),
                data: { ...examData, createdBy: userId, questions },
            });
        }
    })
}

const useGetExams = access => {
    return useQuery({
        queryKey: ['exams', access],
        queryFn: async () => {
            return await databases.listDocuments({
                databaseId,
                collectionId: 'exams',
                queries: [
                    Query.orderDesc('$createdAt'),
                    Query.equal('access', access),
                ]
            })
        }
    })
}

const useGetExam = id => {
    return useQuery({
        queryKey: ['exam', id],
        queryFn: async () => {
            const exam = await databases.getDocument({
                databaseId,
                collectionId: 'exams',
                documentId: id,
            })
            const [type, examId] = exam?.questions[0].split(':');
            if (type == 'examId') {
                return await databases.getDocument({
                    databaseId,
                    collectionId: 'exams',
                    documentId: examId,
                })
            }
            else {
                return exam
            }
        },
    })
}

const useGetExamQuestions = ([examId, questions]) => {
    return useQuery({
        queryKey: ['examQuestions', examId],
        queryFn: async () => {
            console.log({ examId, questions });
            return await databases.listDocuments({
                databaseId,
                collectionId: 'questions',
                queries: [
                    Query.equal('$id', questions),
                ]
            })
        }, enabled: !!examId && !!questions
    })
}

const useCreateAnswers = () => {
    return useMutation({
        mutationFn: async ({ data, examId, createdBy }) => {
            for (let index = 0; index < data.length; index++) {
                await databases.createDocument({
                    databaseId,
                    collectionId: 'answers',
                    documentId: ID.unique(),
                    data: { ...data[index], examId, createdBy }
                })
            }
            return { dataLength: data.length }
        }
    })
}

const useCreateFreeExam = () => {
    return useMutation({
        mutationFn: async data => {
            return await databases.createDocument({
                databaseId,
                collectionId: 'exams',
                documentId: ID.unique(),
                data: data,
            })
        }
    })
}

const useGetFreeQuestionsId = () => {
    return useQuery({
        queryKey: ['freeQuestionsId'],
        queryFn: async () => {
            return await databases.listDocuments({
                databaseId,
                collectionId: 'questions',
                queries: [
                    Query.equal('license', true),
                    Query.notEqual('type', 'descriptive'),
                    Query.orderAsc('$createdAt'),
                    Query.select(['$id']),
                ]
            })
        },
        enabled: false
    })
}

const useGetMyExams = id => {
    return useQuery({
        queryKey: ['myExams', id],
        queryFn: async () => {
            return await databases.listDocuments({
                databaseId,
                collectionId: 'exams',
                queries: [
                    Query.equal('createdBy', id),
                    Query.notEqual('access', 'single'),
                    Query.orderDesc('$createdAt'),
                ]
            })
        }, enabled: !!id
    })
}


const useGetMyAnswers = id => {
    return useQuery({
        queryKey: ['myAnswers', id],
        queryFn: async () => {
            return await databases.listDocuments({
                databaseId,
                collectionId: 'exams',
                queries: [
                    Query.equal('createdBy', id),
                    Query.equal('access', 'single'),
                    Query.orderDesc('$createdAt'),
                ]
            })
        }, enabled: !!id
    })
}

const useGetAnswers = (createdBy, examId) => {
    return useQuery({
        queryKey: ['answers', createdBy, examId],
        queryFn: async () => {
            return await databases.listDocuments({
                databaseId,
                collectionId: 'answers',
                queries: [
                    Query.equal('createdBy', createdBy),
                    Query.equal('examId', examId),
                ]
            })
        },
        enabled: !!createdBy && !!examId
    })
}

const useGetQuestions = questionsId => {
    return useQuery({
        queryKey: ['getQuestions', questionsId],
        queryFn: async () => {
            let questions = [];
            for (let index = 0; index < questionsId.length; index++) {
                const question = await databases.getDocument({
                    databaseId,
                    collectionId: 'questions',
                    documentId: questionsId[index]
                })
                questions.push(question);
            }
            return questions
        },
        enabled: !!questionsId,
    })
}

export {
    useCreateQuestion,
    useCreateExam,
    useGetExams,
    useGetExam,
    useGetExamQuestions,
    useCreateAnswers,
    useCreateFreeExam,
    useGetFreeQuestionsId,
    useGetMyExams,
    useGetMyAnswers,
    useGetAnswers,
    useGetQuestions,
}