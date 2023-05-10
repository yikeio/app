import type { AppProps } from "next/app"
import { useStorageParams } from "@/hooks/use-storage-params"
import { ThemeProvider } from "next-themes"
import NextNProgress from "nextjs-progressbar"
import { Toaster } from "react-hot-toast"

import { ActivateDialog, LoginDialog } from "@/components/login"
import Transition from "@/components/transition"
import "@/styles/globals.scss"

export default function App({ Component, pageProps }: AppProps) {
  const isStaticPage = ["Privacy", "Terms", "OAuthCallback"].includes(
    Component.name
  )

  useStorageParams()

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <NextNProgress />
      <Transition>
        <Component {...pageProps} />
      </Transition>
      {!isStaticPage && (
        <>
          <LoginDialog />
          <ActivateDialog />
          <Toaster />
        </>
      )}
    </ThemeProvider>
  )
}
