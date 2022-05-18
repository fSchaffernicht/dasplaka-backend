import "../styles/globals.css"
import type { AppProps } from "next/app"
import Timer from "components/Timer"

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {pageProps.user && <Timer user={pageProps.user} />}
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
