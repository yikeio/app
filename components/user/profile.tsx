import { ReactNode } from "react"
import { User } from "@/api/users"
import { CopyIcon } from "lucide-react"

import { copyToClipboard, formatDatetime } from "@/lib/utils"
import { Button } from "../ui/button"
import { Card } from "../ui/card"
import UserReferralLink from "./referral-link"

const Item = ({ label, children, copiable = false }: { label: string; children: ReactNode; copiable?: boolean }) => {
  return (
    <div className="flex items-center gap-6">
      <label className="w-full max-w-[100px] text-right text-gray-400">{label}</label>
      <div className="flex flex-1 items-center">
        {children}
        {copiable && (
          <Button variant="link" size="sm" onClick={() => copyToClipboard(children as string)}>
            <CopyIcon size={12} />
          </Button>
        )}
      </div>
    </div>
  )
}

export default function UserProfile({ user }: { user: User }) {
  return (
    <Card className="flex flex-col gap-6 p-6">
      <Item label="ID" copiable>
        {user.id}
      </Item>
      <Item label="用户名">{user.name}</Item>
      <Item label="Email">{user.email || "无"}</Item>
      <Item label="手机号">{user.phone_number || "无"}</Item>
      <Item label="推荐人">{user.referrer?.name || "无"}</Item>
      <Item label="推荐码">
        <UserReferralLink user={user} />
      </Item>
      <Item label="注册时间">{formatDatetime(user.created_at)}</Item>
    </Card>
  )
}
