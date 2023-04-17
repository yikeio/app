"use client"

import { useEffect, useRef, useState } from "react"
import Head from "next/head"
import Image from "next/image"
import { getConversationList } from "@/api/conversations"
import Locale from "@/locales"
import { ChatSession, useBillingStore, useChatStore } from "@/store"
import { isMobileScreen } from "@/utils"
import { Spin } from "antd"
import toast from "react-hot-toast"

import { Chat } from "@/components/chat"
import { ChatList } from "@/components/chat-list"
import { Icons } from "@/components/icons"
import { Layout } from "@/components/layout"

export default function IndexPage() {
  const [
    user,
    config,
    sessions,
    currentIndex,
    createConversation,
    removeSession,
    conversationPager,
    getUserSettings,
  ] = useChatStore((state) => [
    state.user,
    state.config,
    state.sessions,
    state.currentSessionIndex,
    state.createConversation,
    state.removeSession,
    state.conversationPager,
    state.getUserSettings,
  ])
  const [
    currentCombo,
    getUserQuotaInfo,
    setActivateVisible,
    setBillingModalVisible,
  ] = useBillingStore((state) => [
    state.currentCombo,
    state.getUserQuotaInfo,
    state.setActivateVisible,
    state.setBillingModalVisible,
  ])

  const [showSideBar, setShowSideBar] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const chatListRef = useRef<HTMLDivElement>(null)

  // setting
  const [openSettings, setOpenSettings] = useState(false)

  // 退出登陆的时候关掉设置页
  useEffect(() => {
    if (!user.id && !localStorage.getItem("login_token")) {
      setOpenSettings(false)
    }
    // 未注册用户展示激活弹窗
    if (user.id && localStorage.getItem("login_token")) {
      if (user.state === "unactivated") {
        toast.error("账号未激活，请先激活!")
        setActivateVisible(true)
      }
    }
  }, [user])

  useEffect(() => {
    if (openSettings) {
      getUserQuotaInfo(user.id)
      getUserSettings(user.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openSettings])

  const toggleSidebar = () => {
    if (!isMobileScreen()) return
    setShowSideBar(!showSideBar)
  }

  const handleCreateConversation = () => {
    if (user.state === "unactivated") {
      toast.error("账号未激活，请先激活!")
      setActivateVisible(true)
      return
    }
    if (!currentCombo.is_available) {
      toast.error("当前无可用套餐，请购买套餐!")
      setBillingModalVisible(true)
      return
    }
    createConversation()
    toggleSidebar()
  }

  const handleSideBarScroll = async () => {
    if (!chatListRef.current || !conversationPager) return

    const { scrollTop, clientHeight, scrollHeight } = chatListRef.current
    if (scrollHeight - clientHeight >= scrollTop) {
      if (conversationPager.currentPage < conversationPager.lastPage) {
        try {
          setIsLoadingMore(true)
          const params = {
            page: conversationPager.currentPage + 1,
            pageSize: conversationPager.pageSize,
          }
          const conversationRes = await getConversationList(user.id, params)
          const list: ChatSession[] = conversationRes.result.data
          const newList: ChatSession[] = [
            ...sessions,
            ...list.map((conversation) => {
              conversation.context = []
              conversation.messages = []
              conversation.updated_at = new Date(
                conversation.updated_at
              ).toLocaleString()
              return conversation
            }),
          ]

          // update pager
          useChatStore.setState({
            sessions: newList,
            conversationPager: {
              currentPage: conversationRes.result.current_page,
              pageSize: conversationRes.result.per_page,
              lastPage: conversationRes.result.last_page,
            },
          })

          setIsLoadingMore(false)
        } catch (e) {
          setIsLoadingMore(false)
        }
      }
    }
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
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="min-h-screen w-full flex">
        <div
          className={
            `fixed md:relative bg-white border-r inset-0 w-full shrink-0 md:w-72 md:max-w-sm z-10 p-6 flex flex-col gap-6 ` +
            (showSideBar ? "left-0" : "-left-[100%] md:left-0")
          }
        >
          <div className="flex items-center gap-4 px-2">
            <Image src="/logo.svg" height={32} width={32} alt="logo" />

            <h1 className="text-2xl font-bold">Yike Chat</h1>
          </div>

          <div
            ref={chatListRef}
            className="flex-1 flex flex-col gap-2"
            onClick={() => toggleSidebar()}
            onScroll={handleSideBarScroll}
          >
            <h4 className="text-gray-500">会话历史({sessions.length})</h4>
            <ChatList />
            <Spin spinning={isLoadingMore} />
          </div>

          <div className="flex flex-col gap-4">
            <button
              className="flex items-center justify-center w-full p-2 px-4 text-white bg-red-500 border-red-400 md:hidden"
              onClick={() => {
                if (confirm(Locale.Home.DeleteChat)) {
                  removeSession(currentIndex)
                }
              }}
            >
              <Icons.trash size={22} />
              <span>删除选中会话</span>
            </button>
            <button
              className="flex items-center justify-center p-2 px-4 hover:bg-slate-100 w-full"
              onClick={handleCreateConversation}
            >
              <Icons.plus size={22} />
              <span>开始新的会话</span>
            </button>
          </div>
        </div>

        <div className="flex flex-col flex-1 overflow-hidden bg-slate-100">
          <Chat showSideBar={toggleSidebar} sideBarShowing={showSideBar} />
        </div>
      </section>
    </Layout>
  )
}