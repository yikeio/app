import { useRef } from "react"
import { Copy } from "lucide-react"
import ReactMarkdown from "react-markdown"
import RehypeHighlight from "rehype-highlight"
import RehypeKatex from "rehype-katex"
import RemarkBreaks from "remark-breaks"
import RemarkGfm from "remark-gfm"
import RemarkMath from "remark-math"

import { copyToClipboard } from "@/lib/utils"

export function PreCode(props: { children: any }) {
  const ref = useRef<HTMLPreElement>(null)

  return (
    <pre ref={ref} className="group relative">
      <span
        title="复制"
        className="absolute right-0 m-2 hidden rotate-[270deg] cursor-pointer rounded bg-slate-700/50 p-2 text-xs text-gray-300 hover:bg-slate-600 group-hover:block"
        onClick={() => {
          if (ref.current) {
            const code = ref.current.innerText
            copyToClipboard(code)
          }
        }}
      >
        <Copy size={16} />
      </span>
      {props.children}
    </pre>
  )
}

export function Markdown({ children: contents }) {
  return (
    <ReactMarkdown
      remarkPlugins={[RemarkMath, RemarkGfm, RemarkBreaks]}
      rehypePlugins={[RehypeKatex, [RehypeHighlight, { detect: true, ignoreMissing: true }]]}
      components={{
        pre: PreCode,
        table({ children }) {
          return (
            <table className="border-collapse border border-primary-300 px-3 py-1 dark:border-white">{children}</table>
          )
        },
        th({ children }) {
          return (
            <th className="break-words border border-primary-300 bg-primary-400 px-3 py-1 text-white dark:border-white">
              {children}
            </th>
          )
        },
        td({ children }) {
          return <td className="break-words border border-primary-300 px-3 py-1 dark:border-white">{children}</td>
        },
      }}
    >
      {contents}
    </ReactMarkdown>
  )
}
