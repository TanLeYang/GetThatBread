import type { NextPage } from "next"
import { useContext, useEffect } from "react"
import AuthContext from "../contexts/authContext"
import HeroSection from "../components/Hero"

const Landing: NextPage = () => {

  const { user, refresh } = useContext(AuthContext)

  useEffect(() => {
    refresh()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="bg-gray-700 h-full w-full fixed top-0 bottom-0 z-50">
      <header>
        <nav className="container flex items-start py-4 mt-4 sm:mt-12">
          <h1 className="text-white text-xl">GetThatBread 🍞</h1>
        </nav> 
      </header>
      <section className="relative">
        <HeroSection/>
      </section>
    </div>
  )
}

export default Landing 
