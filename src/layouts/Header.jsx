import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";

import useUser from "hooks/useUser";
import { useLogOut } from "services/auth"

function Header() {
    const location = useLocation();
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
        <div style={{ display: "flex", justifyContent: 'space-around', alignItems: 'center', height: '60px', width: '95%', margin: '20px auto 40px' }} className="boxShadow">
            {user && (
                <>
                    <button onClick={logOutHandler}>Log Out</button>
                    <h2>{user.name}</h2>
                </>
            )}
            {(location.pathname == '/' && !!user) && <Link to='/dashboard'>Dashboard</Link>}
            {(location.pathname == '/' && !user) && <Link to='/auth'>Login</Link>}

            {(location.pathname == '/dashboard' || location.pathname == '/auth') && <Link to='/'>Home</Link>}

            {(location.pathname != '/' && location.pathname != '/dashboard' && location.pathname != '/auth') && <Link to='/dashboard'>Dashboard</Link>}
        </div>
    )
}

export default Header