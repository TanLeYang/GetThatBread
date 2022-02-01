import type { NextPage } from 'next'
import { Auth } from 'aws-amplify'
import { GithubLoginButton } from 'react-social-login-buttons'

const Landing: NextPage = () => {

  return (
    <div>
      <GithubLoginButton
        onClick={() => {
          Auth.federatedSignIn({ customProvider: "Github" })
        }}
      />
    </div>
  )
}

export default Landing 