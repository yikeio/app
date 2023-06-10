import qs from "qs"

import Request from "@/lib/request"
import { Prompt } from "./prompts"
import { User } from "./users"

export interface Conversation {
  id: number
  creator_id: number
  title: string
  creator?: User
  prompt?: Prompt
  messages_count: number
  tokens_count: number
  first_active_at: string
  last_active_at: string
  created_at: string
  updated_at: string
}

export interface Message {
  id?: number
  quota_id: number
  creator_id: number
  conversation_id: number
  role: "user" | "system" | "assistant"
  content: string
  tokens_count: number
  created_at: string
  updated_at: string
  has_liked: boolean

  // 后端没有的属性
  isLoading?: boolean
  isStreaming: boolean
}

export default class ConversationApi {
  static async list(options?: { prompt?: number | string; page?: number; pageSize?: number; sorts?: string }) {
    const { prompt = "", page = 1, pageSize = 15, sorts = "last_active_at" } = options || {}
    return Request.getJson(
      `chat/conversations${qs.stringify({ prompt, page, pageSize, sorts }, { addQueryPrefix: true })}`
    )
  }

  static async get(conversationId: number): Promise<Conversation> {
    return Request.getJson(`chat/conversations/${conversationId}`)
  }

  static async create(title: string = "", promptId?: number | string): Promise<Conversation> {
    return Request.postJson("chat/conversations", { title, prompt_id: promptId })
  }

  static async update(conversationId: number, data: Partial<Conversation>): Promise<Conversation> {
    return Request.patchJson(`chat/conversations/${conversationId}`, data)
  }

  static async delete(conversationId: number): Promise<undefined> {
    return Request.deleteJson(`chat/conversations/${conversationId}`)
  }

  static async truncate(conversationId: number) {
    return Request.post(`chat/conversations/${conversationId}:truncate`)
  }

  static async createMessage(conversationId: number, data: Partial<Message>) {
    return Request.postJson(`chat/conversations/${conversationId}/messages`, data)
  }

  static async toggleLikeMessage(messageId: number) {
    return Request.postJson(`chat/messages/${messageId}:toggle-like`)
  }

  static async getMessages(
    conversationId: number,
    options?: { page?: number; pageSize?: number; sorts?: string }
  ): Promise<{ data: Message[]; per_page: number; page: number }> {
    const { page = 1, pageSize = 15, sorts = "created_at" } = options || {}
    return Request.getJson(
      `chat/conversations/${conversationId}/messages${qs.stringify(
        { page, pageSize, sorts },
        { addQueryPrefix: true }
      )}`
    )
  }

  static async getAllMessages(conversationId: number): Promise<Message[]> {
    const messages: Message[] = []

    let page = 1
    let response = await ConversationApi.getMessages(conversationId, { page })

    messages.push(...response.data)

    while (response.data.length > 0) {
      page++
      response = await ConversationApi.getMessages(conversationId, { page })
      messages.push(...response.data)
    }

    return messages
  }

  static async createCompletion(conversationId: number, signal?: AbortSignal) {
    return Request.post(`chat/conversations/${conversationId}/completions`, [], {
      signal,
    })
  }
}

export type CompletionRequestCallback = (responseText: string, done: boolean, response: Response) => void

export class CompletionRequest {
  private timeout: number
  private controller: AbortController
  private callback: CompletionRequestCallback | null

  constructor(private conversationId: number, timeout: number = 10000) {
    this.controller = new AbortController()
    this.callback = null
    this.timeout = timeout
  }

  async start(): Promise<void> {
    if (!this.callback) {
      throw new Error("Callback is not set")
    }
    try {
      const response = await ConversationApi.createCompletion(this.conversationId, this.controller.signal)

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      let responseText = ""
      let done = false

      while (!done) {
        const timeoutId = setTimeout(() => {
          this.controller.abort()
          throw new Error("Failed to load due to request: timeout")
        }, this.timeout)

        const content = await reader?.read().catch((error) => {
          clearTimeout(timeoutId)
          if (error.name === "AbortError") {
            console.log("Request Aborted")
          } else {
            throw error
          }
        })

        if (!content) {
          break
        }

        clearTimeout(timeoutId)

        const text = decoder.decode(content.value)

        responseText += text

        this.callback(responseText, (done = content.done), response)
      }
    } catch (error) {
      if (error.name === "AbortError") {
        return console.log("Request Aborted")
      } else {
        throw error
      }
    }
  }

  abort() {
    this.controller.abort()
  }

  onStreaming(callback: CompletionRequestCallback) {
    this.callback = callback
  }

  onAbort(callback: () => void) {
    this.controller.signal.addEventListener("abort", callback)
  }
}
