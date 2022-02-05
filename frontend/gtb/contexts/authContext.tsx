import { Auth } from "aws-amplify";
import { createContext, useState } from "react";
import { getUser } from "../services/auth";
import { User } from "../constants/types/user";

type AuthContextState = {
  user?: User,
  refresh: () => Promise<void> 
}

const AuthContext = createContext<AuthContextState>({
  user: undefined,
  refresh: () => Promise.resolve() 
})

export const AuthContextProvider = ({ children }: any) => {
  const [user, setUser] = useState<User>()

  const refresh = async () => {
    const fetchedUser = await getUser(Auth) 
    console.log(fetchedUser)
    if (!user || fetchedUser !== user) {
      setUser(fetchedUser)
    }
  }

  const ctx = { user, refresh }

  return (
    <AuthContext.Provider value={ctx}>
      { children }
    </AuthContext.Provider>
  )
}

export default AuthContext