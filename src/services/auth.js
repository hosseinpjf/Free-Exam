import { useMutation, useQuery } from "@tanstack/react-query"
import { account, ID } from "./config"

const useRegister = () => {
    return useMutation({
        mutationFn: async ({ name, email, password }) => {
            await account.create({
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