import { getCurrentDate } from "@/utils"
import { create } from "zustand"

import {
  createConversation,
  deleteConversation,
  getConversationList,
  getConversationMessageList,
} from "../api/conversations"
import { getListUserSettings, updateListUserSettings } from "../api/user"
import Locale from "../locales"
import { ControllerPool, requestChatStream } from "../utils/requests"

export type Message = {
  id: string
  date: string
  role: string
  content: string
  streaming?: boolean
  isError?: boolean
  preview?: boolean
}

export enum SubmitKey {
  Enter = "Enter",
  CtrlEnter = "Ctrl + Enter",
  ShiftEnter = "Shift + Enter",
  AltEnter = "Alt + Enter",
  MetaEnter = "Meta + Enter",
}

export enum Theme {
  Auto = "auto",
  Dark = "dark",
  Light = "light",
}

export interface ChatConfig {
  chat_contexts_count: number // -1 means all
  chat_submit_key: SubmitKey
  avatar: string
  chat_font_size: number
  no_border: boolean
}

export const ROLES: Message["role"][] = ["system", "user", "assistant"]

const DEFAULT_CONFIG: ChatConfig = {
  chat_contexts_count: 3, //携带历史记录
  chat_submit_key: SubmitKey.Enter as SubmitKey, //发送键
  avatar: "1f603", //头像
  chat_font_size: 14, //字体大小
  no_border: true, //无边框模式
}

export interface ChatSession {
  messages_count: number
  id: string
  title: string
  memoryPrompt: string
  context: Message[]
  messages: Message[]
  updated_at: string
}

const DEFAULT_TOPIC = Locale.Store.DefaultTopic
export const BOT_HELLO: Message = {
  id: "hello",
  role: "assistant",
  content: Locale.Store.BotHello,
  date: "",
}

function createEmptySession(): ChatSession {
  const createDate = getCurrentDate().toDateString()

  return {
    id: "-1",
    title: DEFAULT_TOPIC,
    memoryPrompt: "",
    context: [],
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
  user: Record<string, any>
  config: ChatConfig
  sessions: ChatSession[]
  currentSessionIndex: number
  getConversationList: (
    userId: string,
    params?: { page: number; pageSize?: number }
  ) => Promise<void>
  createConversation: () => Promise<ChatSession>
  getConversationHistory: (
    conversationId: string,
    params?: { page: number; pageSize?: number }
  ) => Promise<Message[]>
  // 对话分页
  conversationPager: Pager
  // 对话历史分页
  messageHistoryPagerMap: Map<string, Pager>

  clearSessions: () => void
  removeSession: (index: number) => void
  selectSession: (index: number) => void
  currentSession: () => ChatSession
  onNewMessage: (message: Message) => void
  onUserInput: (content: string) => Promise<void>

  updateCurrentSession: (updater: (session: ChatSession) => void) => void
  updateMessage: (
    sessionIndex: number,
    messageIndex: number,
    updater: (message?: Message) => void
  ) => void
  updateUser: (user: Record<string, string>) => void
  getConfig: () => ChatConfig
  updateConfig: (
    updater: (config: ChatConfig) => void,
    userId: string,
    data: Record<string, any>
  ) => void
  getUserSettings: (userId: string) => Promise<void>
  clearAllData: () => void
}

// 记录会话缓存
const cacheSet = new Set()

export const useChatStore = create<ChatStore>()((set, get) => ({
  user: {},
  sessions: [createEmptySession()],
  currentSessionIndex: 0,
  config: {
    ...DEFAULT_CONFIG,
  },

  updateUser(user: Record<string, string>) {
    set(() => ({ user }))
  },

  // 获取用户配置
  async getUserSettings(userId: string) {
    const res = await getListUserSettings(userId)
    const config = res.result
    set(() => ({ config }))
  },

  async getConversationList(userId: string, params) {
    const conversationRes = await getConversationList(userId, params)
    // update pager
    set(() => ({
      conversationPager: {
        currentPage: conversationRes.result.current_page,
        pageSize: conversationRes.result.per_page,
        lastPage: conversationRes.result.last_page,
      },
    }))

    const list: ChatSession[] = conversationRes.result.data

    if (list.length === 0) {
      const conversation = await get().createConversation()
      list.push(conversation)
    }

    set(() => ({
      sessions: list.map((conversation) => {
        conversation.context = []
        conversation.messages = []
        conversation.updated_at = new Date(
          conversation.updated_at
        ).toLocaleString()
        return conversation
      }),
    }))

    // 有列表则获取当前会话历史
    if (list.length) {
      const conversationId = String(get().currentSession().id)
      const messageList: Message[] = await get().getConversationHistory(
        conversationId
      )
      get().updateCurrentSession((session) => (session.messages = messageList))
    }
  },
  conversationPager: { currentPage: 1, pageSize: 15, lastPage: 1 },
  messageHistoryPagerMap: new Map(),

  // 创建新的对话
  async createConversation() {
    const res = await createConversation(DEFAULT_TOPIC)
    const conversation = res.result
    conversation.context = []
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
        currentPage: messageRes.result.current_page,
        pageSize: messageRes.result.per_page,
        lastPage: messageRes.result.last_page,
      }),
    }))

    const list: ChatSession[] = messageRes.result.data.reverse()
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

  getConfig() {
    return get().config
  },

  async updateConfig(updater, userId, data = {}) {
    const config = get().config
    updater(config)
    await updateListUserSettings(userId, data)
    set(() => ({ config }))
  },

  async selectSession(index: number) {
    set({ currentSessionIndex: index })

    const conversationId = String(get().currentSession().id)

    // 判断缓存是否获取过
    if (cacheSet.has(conversationId)) return

    // 获取历史消息
    if (conversationId === "-1") return

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

  async onUserInput(content) {
    const userMessage: Message = {
      id: `${new Date().getTime().toString()}_user`,
      role: "user",
      content,
      date: getCurrentDate().toDateString(),
    }

    const botMessage: Message = {
      id: `${new Date().getTime().toString()}_bot`,
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
      conversationId: String(get().currentSession().id),
      onMessage(content, done) {
        // stream response
        if (done) {
          botMessage.streaming = false
          botMessage.content = content
          get().onNewMessage(botMessage)
          ControllerPool.remove(sessionIndex, messageIndex)
        } else {
          botMessage.content = content
          set(() => ({}))
        }
      },
      onError(error, statusCode) {
        botMessage.content += "\n\n" + Locale.Store.Error
        botMessage.streaming = false
        userMessage.isError = true
        botMessage.isError = true
        set(() => ({}))
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

  updateMessage(
    sessionIndex: number,
    messageIndex: number,
    updater: (message?: Message) => void
  ) {
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

  clearAllData() {
    if (confirm(Locale.Store.ConfirmClearAll)) {
      localStorage.clear()
      location.reload()
    }
  },
}))
