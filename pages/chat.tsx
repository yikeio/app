"use client"

import { useState } from "react"
import { useUserStore } from "@/store"
import { isMobileScreen } from "@/utils"

import { Chat } from "@/components/chat"
import { ChatList } from "@/components/chat-list"
import Head from "@/components/head"
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
      <Head />
      <section className="flex min-h-screen w-full">
        <ChatList showSideBar={showSideBar} toggleSidebar={toggleSidebar} />
        <div className="flex h-screen  flex-1 flex-col overflow-hidden bg-slate-100">
          <Chat showSideBar={showSideBar} toggleSidebar={toggleSidebar} />
        </div>
      </section>
    </Layout>
  )
}
