import { createContext, useContext, useEffect, useState } from "react"
import { useGetProfile } from "services/auth";

export const UserContext = createContext(null);

function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const { data: profile } = useGetProfile();

  console.log({user});

  useEffect(() => {
    setUser(profile || null);
  }, [profile])

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  )
}

export default UserProvider