"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import {
  Conversation,
  Message,
  createCompletion,
  createConversation,
  createMessage,
  deleteConversation,
  getAllMessages,
  getConversation,
  getConversations,
  getMessages,
  truncateConversation,
  waitConversationResponse,
} from "@/api/conversations"
import PromptApi, { Prompt } from "@/api/prompts"
import useAuth from "@/hooks/use-auth"
import useLocalStorage from "@/hooks/use-localstorage"
import useSettings from "@/hooks/use-settings"
import { useBillingStore } from "@/store"
import { isMobileScreen, isScreenSizeAbove } from "@/utils"
import {
  BadgeCheckIcon,
  BotIcon,
  ImageIcon,
  ListXIcon,
  PanelRightIcon,
  PlusIcon,
  Share2Icon,
  ShareIcon,
  StopCircleIcon,
  Trash2Icon,
  XIcon,
} from "lucide-react"
import { toast } from "react-hot-toast"
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
  const { settings } = useSettings()
  const [prompt, setPrompt] = useState<Prompt>(null)
  const { hasLogged, user, redirectToLogin } = useAuth()
  const [showSidebar, setShowSidebar] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [conversation, setConversation] = useLocalStorage<Conversation>("selectedConversation", null)
  const [historyTab, setHistoryTab] = useLocalStorage<"prompt" | "all">("selectedHistoryTab", "prompt")
  const [messages, setMessages] = useState<Message[]>([])
  const [streamContent, setStreamContent] = useState("")
  const [currentPlan] = useBillingStore((state) => [state.currentQuota])
  const [selectable, setSelectable] = useState(false)
  const [selectedMessages, setSelectedMessages] = useState<Message[]>([])

  const {
    data: conversations,
    mutate: refreshConversations,
    isLoading: isConversationsLoading,
  } = useSWR(
    () => (hasLogged ? `conversations:${historyTab === "all" ? "all" : prompt.id}` : null),
    () => getConversations({ prompt: historyTab === "all" ? "" : prompt.id })
  )

  const startWaitResponse = async () => {
    waitConversationResponse(conversation.id, {
      onStreaming: (segment, done) => {
        setStreamContent(segment)
        setIsStreaming(!done)

        if (done) {
          refreshMessages()
        }
      },
      onError(response) {
        setStreamContent("加载失败")
        setIsStreaming(false)
      },
    })
  }

  // 获取对话消息列表
  const refreshMessages = async () => {
    if (!conversation) {
      return
    }

    const messages = await getAllMessages(conversation.id)
    setMessages(messages)
  }

  // 边栏显示隐藏
  const handleToggleSidebar = () => {
    setShowSidebar(!showSidebar)
  }

  // 提交问题
  const handleUserSubmit = (input: string) => {
    createMessage(conversation.id, { content: input }).then(refreshMessages).then(startWaitResponse)
  }

  // 停止生成回答
  const handleAbortAnswing = () => {
    // todo
  }

  // 切换对话
  const handleSelectConversation = (conversation: Conversation) => {
    setConversation(conversation)
  }

  // 清空对话
  const handleTruncateConversation = (conversation: Conversation) => {
    truncateConversation(conversation.id).then(() => setMessages([]))
  }

  // 删除对话
  const handleDeleteConversation = (conversation: Conversation) => {
    deleteConversation(conversation.id).then(() => {
      setConversation(null)
      refreshConversations()
    })
  }

  // 切换对话历史记录类型
  const handleChangeConversationHistoryTab = (tab: "prompt" | "all") => {
    setHistoryTab(tab)
  }

  // 选择消息的结果
  const handleSelectMessages = (messages: Message[]) => {
    setSelectedMessages(messages)
  }

  // 切换分享模式
  const toggleSelectable = () => {
    if (selectable) {
      setSelectedMessages([])
    }

    setSelectable(!selectable)
  }

  // 导出图片
  const handleExportToImage = () => {
    console.log("导出图片")
    //todo
  }

  const handleCreateConversation = () => {
    if (!currentPlan.is_available) {
      toast.error("当前无可用套餐，请购买套餐!")
      location.href = "/pricing"
      return
    }

    createConversation("新对话")
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
    if (isConversationsLoading || !prompt || conversation) {
      return
    }

    if (conversations?.data.length) {
      setConversation(conversations.data[0])
    } else {
      createConversation(prompt?.name || "新的聊天", prompt.id).then((res) => {
        refreshConversations().then(() => {
          setConversation(res)
        })
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
        className={cn("flex h-screen w-[100vw] shrink-0 flex-col overflow-y-auto lg:ml-0 lg:flex-1", {
          "-ml-72": showSidebar,
        })}
      >
        <header className="sticky top-0 z-40 flex shrink-0 items-center justify-between overflow-hidden border-b bg-white">
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
                    title="清空消息"
                    variant="outline"
                    onClick={() => handleTruncateConversation(conversation)}
                    className="flex h-8 w-8 items-center justify-center p-1 hover:bg-primary-100"
                  >
                    <ListXIcon className="h-4 w-4" />
                  </Button>

                  <Button
                    title="分享"
                    variant="outline"
                    onClick={toggleSelectable}
                    className="flex h-8 w-8 items-center justify-center p-1 hover:bg-primary-100"
                  >
                    <Share2Icon className="h-4 w-4" />
                  </Button>

                  <Button
                    title="删除"
                    variant="outline"
                    onClick={() => handleDeleteConversation(conversation)}
                    className="flex h-8 w-8 items-center justify-center p-1 hover:bg-primary-100"
                  >
                    <Trash2Icon className="h-4 w-4" />
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

        <div className="flex-1 overflow-y-auto">
          <MessageList
            messages={messages}
            selectable={selectable}
            isStreaming={isStreaming}
            streamContent={streamContent}
            onSelect={handleSelectMessages}
          />
        </div>

        <footer className="sticky bottom-0 z-10 bg-white p-4 md:p-6 xl:p-12">
          {/* 输入框 */}
          {!selectable && (
            <div className="flex flex-col gap-4">
              {isStreaming && (
                <div className="flex items-center justify-center gap-4">
                  <Button className="flex items-center gap-2" onClick={handleAbortAnswing}>
                    <StopCircleIcon size={16} />
                    <span>停止生成</span>
                  </Button>
                </div>
              )}
              <ChatInput submitKey={settings.chat_submit_key} onSubmit={handleUserSubmit} />
            </div>
          )}

          {/* 导出图片 */}
          {selectable && (
            <div className="flex items-center justify-between gap-4">
              <div className="text-gray-500">已选择 {selectedMessages.length} 条消息</div>
              <div className="flex items-center gap-4">
                <Button className="flex w-full items-center gap-2 md:w-auto" onClick={handleExportToImage}>
                  <ImageIcon size={16} />
                  <span>导出</span>
                </Button>
                <Button
                  variant="secondary"
                  className="flex w-full items-center gap-2 md:w-auto"
                  onClick={toggleSelectable}
                >
                  <XIcon size={16} />
                  <span>取消</span>
                </Button>
              </div>
            </div>
          )}
        </footer>
      </div>
      <aside
        className={cn(
          "sticky top-0 mr-0 flex h-full w-72 shrink-0 flex-col gap-6 overflow-hidden border-l bg-white p-6 text-gray-700 transition-all delay-75",
          {
            "-mr-72": !showSidebar,
          }
        )}
      >
        {prompt && (
          <div className="flex shrink-0 flex-col items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-50 text-5xl">
              {prompt.logo}
            </div>
            <div className="text-xl">{prompt.name}</div>
            <div className="flex flex-col gap-4">
              <div className="text-gray-500">{prompt.description}</div>
              <div className="text-center text-sm text-primary-500">使用人数： 59281 人</div>
            </div>
          </div>
        )}

        <div className="border-t"></div>

        <div className="flex flex-1 flex-col gap-4 overflow-y-auto">
          <Label>对话历史</Label>
          <Tabs onValueChange={handleChangeConversationHistoryTab} value={historyTab}>
            <TabsList className="grid grid-cols-2 bg-primary-50">
              <TabsTrigger value="prompt">
                <div className="flex items-center gap-1">
                  <span>当前场景</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="all">
                <div className="flex items-center gap-1">
                  <span>全部场景</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <ConversationList conversations={conversations?.data || []} onSelect={handleSelectConversation} />

          <div className="flex flex-col gap-4">
            <Button className="flex w-full items-center justify-center gap-2" onClick={handleCreateConversation}>
              <PlusIcon size={22} />
              <span>开启新的对话</span>
            </Button>
          </div>
        </div>
      </aside>
    </main>
  )
}
