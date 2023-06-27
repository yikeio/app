import { Head, Html, Main, NextScript } from "next/document"

import { cn } from "@/lib/utils"

export default function Document() {
  return (
    <Html lang="zh-CN" suppressHydrationWarning>
      <Head />
      <body className={cn("min-h-screen bg-background font-sans")}>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
