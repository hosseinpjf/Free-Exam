import { useContext } from "react";
import { UserContext } from "contexts/UserProvider";

const useUser = () => {

    const result = useContext(UserContext);
    if (!result) throw new Error('useUser must be used inside <UserProvider>');
    return result
}

export default useUser