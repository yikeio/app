"use client"

import Link from "next/link"
import { useRouter } from "next/router"
import PromptApi from "@/api/prompts"
import { ArrowRightCircleIcon } from "lucide-react"
import useSWR from "swr"

import { Layout } from "@/components/layout"
import Loading from "@/components/loading"

export default function PromptPage() {
  const router = useRouter()
  const { data, error, mutate, isLoading } = useSWR(`prompts`, () =>
    PromptApi.list()
  )

  if (isLoading) {
    return <Loading className="min-h-screen" />
  }

  console.log(data)

  return (
    <Layout>
      <div className="flex flex-1 flex-col gap-6 p-6">
        <h1 className="text-xl">选择一个场景，点击开始对话</h1>
        <div className="grid flex-1 grid-cols-1 justify-center gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {data.data?.map((prompt) => (
            <Link
              href={`/chat?prompt=${prompt.id}`}
              className="group flex flex-col gap-6 rounded-xl border bg-primary-50 p-4 hover:bg-primary-100 hover:shadow-sm xl:p-6"
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
