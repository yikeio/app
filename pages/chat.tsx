"use client"

import { useEffect, useState } from "react"
import Head from "next/head"
import { useBillingStore, useUserStore } from "@/store"
import { isMobileScreen } from "@/utils"
import toast from "react-hot-toast"

import { Chat } from "@/components/chat"
import { ChatList } from "@/components/chat-list"
import { Layout } from "@/components/layout"

export default function ChatPage() {
  const [user] = useUserStore((state) => [state.user])

  const [setActivateVisible] = useBillingStore((state) => [
    state.setActivateVisible,
  ])

  const [showSideBar, setShowSideBar] = useState(true)

  useEffect(() => {
    // 未注册用户展示激活弹窗
    if (user.id && localStorage.getItem("login_token")) {
      if (user.state === "unactivated") {
        toast.error("账号未激活，请先激活!")
        setActivateVisible(true)
      }
    }
  }, [user])

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
      <ChatList showSideBar={showSideBar} toggleSidebar={toggleSidebar} />
      <section className="col-span-3 lg:col-span-5 flex flex-col">
        <div className="flex flex-col flex-1 overflow-hidden bg-slate-100">
          <Chat showSideBar={showSideBar} toggleSidebar={toggleSidebar} />
        </div>
      </section>
    </Layout>
  )
}
