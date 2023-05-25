"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useUserStore } from "@/store"

import { Chat } from "@/components/chat/chat"
import { ChatList } from "@/components/chat/chat-list"
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
    <main className="overflow-y-aut0 flex h-screen flex-1 grow">
      <section className="flex min-h-screen w-full">
        <div className="flex h-screen flex-1 flex-col overflow-hidden border-r">
          <Chat />
        </div>
        <div className="translate-all hidden p-6 md:block lg:w-72">
          <ChatList />
        </div>
      </section>
    </main>
  )
}
