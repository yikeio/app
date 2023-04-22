import type { AppProps } from "next/app"
import { ThemeProvider } from "next-themes"
import { Toaster } from "react-hot-toast"
import NextNProgress from 'nextjs-progressbar'

import { useStorageParams } from "@/hooks/use-storage-params"
import { BillingDialog } from "@/components/billing"
import { ActivateDialog, LoginDialog } from "@/components/login"
import Transition from "@/components/transition"
import "@/styles/globals.scss"

export default function App({ Component, pageProps }: AppProps) {
  const isStaticPage = ['Privacy', 'Terms'].includes(Component.name)

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
          <BillingDialog />
          <ActivateDialog />
          <Toaster />
        </>
      )}
    </ThemeProvider>
  )
}
