"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/router"
import ConversationApi, { CompletionRequest, Conversation, Message } from "@/api/conversations"
import PromptApi, { Prompt } from "@/api/prompts"
import useAuth from "@/hooks/use-auth"
import useSettings from "@/hooks/use-settings"
import { PanelRightIcon } from "lucide-react"
import { toast } from "react-hot-toast"

import { cn, isMobileScreen, isScreenSizeAbove } from "@/lib/utils"
import AbortButton from "@/components/chat/abort-button"
import ClearButton from "@/components/chat/clear-button"
import { ConversationList } from "@/components/chat/conversation-list"
import CreateButton from "@/components/chat/create-button"
import DeleteButton from "@/components/chat/delete-button"
import ExportButton from "@/components/chat/export-button"
import ChatInput from "@/components/chat/input"
import MessageExporter from "@/components/chat/message-exporter"
import { MessageList } from "@/components/chat/message-list"
import PromptCard from "@/components/chat/prompt-card"
import BackButton from "@/components/head/back-button"
import LogoButton from "@/components/head/logo-button"
import Loading from "@/components/loading"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function ChatPage() {
  const router = useRouter()
  const { settings } = useSettings()
  const [prompt, setPrompt] = useState<Prompt>(null)
  const { hasLogged, user, redirectToLogin } = useAuth()
  const [showSidebar, setShowSidebar] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [isPromptsLoading, setIsPromptsLoading] = useState(true)
  const [isPromptsLoaded, setIsPromptsLoaded] = useState(false)
  const [currentConversation, setCurrentConversation] = useState<Conversation>(null)
  const [historyTab, setHistoryTab] = useState<"prompt" | "all">("prompt")
  const [messages, setMessages] = useState<Message[]>([])
  const [streamContent, setStreamContent] = useState("")
  const [selectable, setSelectable] = useState(false)
  const [selectedMessages, setSelectedMessages] = useState<Message[]>([])
  const [conversations, setConversations] = useState<{ prompt: Conversation[]; all: Conversation[] }>({
    prompt: [],
    all: [],
  })
  const promptId = Number(new URLSearchParams(router.asPath.split(/\?/)[1]).get("prompt_id"))
  let completionRequest = useRef<CompletionRequest>(null)

  const loadConversations = async (promptId: number) => {
    setIsPromptsLoading(true)

    const tabs = ["prompt", "all"]

    for (let i = 0; i < tabs.length; i++) {
      const tab = tabs[i]
      const { data } = await ConversationApi.list({ prompt: tab === "prompt" ? promptId : null })
      setConversations((conversations) => ({ ...conversations, [tab]: data }))
    }

    setIsPromptsLoaded(true)
    setIsPromptsLoading(false)
  }

  const loadPrompt = async (promptId: number) => {
    if (!promptId) {
      return
    }

    const res = await PromptApi.get(promptId)
    setPrompt(res)
  }

  const startWaitResponse = async (conversationId: number) => {
    const request = new CompletionRequest(conversationId)
    completionRequest.current = request

    setIsStreaming(true)
    setStreamContent("")

    request.onStreaming(async (responseText, done) => {
      if (done) {
        completionRequest.current = null
        await loadMessages(conversationId)
        loadConversations(promptId)
        setStreamContent("")
      } else {
        setStreamContent(responseText)
      }

      setIsStreaming(!done)
    })

    await request.start()
  }

  // 获取对话消息列表
  const loadMessages = async (conversationId: number) => {
    const messages = await ConversationApi.getAllMessages(conversationId)
    setMessages(messages)
  }

  // 边栏显示隐藏
  const handleToggleSidebar = () => {
    setShowSidebar(!showSidebar)
  }

  // 提交问题
  const handleUserSubmit = async (input: string) => {
    await ConversationApi.createMessage(currentConversation.id, { content: input })
    await loadMessages(currentConversation.id)
    loadConversations(promptId)
    await startWaitResponse(currentConversation.id)
  }

  // 停止生成回答
  const handleAbortAnswing = async () => {
    completionRequest.current?.abort()
    await loadMessages(currentConversation.id)
    setIsStreaming(false)
    completionRequest.current = null
  }

  // 切换对话
  const handleSelectConversation = (conversation: Conversation) => {
    setCurrentConversation(conversation)
  }

  // 自动选择或创建对话
  const selectOrCreateConversation = async () => {
    if (currentConversation) {
      return
    }

    let latest = conversations.prompt[0] || null

    if (!latest) {
      latest = await ConversationApi.create("新对话", promptId)
      loadConversations(promptId)
    }

    setCurrentConversation(latest)
  }

  // 清空对话
  const handleTruncateConversation = async (conversation: Conversation) => {
    await handleAbortAnswing()
    await ConversationApi.truncate(conversation.id)
    setMessages([])
    loadConversations(promptId)
    toast.success("已清空当前会话记录")
  }

  // 删除对话
  const handleDeleteConversation = async (conversation: Conversation) => {
    await ConversationApi.delete(conversation.id)
    toast.success("已删除")
    await loadConversations(promptId)

    if (conversation.id === currentConversation.id) {
      setCurrentConversation(null)
      setMessages([])
    }
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
    } else if (messages.length <= 0) {
      toast.error("当前对话没有消息可以导出")
    }

    setSelectable(!selectable)
  }

  const handleCreateConversation = async () => {
    const conversation = await ConversationApi.create("新对话", promptId)
    await loadConversations(promptId)

    setCurrentConversation((promptId ? conversations.prompt : conversations.all).find((c) => c.id === conversation.id))
  }

  // 根据屏幕尺寸，自动显示/隐藏边栏
  useEffect(() => {
    setShowSidebar(isScreenSizeAbove("md"))
  }, [])

  // 根据路由参数，自动加载对应的场景
  useEffect(() => {
    const init = async () => {
      if (promptId) {
        await loadPrompt(promptId)
      }

      await loadConversations(promptId)

      // 如果有指定场景，但是没有对话，则自动创建一个对话
      if (promptId && isPromptsLoaded && conversations.prompt.length <= 0) {
        await ConversationApi.create("新对话", promptId)
      }
    }

    init()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 未登录时，跳转到登录页面
  useEffect(() => {
    if (!hasLogged) {
      redirectToLogin()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // 会话列表更新时，如果没有当前会话，则自动选择第一个会话
  useEffect(() => {
    if (!isPromptsLoaded) {
      return
    }
    selectOrCreateConversation()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentConversation, conversations.prompt, isPromptsLoaded])

  // 切换对话时，自动刷新消息
  useEffect(() => {
    if (!currentConversation) {
      return
    }

    if (completionRequest.current) {
      handleAbortAnswing()
    }

    loadMessages(currentConversation.id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentConversation])

  if (!hasLogged || !user || !currentConversation) {
    return <Loading className="min-h-screen" />
  }

  return (
    <main className="relative flex h-screen flex-1 justify-start overflow-y-auto overflow-x-hidden">
      <div
        className={cn("flex h-screen w-[100vw] shrink-0 flex-col overflow-y-auto lg:ml-0 lg:flex-1", {
          "-ml-72": showSidebar,
        })}
      >
        <header className="sticky top-0 z-40 flex shrink-0 items-center justify-between overflow-hidden border-b bg-white dark:bg-muted">
          <LogoButton />
          <div className="flex flex-1 gap-6 border-l p-2 md:p-4">
            <div className="flex flex-1 items-center gap-2 md:gap-4">
              <BackButton onClick={() => router.push("/prompts")} />
              <div className="max-w-[35vw] truncate text-lg md:max-w-[45vw] ">{prompt?.name || "loading..."}</div>
            </div>
            <div className="flex shrink-0 items-center gap-2 text-muted-foreground">
              {hasLogged && (
                <>
                  <ClearButton onClick={() => handleTruncateConversation(currentConversation)} />
                  <ExportButton onClick={toggleSelectable} />
                  <DeleteButton onClick={() => handleDeleteConversation(currentConversation)} />

                  <Button
                    variant="outline"
                    className={cn(
                      "flex h-8 w-8 items-center justify-center p-1 hover:bg-primary-100 dark:hover:bg-muted",
                      {
                        "border-primary-300 bg-primary-100 dark:bg-muted": isMobileScreen() && showSidebar,
                      }
                    )}
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

        {/* 对话列表 */}
        <div className="flex-1 overflow-y-auto">
          <MessageList
            messages={messages}
            selectable={selectable}
            isStreaming={isStreaming}
            streamContent={streamContent}
            onSelect={handleSelectMessages}
          />
        </div>

        {/* 底部输入框 */}
        <footer className="sticky bottom-0 z-10 bg-white p-4 dark:bg-muted md:p-6 xl:p-12">
          {!selectable && (
            <div className="flex flex-col gap-4">
              {isStreaming && <AbortButton onClick={handleAbortAnswing} />}
              <ChatInput submitKey={settings.chat_submit_key} onSubmit={handleUserSubmit} isStreaming={isStreaming} />
            </div>
          )}

          {/* 导出图片 */}
          {selectable && <MessageExporter messages={selectedMessages} user={user} onCancel={toggleSelectable} />}
        </footer>
      </div>

      {/* 信息边栏 */}
      <aside
        className={cn(
          "sticky top-0 mr-0 flex h-full w-72 shrink-0 flex-col gap-6 overflow-hidden border-l bg-white p-6 text-gray-700 transition-all delay-75 dark:bg-background",
          {
            "-mr-72": !showSidebar,
          }
        )}
      >
        {prompt && <PromptCard prompt={prompt} />}

        <div className="border-t"></div>

        <div className="flex flex-1 flex-col gap-4 overflow-hidden">
          <Label className="shink-0 text-muted-foreground">对话历史</Label>
          <Tabs
            onValueChange={handleChangeConversationHistoryTab}
            value={historyTab}
            className="flex flex-1 flex-col overflow-y-auto"
          >
            <TabsList className="grid shrink-0 grid-cols-2 bg-primary-50 dark:bg-muted">
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
            <TabsContent value="prompt" className="flex-1 overflow-y-auto">
              {isPromptsLoading && conversations.prompt.length <= 0 && <Loading className="h-32" />}
              <ConversationList
                selectedId={currentConversation?.id}
                conversations={conversations.prompt}
                onSelect={handleSelectConversation}
                onDelete={handleDeleteConversation}
              />
            </TabsContent>
            <TabsContent value="all" className="flex-1 overflow-y-auto">
              {isPromptsLoading && conversations.all.length <= 0 && <Loading className="h-32" />}
              <ConversationList
                selectedId={currentConversation?.id}
                conversations={conversations.all}
                onSelect={handleSelectConversation}
                onDelete={handleDeleteConversation}
              />
            </TabsContent>
          </Tabs>

          <CreateButton onClick={handleCreateConversation} />
        </div>
      </aside>
    </main>
  )
}
