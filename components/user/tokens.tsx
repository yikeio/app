import { useState } from "react"
import { createToken, getTokens, revokeToken } from "@/api/auth"
import { User } from "@/api/users"
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@radix-ui/react-alert-dialog"
import { PlusIcon } from "@radix-ui/react-icons"
import useSWR from "swr"

import { copyToClipboard, formatDatetime } from "@/lib/utils"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import EmptyState from "../empty-state"
import Loading from "../loading"
import { Textarea } from "../ui/textarea"

export default function UserTokens({ user }: { user: User }) {
  const [pageIndex, setPageIndex] = useState(1)
  const [name, setName] = useState("API")
  const [formVisible, setFormVisible] = useState(false)
  const [newToken, setNewToken] = useState<object | null>()
  const {
    data: tokens,
    isLoading,
    mutate,
  } = useSWR(["/auth/tokens", pageIndex], ([_, page]) => {
    return getTokens(page || 1)
  })

  if ((isLoading && pageIndex === 0) || !tokens) {
    return <Loading />
  }

  const handleRevoke = async (id: string) => {
    await revokeToken(id)
    mutate()
  }

  const handleCreate = async () => {
    const token = await createToken(name)

    setNewToken(token)
    setFormVisible(false)
    mutate()
  }

  // const handlePurge = async () => {
  //   await purgeTokens()
  //   mutate()
  // }

  const handleCopyNewToken = () => {
    copyToClipboard(newToken?.["value"] || "")
    setNewToken(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col lg:flex-row lg:items-center gap-6 justify-between">
        <div className="text-muted-foreground">以下是您的 API tokens, 这些 tokens 可以用于访问 API。</div>
        <div className="flex items-center gap-6">
          <Dialog open={formVisible} onOpenChange={setFormVisible}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <PlusIcon /> 新建 token
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>创建新的 API token</DialogTitle>
                <DialogDescription>请输入一个名称，用于标识这个 token 的用途。</DialogDescription>
              </DialogHeader>
              <div className="my-3">
                <Input id="name" value={name} className="w-full" onChange={(e) => setName(e.target.value)} />
              </div>
              <DialogFooter className="flex flex-col gap-2 md:flex-row">
                <Button variant="secondary" onClick={() => setFormVisible(false)}>
                  取消
                </Button>
                <Button onClick={handleCreate}>提交</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <AlertDialog open={!!newToken} onOpenChange={() => setNewToken(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="font-bold">新 Token 已创建</AlertDialogTitle>
                <AlertDialogDescription>
                  请复制下面的 Token 值，因为这是您唯一一次看到它的机会。
                  <div className="my-3">
                    <Textarea value={newToken?.["value"]}></Textarea>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex flex-col gap-2 md:flex-row">
                <AlertDialogAction>
                  <Button size="sm" onClick={handleCopyNewToken}>
                    复制并关闭
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          {/* <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                清除全部
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle className="font-bold">确定?</AlertDialogTitle>
                <AlertDialogDescription>
                  确认清除所有 token？包括当前会话的 token 也会被清除。您可能需要重新登录。
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter className="flex flex-col gap-2 md:flex-row">
                <AlertDialogCancel>
                  <Button variant="secondary" size="sm">
                    我再想想
                  </Button>
                </AlertDialogCancel>
                <AlertDialogAction>
                  <Button size="sm" onClick={handlePurge}>
                    确认清除
                  </Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog> */}
        </div>
      </div>
      <Card className="text-muted-forground overflow-x-auto rounded-lg border p-6 shadow-sm">
        <table className="my-0 w-full min-w-max text-left text-sm">
          <thead className="text-sm font-bold uppercase">
            <tr>
              <td className="border-none px-4 py-3">名称</td>
              <td className="border-none px-4 py-3">过期时间</td>
              <td className="border-none px-4 py-3 w-28">操作</td>
            </tr>
          </thead>
          <tbody>
            {tokens.map((token) => (
              <tr key={token.id} className="border-t text-sm">
                <td className="border-none px-4 py-3">{token.name.replace("[API]", "")}</td>
                <td className="border-none px-4 py-3">{formatDatetime(token.expires_at)}</td>
                <td className="border-none px-4 py-3">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        删除
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle className="font-bold">确定?</AlertDialogTitle>
                        <AlertDialogDescription>确认删除此 Token 吗？此操作不可逆。</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter className="flex flex-col gap-2 md:flex-row">
                        <AlertDialogCancel>
                          <Button variant="secondary" size="sm">
                            我再想想
                          </Button>
                        </AlertDialogCancel>
                        <AlertDialogAction>
                          <Button size="sm" onClick={() => handleRevoke(token.id)}>
                            确认删除
                          </Button>
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {pageIndex === 1 && tokens.length <= 0 && <EmptyState className="min-h-[100px]" />}
        <div className="mt-6 flex items-center gap-6">
          {pageIndex > 1 && (
            <Button variant="outline" onClick={() => setPageIndex(pageIndex - 1)}>
              上一页
            </Button>
          )}
          {tokens.total > 0 && tokens.last_page > pageIndex && (
            <Button variant="outline" onClick={() => setPageIndex(pageIndex + 1)}>
              下一页
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}
