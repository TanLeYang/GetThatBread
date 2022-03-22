import { GetServerSideProps, NextPage } from "next";
import Container from "../components/Container";
import Header from "../components/Header";
import { checkAuth, UNAUTHORISED_REDIRECT } from "../services/auth";

const Home: NextPage = () => {

  return (
    <Container>
      <Header/>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // const authResult = await checkAuth(context)
  // if (!authResult.isAuthenticated) {
  //   return UNAUTHORISED_REDIRECT
  // }

  return {props: {}}
}

export default Home
