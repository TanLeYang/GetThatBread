import "../styles/globals.css"
import type { AppProps } from "next/app"
import Amplify from "aws-amplify"
import { amplifyConfig } from "../config/config"

Amplify.configure({
  ...amplifyConfig,
  ssr: true
})

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
