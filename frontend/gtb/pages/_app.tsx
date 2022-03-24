import "../styles/globals.css"
import type { AppProps } from "next/app"
import { Auth } from "@aws-amplify/auth"
import { amplifyConfig } from "../config/aws-exports"

Auth.configure({
  ...amplifyConfig,
  ssr: true
})

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
