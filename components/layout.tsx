import { Navbar } from "@/components/navbar"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col-reverse md:flex-row">
      <Navbar />
      <main className="h-screen flex-1 grow overflow-y-auto bg-white pb-24 md:pb-0">
        {children}
      </main>
    </div>
  )
}
