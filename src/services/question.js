import { useMutation, useQuery } from "@tanstack/react-query";
import { databases, ID, Query } from "./config";

const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;

const useCreateQuestion = () => {
    return useMutation({
        mutationFn: async ([data, userId]) => {
            console.log({ data, userId });
            return await databases.createDocument({
                databaseId,
                collectionId: 'questions',
                documentId: ID.unique(),
                data: ({ ...data, createdBy: userId }),
            })
        }
    })
}

const useCreateExam = () => {
    return useMutation({
        mutationFn: async ({ examData, questionsData, userId }) => {
            console.log({ examData, questionsData, userId });

            const examRequest = await databases.createDocument({
                databaseId,
                collectionId: 'exams',
                documentId: ID.unique(),
                data: { ...examData, createdBy: userId },
            });
            console.log(examRequest);

            for (let index = 0; index < questionsData.length; index++) {
                await databases.createDocument({
                    databaseId,
                    collectionId: 'questions',
                    documentId: ID.unique(),
                    data: ({ ...questionsData[index], createdBy: userId, examId: examRequest.$id }),
                });
            }

            return { examRequest, questionsDataLength: questionsData.length };
        }
    })
}

const useGetExams = () => {
    return useQuery({
        queryKey: ['exams'],
        queryFn: async () => {
            return await databases.listDocuments({
                databaseId,
                collectionId: 'exams',
                queries: [
                    Query.orderDesc('$createdAt')
                ]
            })
        }
    })
}

const useGetExamQuestions = examId => {
    return useQuery({
        queryKey: ['examQuestions', examId],
        queryFn: async () => {
            return await databases.listDocuments({
                databaseId,
                collectionId: 'questions',
                queries: [
                    Query.equal('examId', examId),
                ]
            })
        }
    })
}

const useCreateAnswers = () => {
    return useMutation({
        mutationFn: async ({ data, examId, createdBy }) => {

            console.log({ data, examId, createdBy });

            for (let index = 0; index < data.length; index++) {
                await databases.createDocument({
                    databaseId,
                    collectionId: 'answers',
                    documentId: ID.unique(),
                    data: { ...data[index], examId, createdBy }
                })
            }

            return {dataLength: data.length}
        }
    })
}

export { useCreateQuestion, useCreateExam, useGetExams, useGetExamQuestions, useCreateAnswers }