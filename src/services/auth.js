import { useMutation, useQuery } from "@tanstack/react-query"
import { account, databases, ID } from "./config"

const databaseId = import.meta.env.VITE_APPWRITE_DATABASE_ID;
const collectionId = 'users';

const useRegister = () => {
    return useMutation({
        mutationFn: async ({ name, email, password }) => {
            const newUser = await account.create({
                name,
                email,
                password,
                userId: ID.unique(),
            });
            await account.createEmailPasswordSession({
                email,
                password,
            });
            await account.createVerification({
                url: 'http://localhost:5173/'
            });
            await databases.createDocument({
                databaseId,
                collectionId,
                documentId: newUser.$id,
                data: { name: newUser.name },
            })
            return { name, email }
        }
    })
}

const useLogin = () => {
    return useMutation({
        mutationFn: async ({ email, password }) => {
            return await account.createEmailPasswordSession({
                email,
                password,
            })
        }
    })
}

const useLogOut = () => {
    return useMutation({
        mutationFn: async () => {
            return await account.deleteSession({
                sessionId: 'current',
            })
        }
    })
}

const useGetProfile = () => {
    return useQuery({
        queryKey: ['profile'],
        queryFn: async () => {
            return await account.get();
        }
    })
}

export { useRegister, useGetProfile, useLogin, useLogOut }