"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import PromptApi, { Prompt } from "@/api/prompts"
import useAuth from "@/hooks/use-auth"
import { isMobileScreen, isScreenSizeAbove } from "@/utils"
import { PanelRightIcon, ShareIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Chat } from "@/components/chat/chat"
import BackButton from "@/components/head/back-button"
import LogoButton from "@/components/head/logo-button"
import Loading from "@/components/loading"
import { Button } from "@/components/ui/button"

export default function ChatPage() {
  const router = useRouter()
  const [prompt, setPrompt] = useState<Prompt>(null)
  const { hasLogged, user, redirectToLogin } = useAuth()
  const [showSidebar, setShowSidebar] = useState(false)

  const handleToggleSidebar = () => {
    setShowSidebar(!showSidebar)
  }

  useEffect(() => {
    setShowSidebar(isScreenSizeAbove("md"))

    if (!hasLogged) {
      redirectToLogin()
    }

    if (router.query.prompt_id) {
      PromptApi.get(router.query.prompt_id as string).then((res) => {
        setPrompt(res)
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasLogged, router])

  if (!hasLogged || !user) {
    return <Loading className="min-h-screen" />
  }

  return (
    <main className="relative flex h-screen flex-1 justify-start overflow-y-auto overflow-x-hidden">
      <div
        className={cn(
          "flex h-screen w-[100vw] shrink-0 flex-col border-r lg:ml-0 lg:flex-1",
          {
            "-ml-72": showSidebar,
          }
        )}
      >
        <header className="flex shrink-0 items-center justify-between overflow-hidden border-b bg-white">
          <LogoButton />
          <div className="flex flex-1 gap-6 border-l p-2 md:p-4">
            <div className="flex flex-1 items-center gap-2 md:gap-4">
              <BackButton />
              <div className="max-w-[45vw] truncate text-lg ">
                {prompt?.name || "loading..."}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2 text-gray-500">
              {hasLogged && (
                <>
                  <Button
                    variant="outline"
                    className="flex h-8 w-8 items-center justify-center p-1 hover:bg-primary-100"
                  >
                    <ShareIcon className="h-4 w-4" />
                  </Button>

                  <Button
                    variant="outline"
                    className={cn(
                      "flex h-8 w-8 items-center justify-center p-1 hover:bg-primary-100",
                      {
                        "border-primary-300 bg-primary-100":
                          isMobileScreen() && showSidebar,
                      }
                    )}
                    title="打开/关闭边栏"
                    onClick={handleToggleSidebar}
                  >
                    <PanelRightIcon className="h-4 w-4" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </header>
        <Chat />
      </div>
      <div
        className={cn(
          "mr-0 w-72 shrink-0 p-6 text-gray-700 transition-all delay-75",
          {
            "-mr-72": !showSidebar,
          }
        )}
      >
        {prompt && (
          <div className="flex flex-col items-center gap-6 py-6">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-50 text-5xl">
              {prompt.logo}
            </div>
            <div className="text-xl">{prompt.name}</div>
            <div className="text-gray-500">{prompt.description}</div>
            <div className="text-gray-500">使用人数： 59281 人</div>
          </div>
        )}
      </div>
    </main>
  )
}
