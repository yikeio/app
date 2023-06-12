import Image from "next/image"
import Link from "next/link"

export default function LogoButton() {
  return (
    <Link
      className="hidden h-full shrink-0 items-center justify-start gap-4 px-6 text-slate-700 hover:bg-primary-50 dark:text-slate-400 md:flex"
      href="/prompts"
    >
      <Image src="/logo.svg" height={24} width={24} alt="logo" />
      <div className="sr-only">一刻 AI</div>
    </Link>
  )
}
