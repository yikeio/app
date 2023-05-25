"use client"

import { useEffect } from "react"
import useAuth from "@/hooks/use-auth"

import { Chat } from "@/components/chat/chat"
import { ChatList } from "@/components/chat/chat-list"
import Loading from "@/components/loading"

export default function ChatPage() {
  const { isLogged, user, redirectToLogin } = useAuth()

  useEffect(() => {
    if (!isLogged) {
      window.location.href = "/auth/login"
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLogged])

  if (!isLogged || !user) {
    return <Loading />
  }

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
