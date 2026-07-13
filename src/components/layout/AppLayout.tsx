import { Outlet } from "react-router-dom"

import { Sidebar } from "./Sidebar"
import { MobileNav } from "./MobileNav"
import { TopBar } from "./TopBar"

export function AppLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <MobileNav />
      <div className="lg:pl-64">
        <TopBar />
        <main className="mx-auto w-full max-w-[1600px] px-4 py-6 sm:px-6 sm:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
