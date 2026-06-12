import { useMutation, useQuery } from "@tanstack/react-query";
import { databases, ID, Query } from "./config";

const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;

// --------------------------------------------- Create --------------------------------------------- //

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

const useCreateAnswers = () => {
    return useMutation({
        mutationFn: async ({ data, examId, myExamId, createdBy }) => {
            for (let index = 0; index < data.length; index++) {
                await databases.createDocument({
                    databaseId,
                    collectionId: 'answers',
                    documentId: ID.unique(),
                    data: { ...data[index], examId, myExamId, createdBy }
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

// --------------------------------------------- Get --------------------------------------------- //

const useGetExams = (access, createdBy) => {
    return useQuery({
        queryKey: ['exams', access || 'all'],
        queryFn: async () => {
            return await databases.listDocuments({
                databaseId,
                collectionId: 'exams',
                queries: [
                    Query.orderDesc('$createdAt'),
                    ...(access ? [Query.equal('access', access)] : []),
                    ...(createdBy ? [Query.equal('createdBy', createdBy)] : []),
                ]
            })
        },
        enabled: !!access || !!createdBy
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
            const questionsData = await databases.listDocuments({
                databaseId,
                collectionId: 'questions',
                queries: [
                    Query.equal('$id', questions),
                ]
            })
            const finalQuestions = questionsData.documents.sort((a, b) => a.order -  b.order );
            return finalQuestions;
        }, enabled: !!examId && !!questions
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

const useGetAnswers = (createdBy, myExamId) => {
    return useQuery({
        queryKey: ['answers', createdBy, myExamId],
        queryFn: async () => {
            return await databases.listDocuments({
                databaseId,
                collectionId: 'answers',
                queries: [
                    Query.equal('createdBy', createdBy),
                    Query.equal('myExamId', myExamId),
                ]
            })
        },
        enabled: !!createdBy && !!myExamId
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
            const finalQuestions = questions.sort((a, b) => a.order - b.order);
            return finalQuestions
        },
        enabled: !!questionsId.length,
    })
}

const useGetCheckSingleExam = examId => {
    return useQuery({
        queryKey: ['checkSingle', examId],
        queryFn: async () => {
            return await databases.listDocuments({
                databaseId,
                collectionId: 'exams',
                queries: [
                    Query.equal('access', 'single'),
                    Query.equal('$id', examId),
                ]
            })
        }, enabled: !!examId
    })
}

const useGetExamUsers = examId => {
    return useQuery({
        queryKey: ['examUsers', examId],
        queryFn: async () => {
            const examUsers = await databases.listDocuments({
                databaseId,
                collectionId: 'answers',
                queries: [
                    Query.equal('examId', examId),
                    Query.select('createdBy'),
                ]
            })
            return [...new Set(examUsers.documents.map(i => i.createdBy))];
        }
    })
}

const useCheckEndExam = myExamId => {
    return useQuery({
        queryKey: ['checkEndExam', myExamId],
        queryFn: async () => {
            return await databases.listDocuments({
                databaseId,
                collectionId: 'answers',
                queries: [
                    Query.equal('myExamId', myExamId)
                ]
            })
        },
        enabled: !!myExamId
    })
}

const useGetAnswersUser = (createdBy, examId) => {
    return useQuery({
        queryKey: ['answersUser', examId, createdBy],
        queryFn: async () => {
            return await databases.listDocuments({
                databaseId,
                collectionId: 'answers',
                queries: [
                    Query.equal('examId', examId),
                    Query.equal('createdBy', createdBy),
                ]
            })
        }, enabled: !!createdBy
    })
}

const useGetSingleExam = id => {
    return useQuery({
        queryKey: ['singleExam', id],
        queryFn: async () => {
            return await databases.getDocument({
                databaseId,
                collectionId: 'exams',
                documentId: id,
            })
        },
    })
}

const useGetUser = ids => {
    return useQuery({
        queryKey: ['getUser', ids],
        queryFn: async () => {
            return await databases.listDocuments({
                databaseId,
                collectionId: 'users',
                // documentId: id,
                queries: [
                    Query.equal('$id', ids)
                ]
            })
        },
        enabled: !!ids?.length
    })
}

// --------------------------------------------- Update --------------------------------------------- //

const useUpdateScoreAnswer = () => {
    return useMutation({
        mutationFn: async scoresAnswer => {
            for (let index = 0; index < scoresAnswer.length; index++) {
                await databases.updateDocument({
                    databaseId,
                    collectionId: 'answers',
                    documentId: scoresAnswer[index].answerId,
                    data: { scoreAnswer: parseFloat(scoresAnswer[index].scoreAnswer) },
                })
            }
            return scoresAnswer.length
        }
    })
}

const useUpdateScoreExam = () => {
    return useMutation({
        mutationFn: async ({ examId, scoreExam }) => {
            return await databases.updateDocument({
                databaseId,
                collectionId: 'exams',
                documentId: examId,
                data: { scoreExam },
            })
        }
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
    useGetCheckSingleExam,
    useGetExamUsers,
    useCheckEndExam,
    useGetAnswersUser,
    useUpdateScoreAnswer,
    useUpdateScoreExam,
    useGetSingleExam,
    useGetUser,
}