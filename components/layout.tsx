import { Sidebar } from "@/components/sidebar"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex">
      <Sidebar />
      <main className="flex min-h-screen flex-1 grow overflow-y-auto bg-slate-100">
        {children}
      </main>
    </div>
  )
}
