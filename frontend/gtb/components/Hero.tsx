import { GithubLoginButton } from "react-social-login-buttons"

const HeroSection = () => {
  return (
    <div className="container flex flex-col-reverse lg:flex-row items-center gap-12 mt-14 lg:mt-28">
      <HeroText/>
    </div>
  )
}

const HeroText = () => {
  return (
    <div className="flex flex-1 flex-col items-center lg:items-start">
      <h2 className="text-white text-3xl md:text-4 lg:text-5xl text-center lg:text-left mb-6">
        Get your dream Software Engineering job
      </h2>          
      <p className="text-gray-50 text-lg text-center lg:text-left mb-6">
        Coding interviews are hard. Make sure you are ready for them now by practicing
        with mock interviews. Get started now!  
      </p>
      <div className="flex justify-center flex-wrap gap-6">
        <GithubLoginButton/>
      </div>
    </div>
  )
}

export default HeroSection