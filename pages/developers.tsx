import useAuth from "@/hooks/use-auth"
import { useQueryState } from "@/hooks/use-query-state"

import GroupQrcode from "@/components/group-qrcode"
import Head from "@/components/head"
import { Layout } from "@/components/layout"
import { Markdown } from "@/components/markdown"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import UserTokens from "@/components/user/tokens"
import ApiContents from "../api/document.md"

export default function DevelopersPage() {
  const [tab, setTab] = useQueryState<string>("tab", { defaultValue: "documents" })
  const { user } = useAuth()

  const handleTabChanged = (tab: string) => {
    setTab(tab)
  }

  return (
    <Layout>
      <div className="p-8 flex flex-col gap-6">
        <Head title="开发者中心" />
        <h1 className="title-font text-forground mb-2 text-3xl font-medium sm:text-4xl">开发者中心</h1>
        <Tabs onValueChange={handleTabChanged} value={tab}>
          <TabsList className="bg-primary-50 dark:bg-muted">
            <TabsTrigger value="documents">
              <div className="flex items-center gap-1">
                <span>API 文档</span>
              </div>
            </TabsTrigger>
            <TabsTrigger value="tokens">
              <div className="flex items-center gap-1">
                <span>我的 tokens</span>
              </div>
            </TabsTrigger>
          </TabsList>
          <TabsContent value="documents">
            <div className="mt-6 markdown-body lg:max-w-3xl text-sm md:text-base prose prose-slate break-words before:hidden after:hidden dark:prose-invert prose-a:text-blue-600 prose-h4:text-slate-600">
              <Markdown>{ApiContents}</Markdown>

              <div className="mt-6 border-t p-6">
                <GroupQrcode />
              </div>
            </div>
          </TabsContent>
          <TabsContent value="tokens">
            <div className="mt-6">
              <UserTokens user={user} />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  )
}
