import Amplify, { Auth, withSSRContext } from "aws-amplify";
import { GetServerSideProps, NextPage } from "next";
import { checkAuth, getUser, UNAUTHORISED_REDIRECT } from "../common/auth";

const Home: NextPage = () => {

  return (
    <div>
      <h1>
        HOME PAGE
      </h1>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { Auth } = withSSRContext(context)
  const authResult = await checkAuth(Auth)
  if (!authResult.isAuthenticated) {
    return UNAUTHORISED_REDIRECT
  }

  return {props: {}}
}

export default Home
