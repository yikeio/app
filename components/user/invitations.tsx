import UserApi, { User } from "@/api/users"
import useSWR from "swr"

import { formatDatetime } from "@/lib/utils"
import EmptyState from "../empty-state"
import Loading from "../loading"
import { Card } from "../ui/card"
import UserCell from "./cell"

export default function UserInvitations({ user }: { user: User }) {
  const { data: referrals, isLoading } = useSWR("/api/users:referrals", UserApi.getReferrals)

  if (isLoading) {
    return <Loading />
  }

  return (
    <Card className="text-muted-forground overflow-x-auto rounded-lg border p-6 shadow-sm">
      <table className="my-0 w-full min-w-max text-left text-sm">
        <thead className="text-sm font-bold uppercase">
          <tr>
            <td className="border-none">用户</td>
            <td className="border-none">注册时间</td>
          </tr>
        </thead>
        <tbody>
          {referrals.map((referral) => (
            <tr key={referral.id} className="border-t text-sm">
              <td className="border-none px-4 py-3">
                <UserCell user={referral} />
              </td>
              <td className="border-none px-4 py-3">{formatDatetime(referral.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {referrals.length <= 0 && <EmptyState className="min-h-[100px]" />}
    </Card>
  )
}
