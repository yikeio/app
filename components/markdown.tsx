import ReactMarkdown from "react-markdown"

import "katex/dist/katex.min.css"
import { RefObject, useEffect, useRef, useState } from "react"
import { copyToClipboard } from "@/utils"
import RehypeHighlight from "rehype-highlight"
import RehypeKatex from "rehype-katex"
import RemarkBreaks from "remark-breaks"
import RemarkGfm from "remark-gfm"
import RemarkMath from "remark-math"

export function PreCode(props: { children: any }) {
  const ref = useRef<HTMLPreElement>(null)

  return (
    <pre ref={ref}>
      <span
        className="copy-code-button"
        onClick={() => {
          if (ref.current) {
            const code = ref.current.innerText
            copyToClipboard(code)
          }
        }}
      ></span>
      {props.children}
    </pre>
  )
}

const useLazyLoad = (ref: RefObject<Element>): boolean => {
  const [isIntersecting, setIntersecting] = useState<boolean>(false)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIntersecting(true)
        observer.disconnect()
      }
    })

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [ref])

  return isIntersecting
}

export function Markdown(props: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[RemarkMath, RemarkGfm, RemarkBreaks]}
      rehypePlugins={[
        RehypeKatex,
        [RehypeHighlight, { detect: true, ignoreMissing: true }],
      ]}
      components={{
        pre: PreCode,
      }}
    >
      {props.content}
    </ReactMarkdown>
  )
}
