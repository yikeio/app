import { createMessage, createSmartMessage } from "../api/conversations"

const TIME_OUT_MS = 30000

export async function requestChatStream(
  content: string,
  options: {
    conversationId: string
    onMessage: (message: string, done: boolean) => void
    onError: (error: Error, statusCode?: number) => void
    onController?: (controller: AbortController) => void
  }
) {
  const controller = new AbortController()
  const reqTimeoutId = setTimeout(() => controller.abort(), TIME_OUT_MS)

  try {
    await createMessage(options.conversationId, content)
    const res = await createSmartMessage(options.conversationId)
    clearTimeout(reqTimeoutId)

    let responseText = ""

    const finish = () => {
      options?.onMessage(responseText, true)
      controller.abort()
    }

    if (res.ok) {
      const reader = res.body?.getReader()
      const decoder = new TextDecoder()

      options?.onController?.(controller)

      while (true) {
        // handle time out, will stop if no response in 10 secs
        const resTimeoutId = setTimeout(() => finish(), TIME_OUT_MS)
        const content = await reader?.read()
        clearTimeout(resTimeoutId)
        const text = decoder.decode(content?.value)
        responseText += text

        const done = !content || content.done
        options?.onMessage(responseText, false)
        ControllerPool.isStreaming = true

        if (done) {
          break
        }
      }

      finish()
      ControllerPool.isStreaming = false
    } else {
      console.error("Stream Error", res.body)
      options?.onError(new Error("Stream Error"), res.status)
    }
  } catch (err) {
    ControllerPool.isStreaming = false
    console.error("NetWork Error", err)
    options?.onError(err as Error)
  }
}

// To store message streaming controller
export const ControllerPool = {
  isStreaming: false,
  controllers: {} as Record<string, AbortController>,

  addController(
    sessionIndex: number,
    messageIndex: number,
    controller: AbortController
  ) {
    const key = this.key(sessionIndex, messageIndex)
    this.controllers[key] = controller
    return key
  },

  stop(sessionIndex: number, messageIndex: number) {
    const key = this.key(sessionIndex, messageIndex)
    const controller = this.controllers[key]
    console.log(controller)
    controller?.abort()
  },

  remove(sessionIndex: number, messageIndex: number) {
    const key = this.key(sessionIndex, messageIndex)
    delete this.controllers[key]
  },

  key(sessionIndex: number, messageIndex: number) {
    return `${sessionIndex},${messageIndex}`
  },
}
