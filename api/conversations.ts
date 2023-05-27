import { API_DOMAIN, request } from "../lib/request"

/**
 * 获取会话列表
 * @returns
 */
export async function getConversationList(
  userId: string,
  options?: { page?: number; pageSize?: number; sorts?: string }
) {
  const { page = 1, pageSize = 15, sorts = "last_active_at" } = options || {}
  return request(
    `users/${userId}/chat/conversations?page=${page}&per_page=${pageSize}&sorts=${sorts}`
  )
}

/**
 * 创建新的话
 * @returns
 */
export async function createConversation(title: string) {
  return request("chat/conversations", {
    method: "POST",
    body: JSON.stringify({ title }),
  })
}

/**
 * 更新对话
 * @returns
 */
export async function updateConversation(
  conversationId: number,
  data: Record<string, any>
) {
  return request(`chat/conversations/${conversationId}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

/**
 * 删除对话
 * @returns
 */
export async function deleteConversation(conversationId: number) {
  return request(`chat/conversations/${conversationId}`, {
    method: "DELETE",
  })
}

/**
 * 用户创建会话对话
 * @returns
 */
export async function createMessage(conversationId: number, content: string) {
  return request(`chat/conversations/${conversationId}/messages`, {
    method: "POST",
    body: JSON.stringify({ content }),
  })
}

/**
 * 获取单个会话的消息列表
 * @returns
 */
export async function getConversationMessageList(
  conversationId: number,
  options?: { page?: number; pageSize?: number; sorts?: string }
) {
  const { page = 1, pageSize = 15, sorts = "id:desc" } = options || {}
  return request(
    `chat/conversations/${conversationId}/messages?page=${page}&per_page=${pageSize}&sorts=${sorts}`
  )
}
