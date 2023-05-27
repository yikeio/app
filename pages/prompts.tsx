"use client"

import Link from "next/link"
import { useRouter } from "next/router"
import PromptApi from "@/api/prompts"
import useLocalStorage from "@/hooks/use-localstorage"
import {
  ArrowRightCircleIcon,
  BadgeCheckIcon,
  BotIcon,
  FlagIcon,
} from "lucide-react"
import useSWR from "swr"

import { Layout } from "@/components/layout"
import Loading from "@/components/loading"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function PromptPage() {
  const { data, isLoading } = useSWR(`prompts`, () => PromptApi.list())
  const [tab, setTab] = useLocalStorage("prompts.selected.tab", "recommend")

  const handleTabChanged = (tab: string) => {
    setTab(tab)
  }

  if (isLoading) {
    return <Loading className="min-h-screen" />
  }

  return (
    <Layout>
      <div className="flex flex-1 flex-col gap-6">
        <div className="flex items-center gap-8 border-b  p-6">
          <h1 className="text-xl">选择一个场景，点击开始对话</h1>
          <Tabs onValueChange={handleTabChanged} value={tab}>
            <TabsList>
              <TabsTrigger value="recommend">
                <div className="flex items-center gap-1">
                  <BadgeCheckIcon size={14} />
                  <span>推荐场景</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="all">
                <div className="flex items-center gap-1">
                  <BotIcon size={14} />
                  <span>全部场景</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="my">
                <div className="flex items-center gap-1">
                  <FlagIcon size={14} />
                  <span>我的场景</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
        <div className="grid flex-1 grid-cols-1 justify-center gap-6 p-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.data?.map((prompt) => (
            <Link
              href={`/chat?prompt_id=${prompt.id}`}
              className="group flex flex-col gap-6 rounded-xl border border-primary-200 bg-primary-50 p-4 hover:bg-primary-100 hover:shadow-sm xl:p-6"
              key={prompt.id}
            >
              <div className="flex items-center justify-between">
                <div className="">{prompt.name}</div>
                <div className="text-gray-400">
                  <ArrowRightCircleIcon size={24} strokeWidth={1.5} />
                </div>
              </div>
              <div className="flex items-center justify-between">
                <small className="text-gray-400">12354 人</small>
                <span className="text-4xl group-hover:scale-110 xl:text-5xl">
                  {prompt.logo || "🤖"}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  )
}
