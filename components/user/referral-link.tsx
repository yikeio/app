import { User } from "@/api/users"

import { copyToClipboard } from "@/lib/utils"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

export default function UserReferralLink({ user }: { user: User }) {
  const referUrl = user.referral_code ? `${window?.location.origin}/?referrer=${user.referral_code}` : null

  return (
    <div className="inline-flex items-center gap-2">
      <Input
        type="text"
        className="w-64 border-primary-300 bg-primary-200/60 px-3 py-1"
        value={referUrl}
        onClick={(e) => (e.target as HTMLInputElement).select()}
      />
      <Button className="block" onClick={() => copyToClipboard(referUrl)}>
        复制
      </Button>
    </div>
  )
}
