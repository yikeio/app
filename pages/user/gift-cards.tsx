"use client"

import { useState } from "react"
import Link from "next/link"
import { activateGiftCard } from "@/api/gift-cards"
import { toast } from "react-hot-toast"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import UserLayout from "./layout"

export default function UserGiftCardsPage() {
  const [code, setCode] = useState("")

  const handleActivate = () => {
    activateGiftCard({ code }).then((res) => {
      toast.success("激活成功")
      setCode("")
    })
  }

  return (
    <UserLayout>
      <div className="p-8">
        <div className="mt-4">
          <h2>礼品卡</h2>
        </div>
        <div className="max-w-xl space-y-4 rounded-lg bg-white p-6 text-gray-600 shadow">
          <div>
            请输入礼品卡卡密以激活对应的额度，
            <br />
            卡密格式为：xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx。
            <br />
            激活后可以在{" "}
            <Link href="/user/payments" className="font-bold text-black">
              我的订单
            </Link>{" "}
            中查看激活记录。
          </div>
          <div className="flex items-center gap-4">
            <Input
              value={code}
              className="w-96 bg-white"
              onChange={(e) => setCode(e.target.value)}
              placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            />
            <Button disabled={code.length != 36} onClick={handleActivate}>
              激活
            </Button>
          </div>
        </div>
      </div>
    </UserLayout>
  )
}
