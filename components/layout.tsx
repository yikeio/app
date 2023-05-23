import { Sidebar } from "@/components/sidebar"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col-reverse md:flex-row">
      <Sidebar />
      <main className="flex h-screen flex-1 grow overflow-y-auto bg-slate-100">
        {children}
      </main>
    </div>
  )
}
