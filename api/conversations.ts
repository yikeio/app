import { API_DOMAIN, request } from "../lib/request"

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
  id: number
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

export async function getConversations(options?: { page?: number; pageSize?: number; sorts?: string }) {
  const { page = 1, pageSize = 15, sorts = "last_active_at" } = options || {}
  return request(`chat/conversations?page=${page}&per_page=${pageSize}&sorts=${sorts}`)
}

export async function getConversation(conversationId: number): Promise<Conversation> {
  return request(`chat/conversations/${conversationId}`)
}

export async function createConversation(title: string = ""): Promise<Conversation> {
  return request("chat/conversations", {
    method: "POST",
    body: JSON.stringify({ title }),
  })
}

export async function updateConversation(conversationId: number, data: Partial<Conversation>): Promise<Conversation> {
  return request(`chat/conversations/${conversationId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

export async function deleteConversation(conversationId: number): Promise<undefined> {
  return request(`chat/conversations/${conversationId}`, {
    method: "DELETE",
  })
}

export async function createMessage(conversationId: number, data: Partial<Message>) {
  return request(`chat/conversations/${conversationId}/messages`, {
    method: "POST",
    body: JSON.stringify(data),
  })
}

export async function getMessages(
  conversationId: number,
  options?: { page?: number; pageSize?: number; sorts?: string }
) {
  const { page = 1, pageSize = 15, sorts = "id:desc" } = options || {}
  return request(`chat/conversations/${conversationId}/messages?page=${page}&per_page=${pageSize}&sorts=${sorts}`)
}

export async function createCompletion(conversationId: number, messageId: number) {
  return request(`chat/conversations/${conversationId}/completions`, {
    method: "POST",
    body: JSON.stringify({ message_id: messageId }),
  })
}
