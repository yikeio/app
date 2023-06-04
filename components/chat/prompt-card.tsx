import { Prompt } from "@/api/prompts"

export default function PromptCard({ prompt }: { prompt: Prompt }) {
  return (
    <div className="flex shrink-0 flex-col items-center gap-4">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary-50 text-5xl">
        {prompt.logo}
      </div>
      <div className="text-xl">{prompt.name}</div>
      <div className="flex flex-col gap-4">
        <div className="text-gray-500">{prompt.description}</div>
        <div className="text-center text-sm text-primary-500">使用人数： 59281 人</div>
      </div>
    </div>
  )
}
