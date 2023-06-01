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

export async function createCompletion(conversationId: number) {
  return Request.post(`chat/conversations/${conversationId}/completions`, {
    method: "POST",
  })
}

export async function truncateConversation(conversationId: number) {
  return Request.post(`chat/conversations/${conversationId}:truncate`)
}

export async function waitConversationResponse(
  conversationId: number,
  options: {
    onStreaming: (message: string, done: boolean) => void
    onError?: (response) => void
    timeout?: number
  }
) {
  const { onStreaming, onError = () => {}, timeout = 10000 } = options

  let responseText = ""

  const response = await createCompletion(conversationId)

  if (!response.ok) {
    console.error("Stream Error", response.body)
    onError(response)
  }

  const reader = response.body?.getReader()
  const decoder = new TextDecoder()
  let done = false

  const timeoutId = setTimeout(() => done || onStreaming(undefined, true), timeout)

  clearTimeout(timeoutId)

  while (!done) {
    const content = await reader?.read()

    const text = decoder.decode(content?.value)

    responseText += text

    done = !content || content.done

    onStreaming(responseText, done)
  }
}
