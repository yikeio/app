"use client"

import { useState } from "react"
import Head from "next/head"
import { useUserStore } from "@/store"
import { isMobileScreen } from "@/utils"

import { Chat } from "@/components/chat"
import { ChatList } from "@/components/chat-list"
import { Layout } from "@/components/layout"

export default function ChatPage() {
  const [user] = useUserStore((state) => [state.user])

  const [showSideBar, setShowSideBar] = useState(true)

  const toggleSidebar = () => {
    if (!isMobileScreen()) return
    setShowSideBar(!showSideBar)
  }

  return (
    <Layout>
      <Head>
        <title>Yike</title>
        <meta
          name="description"
          content="Yike is a social media platform for sharing your thoughts and ideas."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="application-name" content="Yike" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="flex min-h-screen w-full">
        <ChatList showSideBar={showSideBar} toggleSidebar={toggleSidebar} />

        <div className="flex flex-1 flex-col overflow-hidden bg-slate-100">
          <Chat showSideBar={showSideBar} toggleSidebar={toggleSidebar} />
        </div>
      </section>
    </Layout>
  )
}
