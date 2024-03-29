"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import PromptApi, { Prompt, TabType } from "@/api/prompts"
import { Tag } from "@/api/tags"
import useAuth from "@/hooks/use-auth"
import useDefaultPage from "@/hooks/use-default-page"
import useLocalStorage from "@/hooks/use-localstorage"
import { useQueryState } from "@/hooks/use-query-state"
import { ArrowRightCircleIcon, BadgeCheckIcon, BotIcon, FlagIcon, FlameIcon } from "lucide-react"

import EmptyState from "@/components/empty-state"
import { Layout } from "@/components/layout"
import Loading from "@/components/loading"
import TagsSelector from "@/components/tags-selector"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import WelcomeModal from "@/components/user/welcome-modal"

export default function PromptPage() {
  const { user } = useAuth()
  const [selectedTagIds, setSelectedTagIds] = useQueryState<Array<string | number>>("tag")
  const [tab, setTab] = useLocalStorage<TabType>("prompts.selected.tab", "featured")
  const [prompts, setPrompts] = useState<{ all: Prompt[]; featured: Prompt[]; mine: Prompt[] }>({
    all: [],
    featured: [],
    mine: [],
  })
  const [isLoading, setIsLoading] = useState(false)
  const { setDefaultPage } = useDefaultPage()

  const loadPrompts = useCallback(async () => {
    setIsLoading(true)
    const { data } = await PromptApi.tab(tab, { tag: selectedTagIds })
    setPrompts((prompts) => ({ ...prompts, [tab]: data }))
    setIsLoading(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedTagIds, tab])

  const handleTabChanged = (tab: TabType) => {
    setTab(tab)
  }

  const handleTagSelected = (values: Tag[]) => {
    setSelectedTagIds(values.map((v) => v.id))
  }

  useEffect(() => {
    loadPrompts()
  }, [loadPrompts, selectedTagIds, tab])

  useEffect(() => {
    setDefaultPage("/prompts")
  }, [tab])

  return (
    <Layout>
      {user && <WelcomeModal user={user} />}
      <div className="flex flex-col">
        <div className="flex flex-col items-center gap-8 border-b p-6 xl:flex-row">
          <h1 className="text-xl">选择一个场景，开始探索</h1>
          <Tabs onValueChange={handleTabChanged} value={tab}>
            <TabsList className="bg-primary-50 dark:bg-muted">
              <TabsTrigger value="featured">
                <div className="flex items-center gap-1">
                  <BadgeCheckIcon size={14} className="text-primary-500" />
                  <span>推荐场景</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="all">
                <div className="flex items-center gap-1">
                  <BotIcon size={14} className="text-primary-500" />
                  <span>全部场景</span>
                </div>
              </TabsTrigger>
              <TabsTrigger value="mine">
                <div className="flex items-center gap-1">
                  <FlagIcon size={14} className="text-primary-500" />
                  <span>我的场景</span>
                </div>
              </TabsTrigger>
            </TabsList>
          </Tabs>
          {isLoading && <Loading className="h-10 w-10" />}

          <TagsSelector
            value={selectedTagIds}
            className="hidden xl:inline-flex ml-auto"
            onValueChange={handleTagSelected}
            showCount={6}
          />
        </div>
        {prompts[tab].length <= 0 && <EmptyState className="flex-1 py-20" message="暂无相关场景" />}
        {prompts[tab].length > 0 && (
          <div className="grid flex-1 auto-rows-min grid-cols-1 justify-center gap-6 p-6 md:grid-cols-3 xl:grid-cols-4">
            {prompts[tab].map((prompt) => (
              <Link
                href={`/chat?prompt_id=${prompt.id}`}
                className="group flex justify-between gap-2 rounded-xl border bg-muted p-4 hover:bg-secondary-50 hover:shadow-sm dark:border-primary-600/30 dark:bg-muted dark:hover:border-primary-600 md:flex-col md:justify-start lg:gap-4 xl:p-6"
                key={prompt.id}
              >
                <div className="flex items-center justify-between">
                  <div className="truncate">{prompt.name}</div>
                  <div className="hidden text-muted-foreground opacity-50 md:flex">
                    <ArrowRightCircleIcon size={24} strokeWidth={1.5} />
                  </div>
                </div>
                <div className="flex items-center gap-6 md:items-end md:justify-between">
                  <div className="flex items-end gap-1 text-muted-foreground">
                    <FlameIcon size={16} /> <span className="text-xs leading-none">{prompt.conversations_count}</span>
                  </div>
                  <span className="text-xl group-hover:scale-110 md:-mb-2 lg:text-4xl xl:text-5xl">
                    {prompt.logo || "🤖"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  )
}
