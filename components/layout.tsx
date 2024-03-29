import { Navbar } from "@/components/navbar"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <div className="flex h-screen flex-col-reverse overflow-hidden lg:flex-row">
        <Navbar />
        <main className="flex-1 grow overflow-y-auto pb-28 lg:pb-0">{children}</main>
      </div>
    </>
  )
}
