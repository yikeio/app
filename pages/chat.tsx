"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useUserStore } from "@/store"
import { isMobileScreen } from "@/utils"

import { Chat } from "@/components/chat"
import { ChatList } from "@/components/chat-list"
import Head from "@/components/head"
import { Layout } from "@/components/layout"

export default function ChatPage() {
  const [user] = useUserStore((state) => [state.user])
  const router = useRouter()
  const [showSideBar, setShowSideBar] = useState(
    router.asPath.includes("#hide-nav")
  )

  useEffect(() => {
    setShowSideBar(!router.asPath.includes("#hide-nav"))
  }, [router])

  return (
    <Layout>
      <Head />
      <section className="flex min-h-screen w-full">
        <ChatList />
        <div className="flex h-screen flex-1 flex-col overflow-hidden bg-slate-100">
          <Chat />
        </div>
      </section>
    </Layout>
  )
}
