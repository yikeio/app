import Head from "next/head"
import Link from "next/link"

import { Layout } from "@/components/layout"
import { buttonVariants } from "@/components/ui/button"

export default function IndexPage() {
  return (
    <Layout>
      <Head>
        <title>Yike</title>
        <meta
          name="description"
          content="Yike is a social media platform for sharing your thoughts and ideas."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <section className="">
          <h2>FAQ</h2>
      </section>
    </Layout>
  )
}
