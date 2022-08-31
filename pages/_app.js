import "../styles/general.scss";
import "@sweetalert2/theme-dark/dark.scss";
import { SessionProvider } from 'next-auth/react'

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return <>
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  </>

}

export default MyApp
