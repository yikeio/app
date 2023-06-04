import qs from "qs"

import Request from "@/lib/request"

export interface Conversation {
  id: number
  creator_id: number
  title: string
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

  // 后端没有的属性
  isLoading?: boolean
  isStreaming: boolean
}

export async function getConversations(options?: {
  prompt?: number | string
  page?: number
  pageSize?: number
  sorts?: string
}) {
  const { prompt = "", page = 1, pageSize = 15, sorts = "last_active_at" } = options || {}
  return Request.getJson(
    `chat/conversations${qs.stringify({ prompt, page, pageSize, sorts }, { addQueryPrefix: true })}`
  )
}

export async function getConversation(conversationId: number): Promise<Conversation> {
  return Request.getJson(`chat/conversations/${conversationId}`)
}

export async function createConversation(title: string = "", promptId?: number | string): Promise<Conversation> {
  return Request.postJson("chat/conversations", { title, prompt_id: promptId })
}

export async function updateConversation(conversationId: number, data: Partial<Conversation>): Promise<Conversation> {
  return Request.patchJson(`chat/conversations/${conversationId}`, data)
}

export async function deleteConversation(conversationId: number): Promise<undefined> {
  return Request.deleteJson(`chat/conversations/${conversationId}`)
}

export async function createMessage(conversationId: number, data: Partial<Message>) {
  return Request.postJson(`chat/conversations/${conversationId}/messages`, data)
}

export async function getMessages(
  conversationId: number,
  options?: { page?: number; pageSize?: number; sorts?: string }
) {
  const { page = 1, pageSize = 15, sorts = "id:desc" } = options || {}
  return Request.getJson(
    `chat/conversations/${conversationId}/messages?page=${page}&per_page=${pageSize}&sorts=${sorts}`
  )
}

export async function getAllMessages(conversationId: number) {
  const messages: Message[] = []
  let page = 1
  let response = await getMessages(conversationId, { page })
  messages.push(...response.data)
  while (response.data.length > 0) {
    page++
    response = await getMessages(conversationId, { page })
    messages.push(...response.data)
  }
  return messages
}

export async function createCompletion(conversationId: number, signal?: AbortSignal) {
  return Request.post(`chat/conversations/${conversationId}/completions`, [], {
    signal,
  })
}

export async function abortCompletion(conversationId: number, messageLength: number) {
  return Request.post(`chat/conversations/${conversationId}/completions:abort`, {
    abort_at_length: messageLength,
  })
}

export async function truncateConversation(conversationId: number) {
  return Request.post(`chat/conversations/${conversationId}:truncate`)
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
      const response = await createCompletion(this.conversationId, this.controller.signal)

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
