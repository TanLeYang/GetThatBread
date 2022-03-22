import { GetServerSideProps, NextPage } from "next";
import CallToActionCard from "../components/CallToActionCard";
import Container from "../components/Container";
import Header from "../components/Header";
import Image from "next/image"
import heroSplashImg from "../public/images/herosplash.png"
import { checkAuth, UNAUTHORISED_REDIRECT } from "../services/auth";

const Home: NextPage = () => {

  return (
    <Container>
      <Header/>
      <div className="container flex flex-col lg:flex-row lg:mb-20 items-center justify-center gap-12 h-full">
        <CallToActionCard
          title="Create a new Room"
          subtitle="Get started by creating a new room and giving your interview buddies the unique room code!"
          callToActionText="Create Room"
          onClick={() => console.log("HELLO NEW ROOm")}
        />
        <h1> OR </h1>
        <CallToActionCard
          title="Join an existing Room"
          subtitle="Join an existing room by entering the unique room code!"
          callToActionText="Join Room"
          onClick={() => console.log("HELLO JOIN ROOM")}
        />
      </div>
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
