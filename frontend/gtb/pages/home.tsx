import { GetServerSideProps, NextPage } from "next";
import { checkAuth, UNAUTHORISED_REDIRECT } from "../services/auth";

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
  const authResult = await checkAuth(context)
  if (!authResult.isAuthenticated) {
    return UNAUTHORISED_REDIRECT
  }

  return {props: {}}
}

export default Home
