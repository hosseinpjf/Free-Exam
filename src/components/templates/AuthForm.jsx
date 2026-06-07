import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

import { useGetProfile, useLogin, useRegister } from 'services/auth';
import useUser from 'hooks/useUser';

function AuthForm({ inputs }) {

    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const navigate = useNavigate();

    const { mutate: registerMutate, isSuccess: isRegisterSuccess } = useRegister();
    const { mutate: loginMutate, isSuccess: isLoginSuccess } = useLogin();

    const { data: profile, refetch: refetchProfile } = useGetProfile();
    const { setUser } = useUser();

    useEffect(() => {
        if (profile) {
            setUser(profile);
            navigate('/dashboard');
        }
    }, [profile]);

    useEffect(() => {
        if (isLoginSuccess || isRegisterSuccess) {
            refetchProfile();
            toast.success(`Your ${isRegisterSuccess ? 'authentication' : 'login'} was successful.`);
        }
    }, [isLoginSuccess, isRegisterSuccess]);

    const submitHandler = e => {
        e.preventDefault();

        const checkForm = inputs.every(input => !!form[input]);
        if (!checkForm) {
            toast.error('Please fill in all fields !', { id: 'fillForm' })
            return
        };

        if (inputs.length === 3) registerMutate(form)
        else if (inputs.length === 2) loginMutate(form)

        setForm({ name: '', email: '', password: '' });
    }

    return (
        <form onSubmit={submitHandler}>
            {inputs.map(item => (
                <input
                    key={item}
                    type={item === 'name' ? 'text' : item}
                    name={item}
                    placeholder={'Enter your ' + item}
                    onChange={e => setForm({ ...form, [item]: e.target.value })}
                    value={form[item]}
                />
            ))}
            <button type='submit'>Submit</button>
        </form>
    )
}

export default AuthForm