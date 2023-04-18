import { API_DOMAIN, commonFetch } from "./common"

/**
 * 获取会话列表
 * @returns
 */
export async function getConversationList(
  user: string,
  options?: { page?: number; pageSize?: number; sorts?: string }
) {
  const { page = 1, pageSize = 15, sorts = "last_active_at" } = options || {}
  return commonFetch(
    `users/${user}/chat/conversations?page=${page}&per_page=${pageSize}&sorts=${sorts}`
  )
}

/**
 * 创建新的话
 * @returns
 */
export async function createConversation(title: string) {
  return commonFetch("chat/conversations", {
    method: "POST",
    body: JSON.stringify({ title }),
  })
}

/**
 * 更新对话
 * @returns
 */
export async function updateConversation(
  id: string,
  data: Record<string, any>
) {
  return commonFetch(`chat/conversations/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })
}

/**
 * 删除对话
 * @returns
 */
export async function deleteConversation(id: string) {
  return commonFetch(`chat/conversations/${id}`, {
    method: "DELETE",
  })
}

/**
 * 用户创建会话对话
 * @returns
 */
export async function createMessage(conversation: string, content: string) {
  return commonFetch(`chat/conversations/${conversation}/messages`, {
    method: "POST",
    body: JSON.stringify({ content }),
  })
}

/**
 * 创建智能对话
 * @returns
 */
export async function createSmartMessage(conversationId: string) {
  const token = localStorage.getItem("login_token")

  return fetch(
    `${API_DOMAIN}/api/chat/conversations/${conversationId}/completions`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  )
}

/**
 * 获取单个会话的消息列表
 * @returns
 */
export async function getConversationMessageList(
  conversation: string,
  options?: { page?: number; pageSize?: number; sorts?: string }
) {
  const { page = 1, pageSize = 15, sorts = "id:desc" } = options || {}
  return commonFetch(
    `chat/conversations/${conversation}/messages?page=${page}&per_page=${pageSize}&sorts=${sorts}`
  )
}
