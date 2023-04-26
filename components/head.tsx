import NextHead from "next/head"

export default function Head({ title = "" }) {
  return (
    <NextHead>
      <title>{title.length ? title + " - " : ""}一刻 AI 助手</title>
      <meta
        name="description"
        content="一刻 AI 助手是一个基于 AI 的智能助手，可以帮助你更好的管理你的生活。"
      />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link
        rel="apple-touch-icon"
        sizes="180x180"
        href="/apple-touch-icon.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="32x32"
        href="/favicon-32x32.png"
      />
      <link
        rel="icon"
        type="image/png"
        sizes="16x16"
        href="/favicon-16x16.png"
      />
      <link rel="manifest" href="/manifest.json" />
    </NextHead>
  )
}
