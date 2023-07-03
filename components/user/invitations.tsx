import { useState } from "react"
import UserApi, { User } from "@/api/users"
import useSWR from "swr"

import { formatDatetime } from "@/lib/utils"
import EmptyState from "../empty-state"
import Loading from "../loading"
import { Button } from "../ui/button"
import { Card } from "../ui/card"
import UserCell from "./cell"

export default function UserInvitations({ user }: { user: User }) {
  const [pageIndex, setPageIndex] = useState(1)
  const { data: referrals, isLoading } = useSWR(["/api/users:referrals", pageIndex], ([_, page]) => {
    return UserApi.getReferrals(page || 1)
  })

  if ((isLoading && pageIndex === 0) || !referrals) {
    return <Loading />
  }

  return (
    <Card className="text-muted-forground overflow-x-auto rounded-lg border p-6 shadow-sm">
      <table className="my-0 w-full min-w-max text-left text-sm">
        <thead className="text-sm font-bold uppercase">
          <tr>
            <td className="border-none px-4 py-3">用户</td>
            <td className="border-none px-4 py-3">注册时间</td>
          </tr>
        </thead>
        <tbody>
          {referrals.data.map((referral) => (
            <tr key={referral.id} className="border-t text-sm">
              <td className="border-none px-4 py-3">
                <UserCell user={referral} />
              </td>
              <td className="border-none px-4 py-3">{formatDatetime(referral.created_at)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {pageIndex === 1 && referrals.length <= 0 && <EmptyState className="min-h-[100px]" />}
      <div className="mt-6 flex items-center gap-6">
        {pageIndex > 1 && (
          <Button variant="outline" onClick={() => setPageIndex(pageIndex - 1)}>
            上一页
          </Button>
        )}
        {referrals.total > 0 && referrals.last_page > pageIndex && (
          <Button variant="outline" onClick={() => setPageIndex(pageIndex + 1)}>
            下一页
          </Button>
        )}
      </div>
    </Card>
  )
}
