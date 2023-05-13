import { rolesList } from "@/constants/roles"

import Head from "@/components/head"
import { Layout } from "@/components/layout"
import { RoleCard } from "@/components/role-card"

export default function Roles() {
  return (
    <Layout>
      <Head title="角色" />
      <div className="flex-1">
        <section className="mx-auto max-w-5xl p-8">
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold">角色</div>
          </div>
          <div className="mt-4 flex-1 space-y-6 rounded-lg bg-white p-3 shadow md:p-6">
            <div className="flex flex-col divide-y rounded-lg"></div>
          </div>
        </section>
      </div>
    </Layout>
  )
}
