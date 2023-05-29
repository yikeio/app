import {
  createConversation,
  deleteConversation,
  getConversationMessageList,
  getConversations,
} from "@/api/conversations"
import Locale from "@/locales"
import { getCurrentDate } from "@/utils"
import { ControllerPool, requestChatStream } from "@/utils/requests"
import { create } from "zustand"

export type Message = {
  id: number
  date: string
  role: string
  content: string
  streaming?: boolean
  isError?: boolean
  preview?: boolean
  created_at: string
  updated_at: string
}

export const ROLES: Message["role"][] = ["system", "user", "assistant"]

export interface ChatSession {
  id: number
  title: string
  messages_count: number
  memoryPrompt: string
  messages: Message[]
  updated_at: string
}

const DEFAULT_TOPIC = Locale.Store.DefaultTopic
export const BOT_HELLO: Message = {
  id: 0,
  role: "assistant",
  content: Locale.Store.BotHello,
  date: "",
}

export const BOT_HELLO_LOGIN: Message = {
  id: -1,
  role: "assistant",
  content: Locale.Store.LoginHello,
  date: "",
}

function createEmptySession(): ChatSession {
  const createDate = getCurrentDate().toDateString()

  return {
    id: -2,
    title: DEFAULT_TOPIC,
    memoryPrompt: "",
    messages: [],
    messages_count: 0,
    updated_at: createDate,
  }
}

type Pager = {
  currentPage: number
  lastPage: number
  pageSize: number
}

interface ChatStore {
  isStreaming: boolean
  sessions: ChatSession[]
  currentSessionIndex: number
  getConversationList: (userId: string, params?: { page: number; pageSize?: number }) => Promise<void>
  createConversation: () => Promise<ChatSession>
  getConversationHistory: (conversationId: number, params?: { page: number; pageSize?: number }) => Promise<Message[]>
  // 对话分页
  conversationPager: Pager
  // 对话历史分页
  messageHistoryPagerMap: Map<number, Pager>

  clearSessions: () => void
  removeSession: (index: number) => void
  selectSession: (index: number) => void
  currentSession: () => ChatSession
  onNewMessage: (message: Message) => void
  onUserInput: (content: string) => Promise<void>
  onUserInputStop: () => Promise<void>

  updateCurrentSession: (updater: (session: ChatSession) => void) => void
  updateMessage: (sessionIndex: number, messageIndex: number, updater: (message?: Message) => void) => void

  // 答案是否正在加载
  isLoadingAnswer: boolean
  setIsLoadingAnswer: (isLoading: boolean) => void
}

// 记录会话缓存
const cacheSet = new Set()

