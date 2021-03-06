import { Auth } from "aws-amplify"
import Image from "next/image"
import heroSplashImg from "../public/images/herosplash.png"
import { GithubLoginButton } from "react-social-login-buttons"
import { useState } from "react"
import OfflineModal from "./OfflineModal"
import { useRouter } from "next/router"

const HeroSection = () => {
  return (
    <div className="container flex flex-col-reverse lg:flex-row items-center gap-12 mt-14 lg:mt-28">
      <HeroText />
      <HeroImage />
    </div>
  )
}

const HeroText = () => {
  const [showOfflineModal, setShowOfflineModal] = useState(false)
  const router = useRouter()

  return (
    <div className="flex flex-1 flex-col items-center lg:items-start">
      <OfflineModal show={showOfflineModal} onClose={() => setShowOfflineModal(false)} />
      <h2 className="text-white text-3xl md:text-4 lg:text-5xl text-center lg:text-left mb-6">
        Get your dream Software Engineering job
      </h2>
      <p className="text-gray-50 text-lg text-center lg:text-left mb-6">
        Coding interviews are hard. Make sure you are ready for them now by practicing with mock
        interviews. Get started now!
      </p>
      <div className="flex justify-center flex-wrap gap-6">
        <GithubLoginButton
          onClick={() => {
            if (process.env.NEXT_PUBLIC_IS_OFFLINE) {
              setShowOfflineModal(true)
              return
            }
            Auth.federatedSignIn({ customProvider: "Github" })
          }}
        />
      </div>
      <a
        className="text-gray-200 text-2xl ml-2 mt-5"
        onClick={(e) => {
          e.preventDefault()
          if (process.env.NEXT_PUBLIC_IS_OFFLINE) {
            setShowOfflineModal(true)
            return
          }

          router.push("/home")
        }}
      >
        {"Let's get started!"}
      </a>
    </div>
  )
}

const HeroImage = () => {
  return (
    <div className="flex justify-center flex-1 mb-10 md:mb-16 lg:mb-0">
      <Image src={heroSplashImg} alt="Stock coding picture" />
    </div>
  )
}

export default HeroSection
