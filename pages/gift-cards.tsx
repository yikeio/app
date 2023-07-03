"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import GiftCardApi from "@/api/gift-cards"
import { toast } from "react-hot-toast"

import { Layout } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function UserGiftCardsPage() {
  const [code, setCode] = useState("")

  const handleActivate = () => {
    GiftCardApi.activate(code).then((res) => {
      toast.success("激活成功")
      setCode("")
    })
  }

  useEffect(() => {
    if (code.length > 36) {
      setCode(code.slice(0, 36))
    }
  }, [code])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const code = params.get("code")
    if (code) {
      setCode(code.trim())
    }
  }, [])

  return (
    <Layout>
      <div className="flex h-full flex-col items-center justify-center gap-6 p-4 md:p-8">
        <div className="mt-4">
          <h2>礼品卡激活</h2>
        </div>
        <div className="max-w-xl space-y-4 rounded-lg border bg-white p-6 text-gray-600 shadow-sm">
          <div>
            请输入礼品卡卡密以激活对应的额度，
            <br />
            卡密格式为：<code>12345678-9012-3456-7890-123456789012。</code>
            <br />
            激活后可以在{" "}
            <Link href="/user?tab=payments" className="font-bold text-black">
              我的订单
            </Link>{" "}
            中查看激活记录。
          </div>
          <div className="flex flex-col items-center gap-4 md:flex-row">
            <Input
              value={code}
              className="w-96 max-w-full"
              onChange={(e) => setCode(e.target.value)}
              placeholder="12345678-9012-3456-7890-123456789012"
            />
            <Button disabled={code.length != 36} onClick={handleActivate} className="w-full md:w-auto">
              激活
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