export const useChatStore = create<ChatStore>()((set, get) => ({
  isStreaming: false,
  sessions: [createEmptySession()],
  currentSessionIndex: 0,

  async getConversationList(userId: string, params) {
    const conversationRes = await getConversations(userId, params)
    // update pager
    set(() => ({
      conversationPager: {
        currentPage: conversationRes.current_page,
        pageSize: conversationRes.per_page,
        lastPage: conversationRes.last_page,
      },
    }))

    const list: ChatSession[] = conversationRes.data

    if (list.length === 0) {
      const conversation = await get().createConversation()
      list.push(conversation)
    }

    set(() => ({
      sessions: list.map((conversation) => {
        conversation.messages = []
        conversation.updated_at = new Date(conversation.updated_at).toLocaleString()
        return conversation
      }),
    }))

    // 有列表则获取当前会话历史
    if (list.length) {
      const conversationId = get().currentSession().id
      const messageList: Message[] = await get().getConversationHistory(conversationId)
      get().updateCurrentSession((session) => (session.messages = messageList))
    }
  },
  conversationPager: { currentPage: 1, pageSize: 15, lastPage: 1 },
  messageHistoryPagerMap: new Map(),

  // 创建新的对话
  async createConversation() {
    const res = await createConversation(DEFAULT_TOPIC)
    const conversation = res
    conversation.messages = []
    conversation.updated_at = new Date(conversation.updated_at).toLocaleString()

    set((state) => ({
      currentSessionIndex: 0,
      sessions: [conversation].concat(state.sessions),
    }))

    return conversation
  },

  async getConversationHistory(conversationId, params) {
    const messageRes = await getConversationMessageList(conversationId, params)
    // update pager
    set(() => ({
      messageHistoryPagerMap: get().messageHistoryPagerMap.set(conversationId, {
        currentPage: messageRes.current_page,
        pageSize: messageRes.per_page,
        lastPage: messageRes.last_page,
      }),
    }))

    const list: ChatSession[] = messageRes.data.reverse()
    cacheSet.add(conversationId)

    const historyList = list.map((item: any) => {
      return {
        id: item.id || "",
        role: item.role,
        content: item.content,
        date: item.created_at,
        streaming: false,
        isError: false,
      }
    })
    return historyList
  },

  clearSessions() {
    set(() => ({
      sessions: [createEmptySession()],
      currentSessionIndex: 0,
    }))
  },

  async selectSession(index: number) {
    set({ currentSessionIndex: index })

    const conversationId = get().currentSession().id

    // 判断缓存是否获取过
    if (cacheSet.has(conversationId)) return

    // 获取历史消息
    if (conversationId <= 0) return

    const messageList = await get().getConversationHistory(conversationId)
    get().updateCurrentSession((session) => (session.messages = messageList))
  },

  async removeSession(index: number) {
    await deleteConversation(get().currentSession().id)

    let nextSessions = get().sessions.filter((_, i) => i !== index)
    if (!nextSessions.length) nextSessions = [createEmptySession()]

    set(() => ({ sessions: nextSessions }))
  },

  currentSession() {
    let index: number = get().currentSessionIndex
    const sessions: ChatSession[] = get().sessions

    if (index < 0 || index >= sessions.length) {
      index = Math.min(sessions.length - 1, Math.max(0, index))
      set(() => ({ currentSessionIndex: index }))
    }

    const session = sessions[index]

    return session
  },

  onNewMessage(message) {
    get().updateCurrentSession((session) => {
      session.updated_at = getCurrentDate().toDateString()
    })
  },

  async onUserInputStop() {
    const sessionIndex = get().currentSessionIndex
    const messageIndex = get().currentSession().messages.length + 1
    ControllerPool.remove(sessionIndex, messageIndex)
    set(() => ({ isStreaming: false }))
  },
  async onUserInput(content) {
    set(() => ({ isStreaming: true }))
    const userMessage: Message = {
      id: new Date().getTime(),
      role: "user",
      content,
      date: getCurrentDate().toDateString(),
    }

    const botMessage: Message = {
      id: new Date().getTime(),
      content: "",
      role: "assistant",
      date: getCurrentDate().toDateString(),
      streaming: true,
    }

    const sessionIndex = get().currentSessionIndex
    const messageIndex = get().currentSession().messages.length + 1

    // save user's and bot's message
    get().updateCurrentSession((session) => {
      session.messages.push(userMessage)
      session.messages.push(botMessage)
    })

    // make request
    requestChatStream(content, {
      conversationId: get().currentSession().id,
      onMessage(content, done) {
        // stream response
        if (done) {
          botMessage.streaming = false
          botMessage.content = content
          get().onNewMessage(botMessage)
          ControllerPool.remove(sessionIndex, messageIndex)
        } else {
          botMessage.content = content
        }
        set(() => ({
          isStreaming: false,
        }))
      },
      onError(error, statusCode) {
        botMessage.content += "\n\n" + Locale.Store.Error
        botMessage.streaming = false
        userMessage.isError = true
        botMessage.isError = true
        set(() => ({
          isStreaming: false,
        }))
        ControllerPool.remove(sessionIndex, messageIndex)
      },
      onController(controller) {
        // collect controller for stop/retry
        ControllerPool.addController(sessionIndex, messageIndex, controller)
      },
    })
  },

  getMemoryPrompt() {
    const session = get().currentSession()

    return {
      role: "system",
      content: Locale.Store.Prompt.History(session.memoryPrompt),
      date: "",
    } as Message
  },

  updateMessage(sessionIndex: number, messageIndex: number, updater: (message?: Message) => void) {
    const sessions = get().sessions
    const session = sessions.at(sessionIndex)
    const messages = session?.messages
    updater(messages?.at(messageIndex))
    set(() => ({ sessions }))
  },

  updateCurrentSession(updater) {
    const sessions = get().sessions
    const index = get().currentSessionIndex
    updater(sessions[index])
    set(() => ({ sessions }))
  },

  isLoadingAnswer: false,
  setIsLoadingAnswer(isLoadingAnswer: boolean) {
    set(() => ({ isLoadingAnswer }))
  },
}))
