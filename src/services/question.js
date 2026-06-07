import { useMutation } from "@tanstack/react-query";
import { databases, ID } from "./config";

const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
// const collectionId = 'questions';

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

export { useCreateQuestion, useCreateExam }