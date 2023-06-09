import type { AppProps } from "next/app"
import useLocalStorage from "@/hooks/use-localstorage"
import { ThemeProvider } from "next-themes"
import NextNProgress from "nextjs-progressbar"
import { Toaster } from "react-hot-toast"
import { SWRConfig } from "swr"

import Request from "@/lib/request"
import "@/styles/globals.scss"
import { useEffect } from "react"
import { useSearchParams } from "next/navigation"

export default function App({ Component, pageProps }: AppProps) {
  const searchParams = useSearchParams()
  const [referrer, setReferrer] = useLocalStorage<string>("referrer", null)

  useEffect(() => {
    if (searchParams.has("referrer") && !referrer) {
      setReferrer(searchParams.get("referrer"))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams])

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <SWRConfig
        value={{
          refreshInterval: 120 * 1000,
          fetcher: (resource, init) => Request.request(resource, init).then((res) => res),
        }}
      >
        <NextNProgress />
        <Component {...pageProps} />
        <Toaster />
      </SWRConfig>
    </ThemeProvider>
  )
}
