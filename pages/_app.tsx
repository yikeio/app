import type { AppProps } from "next/app"
import { Inter as FontSans } from "@next/font/google"
import { ThemeProvider } from "next-themes"
import { Toaster } from "react-hot-toast"

import { BillingDialog } from "@/components/billing"
import { ActivateDialog, LoginDialog } from "@/components/login"

import "@/styles/globals.css"
import "@/styles/highlight.css"
import "@/styles/markdown.css"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <style jsx global>{`
        :root {
          --font-sans: ${fontSans.style.fontFamily};
        }
      `}</style>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <Component {...pageProps} />
        <LoginDialog />
        <BillingDialog />
        <ActivateDialog />
        <Toaster />
      </ThemeProvider>
    </>
  )
}
