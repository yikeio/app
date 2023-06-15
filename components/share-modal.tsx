"use client"

import { useEffect, useState } from "react"
import { User } from "@/api/users"
import FacebookIcon from "@/icons/facebook.svg"
import TelegramIcon from "@/icons/telegram.svg"
import TwitterIcon from "@/icons/twitter.svg"
import { MailIcon, Share2Icon, XIcon } from "lucide-react"

import { cn, copyToClipboard } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"

export default function ShareModal({
  user = null,
  children = undefined,
  className = "",
}: {
  user?: User
  children?: React.ReactNode
  className?: string
}) {
  const title = "推荐一个不错的 AI 工具箱：一刻"
  const featureDescription = `推荐一个不错的 AI 工具箱：一刻，它可以帮你做很多事情，比如语言学习、文案写作、金融分析、写代码等数1000 种场景等。`
  const trigger = children || (
    <Button size="sm" className={cn("flex items-center gap-2", className)}>
      <Share2Icon size={16} />
      <span>分享一刻</span>
    </Button>
  )

  const [url, setUrl] = useState("")
  useEffect(() => {
    setUrl(user ? user.referral_url : window.location.origin)
  }, [user])

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent className="sm:max-w-xl">
        <AlertDialogHeader>
          <div className="flex items-start justify-between">
            <AlertDialogTitle>将一刻分享给你的朋友</AlertDialogTitle>
            <AlertDialogCancel className="h-6 w-6 p-1 text-3xl">
              <XIcon />
            </AlertDialogCancel>
          </div>
          <div className="flex flex-col gap-6">
            <div>
              一刻在成长过程中离不开大家的支持和助力。如果觉得一刻对你有帮助，请多多分享，将好的产品带给更多的朋友。🫡 💓
            </div>
            <div className="grid grid-cols-1 gap-2 text-sm md:grid-cols-4">
              <a
                href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(featureDescription + " " + url)}`}
                target="_blank"
                className="flex items-center gap-2 rounded border p-2 hover:bg-muted"
                rel="noreferrer"
                title="Twitter"
              >
                <TwitterIcon className="h-6 w-6" /> <span>Twitter</span>
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${url}`}
                target="_blank"
                className="flex items-center gap-2 rounded border p-2 hover:bg-muted"
                rel="noreferrer"
                title="Facebook"
              >
                <FacebookIcon className="h-6 w-6" /> <span>Facebook</span>
              </a>
              <a
                href={`https://t.me/share/url?url=${url}&text=${encodeURIComponent(featureDescription)}`}
                target="_blank"
                className="flex items-center gap-2 rounded border p-2 hover:bg-muted"
                rel="noreferrer"
                title="Telegram"
              >
                <TelegramIcon className="h-6 w-6" /> <span>Telegram</span>
              </a>
              <a
                href={`mailto:?subject=${title}&body=${encodeURIComponent(featureDescription + " " + url)}`}
                target="_blank"
                className="flex items-center gap-2 rounded border p-2 hover:bg-muted"
                rel="noreferrer"
                title="Email"
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary-500 p-1 text-white">
                  <MailIcon size={18} />
                </div>
                <span>Email</span>
              </a>
            </div>
            <div className="relative flex flex-col gap-2">
              <Textarea defaultValue={featureDescription + " " + url} className="pr-28" />
              <div className="right-0 top-0 flex h-full items-center justify-center p-0 md:absolute md:px-4">
                <Button className="w-full md:w-auto" onClick={() => copyToClipboard(featureDescription + " " + url)}>
                  复制
                </Button>
              </div>
            </div>
          </div>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  )
}
