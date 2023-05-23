"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { CreditCard, Gift, UserCog } from "lucide-react"

import { cn } from "@/lib/utils"
import Menu from "@/components/menu"

const menus = [
  { icon: UserCog, label: "个人资料", href: "/user#hide-nav" },
  { icon: Gift, label: "我的邀请", href: "/user/invitations#hide-nav" },
  { icon: CreditCard, label: "我的订单", href: "/user/payments#hide-nav" },
  { icon: Gift, label: "礼品卡", href: "/user/gift-cards#hide-nav" },
]

export default function Sidebar({ className = "" }) {
  return (
    <div className={cn("pb-12", className)}>
      <div className="flex flex-col gap-2 space-y-4">
        <div>
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            个人中心
          </h2>
          <div className="space-y-1">
            <Menu menus={menus}></Menu>
          </div>
        </div>
      </div>
    </div>
  )
}
