"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import {
  Conversation,
  Message,
  createConversation,
  getConversation,
  getConversations,
  getMessages,
} from "@/api/conversations"
import PromptApi, { Prompt } from "@/api/prompts"
import useAuth from "@/hooks/use-auth"
import useLocalStorage from "@/hooks/use-localstorage"
import useSettings from "@/hooks/use-settings"
import { isMobileScreen, isScreenSizeAbove } from "@/utils"
import { BadgeCheckIcon, BotIcon, PanelRightIcon, ShareIcon, StopCircleIcon } from "lucide-react"
import useSWR from "swr"

import { cn } from "@/lib/utils"
import { ConversationList } from "@/components/chat/conversation-list"
import ChatInput from "@/components/chat/input"
import { MessageList } from "@/components/chat/message-list"
import BackButton from "@/components/head/back-button"
import LogoButton from "@/components/head/logo-button"
import Loading from "@/components/loading"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ChatPage() {
  const router = useRouter()
  const { settings, isLoading: isSettingsLoading } = useSettings()
  const [prompt, setPrompt] = useState<Prompt>(null)
  const { hasLogged, user, redirectToLogin } = useAuth()
  const [showSidebar, setShowSidebar] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [conversation, setConversation] = useLocalStorage<Conversation>("selectedConversation", null)
  const [historyTab, setHistoryTab] = useLocalStorage<"current" | "all">("selectedHistoryTab", "current")
  const [messages, setMessages] = useState<Message[]>([])

  const { data: conversations, isLoading: isConversationsLoading } = useSWR(`conversations`, () => getConversations())

  // 获取对话消息列表
  const refreshMessages = async () => {
    if (!conversation) {
      return
    }
    const { data } = await getMessages(conversation.id)
    setMessages(data)
  }

  // 边栏显示隐藏
  const handleToggleSidebar = () => {
    setShowSidebar(!showSidebar)
  }

  // 提交问题
  const handleUserSubmit = () => {
    // todo
  }

  // 停止生成回答
  const handleAbortAnswing = () => {
    // todo
  }

  // 选择对话
  const handleSelectConversation = (conversation: Conversation) => {
    setConversation(conversation)
  }

  // 切换对话历史记录类型
  const handleChangeConversationHistoryTab = (tab: "current" | "all") => {
    setHistoryTab(tab)
  }

  // 未登录时，跳转到登录页面
  useEffect(() => {
    if (!hasLogged) {
      redirectToLogin()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasLogged, user])

  // 对话列表加载完成后，自动选择第一个对话
  useEffect(() => {
    if (isConversationsLoading) {
      return
    }

    if (conversations?.data.length) {
      setConversation(conversations.data[0])
    } else {
      createConversation(prompt?.name || "新的聊天").then((res) => {
        setConversation(res)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversations])

  // 切换对话时，自动刷新消息
  useEffect(() => {
    conversation && refreshMessages()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversation])

  // 根据屏幕尺寸，自动显示/隐藏边栏
  useEffect(() => {
    setShowSidebar(isScreenSizeAbove("md"))
  }, [])

  // 根据路由参数，自动加载对应的场景
  useEffect(() => {
    if (router.query.prompt_id) {
      PromptApi.get(router.query.prompt_id as string).then((res) => {
        setPrompt(res)
      })
    }
  }, [router.query.prompt_id])

  if (!hasLogged || !user || isConversationsLoading || !conversation) {
    return <Loading className="min-h-screen" />
  }

  return (
    <main className="relative flex h-screen flex-1 justify-start overflow-y-auto overflow-x-hidden">
      <div
        className={cn("flex h-screen w-[100vw] shrink-0 flex-col border-r lg:ml-0 lg:flex-1", {
          "-ml-72": showSidebar,
        })}
      >
        <header className="flex shrink-0 items-center justify-between overflow-hidden border-b bg-white">
          <LogoButton />
          <div className="flex flex-1 gap-6 border-l p-2 md:p-4">
            <div className="flex flex-1 items-center gap-2 md:gap-4">
              <BackButton />
              <div className="max-w-[45vw] truncate text-lg ">{prompt?.name || "loading..."}</div>
            </div>
            <div className="flex shrink-0 items-center gap-2 text-gray-500">
              {hasLogged && (
                <>
                  <Button
                    variant="outline"
                    className="flex h-8 w-8 items-center justify-center p-1 hover:bg-primary-100"
                  >
                    <ShareIcon className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    className={cn("flex h-8 w-8 items-center justify-center p-1 hover:bg-primary-100", {
                      "border-primary-300 bg-primary-100": isMobileScreen() && showSidebar,
                    })}
                    title="打开/关闭边栏"
                    onClick={handleToggleSidebar}
                  >
                    <PanelRightIcon className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1">
          <MessageList messages={messages} />
        </div>

        <footer className="sticky bottom-0 z-10 p-4 md:p-6 xl:p-12">
          {isStreaming && (
            <Button className="flex w-full items-center gap-2 md:w-auto" onClick={handleAbortAnswing}>
              <StopCircleIcon size={12} />
              <span>停止生成</span>
            </Button>
          )}
          <ChatInput submitKey={settings.chat_submit_key} onSubmit={handleUserSubmit} />
        </footer>
      </div>
      <aside
        className={cn("mr-0 w-72 shrink-0 p-6 text-gray-700 transition-all delay-75", {
          "-mr-72": !showSidebar,
        })}
      >
        {prompt && (
          <div className="flex flex-col items-center gap-6 py-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-50 text-5xl">
              {prompt.logo}
            </div>
            <div className="text-xl">{prompt.name}</div>
            <div className="text-gray-500">{prompt.description}</div>
            <div className="text-gray-500">使用人数： 59281 人</div>
          </div>
        )}

        <div className="flex flex-col gap-4 border-t py-6">
          <Label className="mt-6">对话历史</Label>
          <Tabs onValueChange={handleChangeConversationHistoryTab} value={historyTab}>
            <TabsList className="grid grid-cols-2 bg-primary-50">
              <TabsTrigger value="current">
                <div className="flex items-center gap-1">
                  <span>当前场景(5)</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="all">
                <div className="flex items-center gap-1">
                  <span>全部场景(50)</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <ConversationList conversations={conversations?.data} user={user} onSelect={handleSelectConversation} />
        </div>
      </aside>
    </main>
  )
}
