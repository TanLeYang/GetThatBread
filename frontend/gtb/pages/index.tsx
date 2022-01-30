import type { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next'
import Amplify, { Auth } from 'aws-amplify'
import { GithubLoginButton } from 'react-social-login-buttons'
import { useEffect } from 'react'

type Props = {
  amplifyConfig: object
}

const Home: NextPage<Props> = ({
  amplifyConfig
}: Props) => {

  useEffect(() => {
    Amplify.configure(amplifyConfig)
  }, [amplifyConfig])

  return (
    <div>
      <GithubLoginButton
        onClick={() => {
          Auth.federatedSignIn({ customProvider: 'Github' })
        }}
      />
    </div>
  )
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const amplifyConfig = {
    Auth: {
      region: process.env.REACT_APP_AWS_REGION,
      userPoolId: process.env.REACT_APP_AWS_COGNITO_USER_POOL_ID,
      userPoolWebClientId: process.env.REACT_APP_AWS_COGNITO_CLIENT_ID,
      mandatorySignIn: true,
      oauth: {
        domain: process.env.REACT_APP_AWS_COGNITO_DOMAIN, 
        scope: ['phone', 'email', 'profile', 'openid', 'aws.cognito.signin.user.admin'],
        redirectSignIn: process.env.REACT_APP_REDIRECT_SIGN_IN,
        redirectSignOut: process.env.REACT_APP_REDIRECT_SIGN_OUT,
      }
    }
  }
  
  return {
    props: {
      amplifyConfig
    }
  }
}

export default Home
