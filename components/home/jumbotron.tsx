import { useEffect, useRef } from "react"
import Link from "next/link"
import Typed from "typed.js"

export default function HomeJumbotron() {
  const el = useRef(null)
  useEffect(() => {
    const typed = new Typed(el.current, {
      strings: [
        "学习语言",
        "写小红书文案",
        "翻译各种文字",
        "写代码",
        "解决数学难题",
        "做营销规划",
        "回答医学问题",
        "总结归纳",
      ],
      startDelay: 300,
      typeSpeed: 100,
      backSpeed: 100,
      backDelay: 100,
      smartBackspace: true,
      loop: true,
      showCursor: true,
      cursorChar: "<span class='inline-block w-1 h-[1em] m-0 bg-primary dark:bg-primary-500 align-top ml-1'></span>",
    })

    // Destropying
    return () => {
      typed.destroy()
    }
  }, [])

  return (
    <div className="relative mx-auto flex max-w-5xl flex-col gap-10">
      <h1 className="mx-auto flex flex-col gap-4 text-3xl font-extrabold leading-none tracking-tight text-foreground md:text-5xl lg:flex-row lg:items-center lg:gap-0 lg:text-6xl ">
        <div>一刻，</div>
        <div className="flex items-center">
          <div>它可以帮你</div>
          <div className="inline-block min-w-[200px] text-left lg:min-w-[300px]">
            <span ref={el} className="text-primary-600 "></span>
          </div>
        </div>
      </h1>
      <p className="mx-auto max-w-3xl text-center text-lg text-muted-foreground">
        预置上千种场景，无论你有什么样的需求，在一刻，都可以找到答案。
      </p>
      <div className="flex items-center justify-center gap-6 lg:gap-12">
        <Link
          className="rounded-full border-2 border-primary-300 bg-primary-500 px-10 py-3 tracking-wider text-white hover:bg-primary-700"
          href="/prompts"
        >
          开始体验
        </Link>
        <Link
          className="rounded-full border-2 border-primary-300 bg-primary-500 px-10 py-3 tracking-wider text-white hover:bg-primary-700"
          href="#download"
        >
          立即下载
        </Link>
      </div>
    </div>
  )
}
