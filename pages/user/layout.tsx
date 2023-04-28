"use client"

import Head from "@/components/head"
import { Layout } from "@/components/layout"
import SecondMenubar from "@/components/second-menubar"
import Sidebar from "./sidebar"

export default function UserLayout(props) {
  return (
    <Layout>
      <Head title="用户中心" />
      <SecondMenubar className="hidden lg:block">
        <Sidebar />
      </SecondMenubar>
      <main className="flex-1">{props.children}</main>
    </Layout>
  )
}
