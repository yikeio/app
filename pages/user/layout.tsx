import Head from "next/head"

import { Layout } from "@/components/layout"
import SecondMenubar from "@/components/second-menubar"
import { Sidebar } from "./sidebar"

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
        <Sidebar></Sidebar>
      </SecondMenubar>
      <main className="col-span-3 lg:col-span-5">{props.children}</main>
    </Layout>
  )
}
