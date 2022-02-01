interface AuthResult {
  isAuthenticated: boolean,
  user: any,
}

interface AuthService {
  currentAuthenticatedUser(): any
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
      isAuthenticated: user !== null,
      user
    }
  } catch (err) {
    console.log(`auth error: ${err}`)
    return {
      isAuthenticated: false,
      user: null
    }
  }
}

const getUser = async (auth: AuthService) => {
  const user = auth.currentAuthenticatedUser()
  return user
}

export {
  checkAuth,
  getUser,
  UNAUTHORISED_REDIRECT
}
