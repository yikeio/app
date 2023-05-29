import { Navbar } from "@/components/navbar"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col-reverse lg:flex-row">
      <Navbar />
      <main className="h-screen flex-1 grow overflow-y-auto bg-white pb-28 lg:pb-0">{children}</main>
    </div>
  )
}
