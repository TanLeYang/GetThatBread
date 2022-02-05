import { User } from "../constants/types/user"

interface AuthResult {
  isAuthenticated: boolean,
  user?: User,
}

interface AuthService {
  currentAuthenticatedUser({}: any): any
}

const UNAUTHORISED_REDIRECT = {
  redirect: {
    destination: "/",
    permanent: false
  }
}

const checkAuth = async (auth: AuthService): Promise<AuthResult> => {
  try {
    const user = await getUser(auth) 
    return {
      isAuthenticated: user !== undefined,
      user
    }
  } catch (err) {
    return {
      isAuthenticated: false,
      user: undefined 
    }
  }
}

const getUser = async (auth: AuthService) => {
  try {
    const { attributes } = await auth.currentAuthenticatedUser({
      bypassCache: true
    })
    const user = {
      id: attributes.sub,
      email: attributes.email,
      username: attributes.preferred_username,
      picture: attributes.picture
    }
    return user
  } catch (err) {
    console.error(`cannot get user: ${err}`)
    return undefined
  }
}

export {
  checkAuth,
  getUser,
  UNAUTHORISED_REDIRECT
}
