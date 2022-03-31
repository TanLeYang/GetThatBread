import { GetServerSideProps, NextPage } from "next"
import Container from "../components/Container"
import Header from "../components/Header"
import CreateRoomCard from "../components/CreateRoomCard"
import JoinRoomCard from "../components/JoinRoomCard"
import { checkAuth, UNAUTHORISED_REDIRECT } from "../services/auth"
import Head from "next/head"

const Home: NextPage = () => {
  return (
    <Container>
      <Head>
        <title> Welcome! </title>
      </Head>
      <Header />
      <div className="container flex flex-col lg:flex-row lg:mb-20 items-center justify-center gap-12 h-full">
        <CreateRoomCard />
        <h1 className="text-gray-100 font-bold"> OR </h1>
        <JoinRoomCard />
      </div>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const authResult = await checkAuth(context)
  if (!authResult.isAuthenticated) {
    return UNAUTHORISED_REDIRECT
  }

  return { props: {} }
}

export default Home
