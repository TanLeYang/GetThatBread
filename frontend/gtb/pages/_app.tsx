import "../styles/globals.css"
import type { AppProps } from "next/app"
import Amplify from "aws-amplify"
import { amplifyConfig } from "../config/aws-exports"
import { AuthContextProvider } from "../contexts/authContext"

Amplify.configure({
  ...amplifyConfig,
  ssr: true
})

function MyApp({ Component, pageProps }: AppProps) {
  return ( 
    <AuthContextProvider>
      <Component {...pageProps} />
    </AuthContextProvider>
  )
}

export default MyApp
