import { useState } from "react"
import UserApi, { User } from "@/api/users"
import useAuth from "@/hooks/use-auth"
import { toast } from "react-hot-toast"

import { Button } from "../ui/button"
import { Input } from "../ui/input"
import UserAvatar from "./avatar"
import UserAvatarPicker from "./avatar-picker"

export default function UserForm({ user, onSaved = () => null }: { user: User; onSaved: () => void }) {
  const [name, setName] = useState<string>(user.name)
  const [avatar, setAvatar] = useState<string>(user.avatar || "")
  const { refreshAuthUser } = useAuth()

  const handleSave = async () => {
    await UserApi.update({ name, avatar })
    refreshAuthUser()
    onSaved()
    toast.success("已更新")
  }

  return (
    <div className="flex flex-col gap-4">
      <h3>更新资料</h3>
      <div className="flex flex-col gap-2">
        <label className="block text-sm font-medium text-gray-700">用户名</label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <label className="block text-sm font-medium text-gray-700">头像</label>
        <div className="flex items-center gap-4">
          <UserAvatar url={avatar} name={name} className="h-20 w-20" />
        </div>
        <div>
          <UserAvatarPicker onSelected={setAvatar}>
            <Button variant="outline" size="sm">
              更换头像
            </Button>
          </UserAvatarPicker>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Button
          className="w-full"
          onClick={handleSave}
          disabled={name.trim().length <= 0 || avatar?.trim().length <= 0}
        >
          提交更新
        </Button>
      </div>
    </div>
  )
}
