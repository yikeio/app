import Head from "next/head"

import { Layout } from "@/components/layout"
import { RoleCard } from "@/components/role-card"
import { rolesList } from '@/constants/roles'

export default function Roles() {
  return (
    <Layout>
      <Head>
        <title>角色</title>
        <meta name="description" content="一刻AI助手" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="mx-auto max-w-5xl">
        <div className="flex-1 space-y-6 p-3 md:p-6">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">角色</div>
          </div>
          <div className="flex flex-col divide-y rounded-lg">
            <RoleCard />
          </div>
        </div>
      </section>
    </Layout>
  )
}
