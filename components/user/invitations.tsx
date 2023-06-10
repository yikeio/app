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
    <div className="flex flex-col gap-6">
      <Card className="rounded-lg border bg-white p-6 shadow-sm">
        <table className="my-0 w-full text-left text-sm text-gray-500 dark:text-gray-400">
          <thead className="text-sm font-bold uppercase text-gray-600 dark:text-gray-400">
            <tr>
              <td className="border-none">用户</td>
              <td className="border-none">注册时间</td>
            </tr>
          </thead>
          <tbody>
            {referrals.map((referral) => (
              <tr key={referral.id} className="border-t text-sm text-gray-500">
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
    </div>
  )
}
