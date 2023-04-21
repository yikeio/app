import Head from "next/head"

import UserLayout from "./layout"

export default function UserOrdersPage() {
  return (
    <UserLayout>
      <Head>
        <title>我的订单</title>
        <meta
          name="description"
          content="Yike is a social media platform for sharing your thoughts and ideas."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="p-6">
        <h2>我的订单</h2>
      </section>
    </UserLayout>
  )
}
