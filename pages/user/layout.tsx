import Head from "next/head"

import { Layout } from "@/components/layout"
import SecondMenubar from "@/components/second-menubar"
import Sidebar from "./sidebar"

export default function UserLayout(props) {
  return (
    <Layout>
      <Head>
        <title>用户中心</title>
        <meta
          name="description"
          content="Yike is a social media platform for sharing your thoughts and ideas."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SecondMenubar className="hidden lg:block">
        <Sidebar />
      </SecondMenubar>
      <main className="flex-1">{props.children}</main>
    </Layout>
  )
}
