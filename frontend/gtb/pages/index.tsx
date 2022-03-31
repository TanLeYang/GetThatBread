import type { GetServerSideProps, NextPage } from "next"
import HeroSection from "../components/Hero"
import Container from "../components/Container"
import Header from "../components/Header"
import { checkAuth } from "../services/auth"
import Head from "next/head"

const Landing: NextPage = () => {
  return (
    <Container>
      <Head>
        <title> GetThatBread </title>
      </Head>
      <Header />
      <section className="relative">
        <HeroSection />
      </section>
    </Container>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const authResult = await checkAuth(context)
  if (authResult.isAuthenticated) {
    return {
      redirect: {
        destination: "/home",
        permanent: false
      }
    }
  }

  return { props: {} }
}

export default Landing
