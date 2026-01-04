"use client"

import type { ReactNode } from "react"
import { useRouter, usePathname } from "next/navigation"
import { LayoutDashboard, Receipt, PiggyBank, Target, CreditCard, Calendar, FileText, LogOut, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"
import { VisuallyHidden } from "@/components/ui/visually-hidden"
import { useState } from "react"

interface LayoutProps {
  children: ReactNode
}

const navItems = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Transactions", href: "/transactions", icon: Receipt },
  { name: "Budgets", href: "/budgets", icon: PiggyBank },
  { name: "Savings Goals", href: "/savings-goals", icon: Target },
  { name: "Debt Tracking", href: "/debt-tracking", icon: CreditCard },
  { name: "Subscriptions", href: "/subscriptions", icon: Calendar },
  { name: "Yearly Report", href: "/yearly-report", icon: FileText },
]

export function Layout({ children }: LayoutProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated")
    router.push("/login")
  }

  const NavContent = () => (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="p-6 border-b border-border flex items-center justify-center space-x-3 flex-shrink-0">
        <img src="/myfit.png" alt="MyFinanceTracker Logo" className="w-12 h-12" />
        <h2 className="text-xl font-bold text-foreground">MyFinanceTracker</h2>
      </div>

      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Button
              key={item.name}
              variant={isActive ? "default" : "ghost"}
              className={`w-full justify-start ${isActive ? "" : "text-muted-foreground hover:text-foreground"}`}
              onClick={() => {
                router.push(item.href)
                setMobileOpen(false)
              }}
            >
              <Icon className="mr-3 h-4 w-4" />
              {item.name}
            </Button>
          )
        })}
      </nav>

      <div className="p-4 border-t border-border flex-shrink-0">
        <Button
          variant="ghost"
          className="w-full justify-start text-danger hover:text-danger hover:bg-danger/10"
          onClick={handleLogout}
        >
          <LogOut className="mr-3 h-4 w-4" />
          Logout
        </Button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50 flex items-center px-4">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-64">
            <VisuallyHidden>
              <SheetTitle>Navigation Menu</SheetTitle>
            </VisuallyHidden>
            <NavContent />
          </SheetContent>
        </Sheet>
        <img src="/myfit.png" alt="MyFinanceTracker Logo" className="ml-4 w-8 h-8" />
        <h1 className="font-bold text-lg">MyFinanceTracker</h1>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col">
        <div className="flex-1 flex flex-col min-h-0 bg-card border-r border-border">
          <NavContent />
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:pl-64">
        <main className="pt-20 lg:pt-8 p-4 lg:p-8">{children}</main>
      </div>
    </div>
  )
}
