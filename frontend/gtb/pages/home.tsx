import { GetServerSideProps, NextPage } from "next"
import Container from "../components/Container"
import Header from "../components/Header"
import CreateRoomCard from "../components/CreateRoomCard"
import JoinRoomCard from "../components/JoinRoomCard"
import { useRouter } from "next/router"

const Home: NextPage = () => {
  const router = useRouter()

  const navigateToRoom = (roomCode: string) => {
    router.push(`/room/${roomCode}`)
  }

  return (
    <Container>
      <Header />
      <div className="container flex flex-col lg:flex-row lg:mb-20 items-center justify-center gap-12 h-full">
        <CreateRoomCard />
        <h1 className="text-gray-100 font-bold"> OR </h1>
        <JoinRoomCard navigateToRoom={navigateToRoom} />
      </div>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  // const authResult = await checkAuth(context)
  // if (!authResult.isAuthenticated) {
  //   return UNAUTHORISED_REDIRECT
  // }

  return { props: {} }
}

export default Home
