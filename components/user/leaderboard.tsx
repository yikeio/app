import { useEffect, useState } from "react"
import UserApi from "@/api/users"
import useAuth from "@/hooks/use-auth"

import EmptyState from "../empty-state"
import UserCell from "./cell"

export default function UserLeaderboard() {
  const [leaderboards, setLeaderboards] = useState([])
  const { user } = useAuth()

  useEffect(() => {
    if (!user) {
      return
    }
    UserApi.getLeaderboards().then((res) => {
      setLeaderboards(res)
    })
  }, [user])

  return (
    <>
      <table className="my-0 w-full min-w-max text-left text-sm">
        <thead className="text-sm font-bold uppercase ">
          <tr>
            <td className="w-20 border-none">排名</td>
            <td className="border-none px-4 py-3">用户</td>
            <td className="border-none px-4 py-3">已邀请用户数</td>
          </tr>
        </thead>
        <tbody>
          {leaderboards.map((user, i) => (
            <tr key={user.id} className="border-t text-sm ">
              <td className="border-none">{i + 1}</td>
              <td className="border-none px-4 py-3">
                <UserCell user={user} />
              </td>
              <td className="border-none px-4 py-3">{user.referrals_count}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {leaderboards.length <= 0 && <EmptyState className="min-h-[100px]" />}
      {leaderboards.length >= 100 && <div className="text-sm text-muted-foreground">* 仅显示榜单前 100 名用户</div>}
    </>
  )
}
