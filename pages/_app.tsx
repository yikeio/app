import type { AppProps } from "next/app"
import { useStorageParams } from "@/hooks/use-storage-params"
import { ThemeProvider } from "next-themes"
import NextNProgress from "nextjs-progressbar"
import { Toaster } from "react-hot-toast"
import { SWRConfig } from "swr"

import "@/styles/globals.scss"
import { request } from "@/api/common"

export default function App({ Component, pageProps }: AppProps) {
  useStorageParams()
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <SWRConfig
        value={{
          refreshInterval: 5000,
          fetcher: (resource, init) =>
            request(resource, init).then((res) => res),
        }}
      >
        <NextNProgress />
        <Component {...pageProps} />
        <Toaster />
      </SWRConfig>
    </ThemeProvider>
  )
}
