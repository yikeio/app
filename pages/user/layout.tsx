"use client"

import { useRouter } from "next/router"
import { ChevronLeftIcon } from "lucide-react"

import Head from "@/components/head"
import { Layout } from "@/components/layout"
import SecondMenubar from "@/components/second-menubar"
import Sidebar from "./sidebar"

export default function UserLayout(props) {
  const router = useRouter()

  return (
    <Layout>
      <Head title="用户中心" />
      <SecondMenubar>
        <Sidebar />
      </SecondMenubar>
      <main className="h-screen flex-1 overflow-auto">
        <div className="flex h-12 items-center justify-between border-b bg-white px-4 md:hidden">
          <button
            className="flex items-center gap-1 p-2"
            title="返回"
            onClick={() => router.back()}
          >
            <ChevronLeftIcon size={22} />
          </button>
        </div>
        {props.children}
      </main>
    </Layout>
  )
}
