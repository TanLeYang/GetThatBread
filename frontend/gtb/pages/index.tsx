import type { NextPage } from "next"
import { Auth } from "aws-amplify"
import { GithubLoginButton } from "react-social-login-buttons"
import { useContext, useEffect } from "react"
import AuthContext from "../contexts/authContext"

const Landing: NextPage = () => {

  const { user, refresh } = useContext(AuthContext)

  useEffect(() => {
    refresh()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      { user && <h1> {user.username} </h1> }
      <GithubLoginButton
        onClick={() => {
          Auth.federatedSignIn({ customProvider: "Github" })
        }}
      />
    </div>
  )
}

export default Landing 
