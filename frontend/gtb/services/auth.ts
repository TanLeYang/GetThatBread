import { withSSRContext } from "aws-amplify"
import { GetServerSidePropsContext } from "next"
import { amplifyConfig } from "../config/aws-exports"
import { User } from "../constants/types/user"

export interface AuthResult {
  isAuthenticated: boolean
  user?: User
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

const checkAuth = async (context: GetServerSidePropsContext): Promise<AuthResult> => {
  try {
    const { Auth } = withSSRContext(context)
    Auth.configure({ ...amplifyConfig, ssr: true })
    const user = await getUser(Auth)
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

export { checkAuth, getUser, UNAUTHORISED_REDIRECT }
