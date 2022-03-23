import { GetServerSideProps, NextPage } from "next"
import Container from "../components/Container"
import Header from "../components/Header"
import CreateRoomCard from "../components/CreateRoomCard"
import JoinRoomCard from "../components/JoinRoomCard"
import { useRouter } from "next/router"
import axios from "axios"

const Home: NextPage = () => {
  const router = useRouter()

  const navigateToRoom = async (roomCode: string) => {
    const result = await axios.get(
      `${process.env.NEXT_PUBLIC_ROOM_SERVER}/room/${roomCode}`
    )

    const { success, roomExists } = result.data
    if (success && roomExists) {
      router.push(`/room/${roomCode}`)
      return true
    } else {
      return false
    }
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
