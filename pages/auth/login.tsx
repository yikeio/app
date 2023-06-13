import Login from "@/components/auth/login"

export default function LoginPage() {
  return (
    <div className="flex h-screen flex-1 items-center justify-center">
      <div className="max-w-xs flex-1 overflow-hidden rounded-lg border">
        <Login />
      </div>
    </div>
  )
}
