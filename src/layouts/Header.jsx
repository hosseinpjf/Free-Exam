import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

import useUser from "hooks/useUser";
import { useLogOut } from "services/auth"

function Header() {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { user, setUser } = useUser();
    const { mutate: logOutMutate } = useLogOut();

    const logOutHandler = () => {
        logOutMutate(undefined, {
            onSuccess: () => {
                toast.success('Logged out successfully.', { id: 'logoutSuccess' });
                queryClient.invalidateQueries({ queryKey: ['profile'] });
                queryClient.removeQueries({ queryKey: ['profile'] });
                navigate('/auth');
                setUser(null);
            },
            onError: () => toast.error('Logout failed. Try again.', { id: 'logoutError' })
        });

    }

    return (
        <div style={{ display: "flex", justifyContent: 'space-around' }}>
            {user && (
                <>
                    <button onClick={logOutHandler}>Log Out</button>
                    <h2>{user.name}</h2>
                </>
            )}
        </div>
    )
}

export default Header