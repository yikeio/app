import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import useAuth from "@/hooks/use-auth"
import { CheckIcon } from "lucide-react"

import Loading from "@/components/loading"

export default function OauthCallback() {
  const auth = useAuth()
  const query = useSearchParams()
  const [state, setState] = useState<"loading" | "success" | "error">("loading")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (query.has("code") && query.has("state")) {
      auth
        .handleOauthCallback(query.get("code") as string, query.get("state") as string)
        .then(() => {
          setState("success")
          window.location.replace("/prompts")
        })
        .catch((error) => {
          setError(error.message)
          console.error(error)
          setState("error")
        })
    }
  })

  return (
    <>
      <div className="flex h-screen items-center justify-center">
        <div className="mb-[20vh] flex w-[80vw] flex-col items-center justify-center gap-6 rounded-lg border bg-muted  p-6 text-foreground shadow md:w-[50vw]">
          {state === "loading" && (
            <>
              <div>登录中...</div>
              <Loading />
            </>
          )}
          {state === "error" && (
            <>
              <div>登录失败</div>
              <code className="text-xs text-red-400">{error?.substring(0, 500)}</code>
            </>
          )}
          {state === "success" && (
            <>
              <div>登录成功</div>
              <div className="flex items-center justify-center rounded-full bg-green-600 p-2 text-white">
                <CheckIcon size={18} />
              </div>
              <div>正在跳转...</div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
