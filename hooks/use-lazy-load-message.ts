import { useLayoutEffect, useRef, useState } from "react"
import { BOT_HELLO, useChatStore } from "@/store"

// 懒加载消息列表
export const useLazyLoadMessage = () => {
  const chatBodyRef = useRef(null)
  const autoScrollBottomRef = useRef(true)
  const [isLoadingMessage, setIsLoadingMessage] = useState(false)

  const [
    session,
    messageHistoryPagerMap,
    getConversationHistory,
    updateCurrentSession,
  ] = useChatStore((state) => [
    state.currentSession(),
    state.messageHistoryPagerMap,
    state.getConversationHistory,
    state.updateCurrentSession,
  ])

  const pager = messageHistoryPagerMap.get(session.id)

  // 首次进入聊天界面，如果没有历史消息，发送欢迎语
  if (
    session.messages.length === 0 &&
    session.messages.at(0)?.content !== BOT_HELLO.content &&
    pager?.currentPage === pager?.lastPage
  ) {
    session.messages.push(BOT_HELLO)
  }

  // 懒加载聊天内容
  const onChatBodyScroll = async (e) => {
    if (e.currentTarget.scrollTop <= 0) {
      if (session.id === "-1" || !pager) return
      if (pager?.currentPage < pager?.lastPage) {
        const params = {
          page: pager.currentPage + 1,
          pageSize: pager.pageSize,
        }

        try {
          setIsLoadingMessage(true)
          // 加载列表时禁止滚动到底部
          autoScrollBottomRef.current = false
          const prevMessages = await getConversationHistory(session.id, params)
          updateCurrentSession((session) => {
            session.messages = [...prevMessages, ...session.messages]
          })
          chatBodyRef.current?.scrollTo({ top: 200 })
        } catch (e) {
        } finally {
          setIsLoadingMessage(false)
          autoScrollBottomRef.current = true
        }
      }
    }
  }

  // Auto scroll to bottom
  useLayoutEffect(() => {
    const observer = new MutationObserver(() => {
      if (!autoScrollBottomRef.current) return
      chatBodyRef.current.scrollTo?.(0, chatBodyRef.current.scrollHeight)
    })
    observer.observe(chatBodyRef.current, {
      attributes: true,
      childList: true,
      subtree: true,
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  return {
    chatBodyRef,
    autoScrollBottomRef,
    isLoadingMessage,
    onChatBodyScroll,
  }
}
