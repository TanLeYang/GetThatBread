import "../styles/globals.css"
import type { AppProps } from "next/app"
import { Auth } from "@aws-amplify/auth"
import { amplifyConfig } from "../config/aws-exports"
import { AuthContextProvider } from "../contexts/authContext"

Auth.configure({
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
