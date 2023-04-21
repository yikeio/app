import Head from "next/head"

import UserLayout from "./layout"

export default function UserIndexPage() {
  return (
    <UserLayout>
      <Head>
        <title>用户中心</title>
        <meta
          name="description"
          content="Yike is a social media platform for sharing your thoughts and ideas."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="p-6">
        <h2>个人资料</h2>
      </section>
    </UserLayout>
  )
}
