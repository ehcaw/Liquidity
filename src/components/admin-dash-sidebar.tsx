import { useState } from "react"

import {
    BarChart3,
    CreditCard,
    Landmark,
    LayoutDashboard,
    LogOut,
    PieChart,
    Users,
    User,
  } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

interface DashboardSidebarProps {
    children: React.ReactNode
    activeTab: string
    setActiveTab: (tab: string) => void
  }

  export function DashboardSidebar({ children, activeTab, setActiveTab }: DashboardSidebarProps) {

    const [isSidebarOpen, setIsSidebarOpen] = useState(true)

    const navItems = [
        { id: "overview", label: "Overview", icon: LayoutDashboard },
        { id: "accounts", label: "Accounts", icon: CreditCard },
        { id: "transactions", label: "Transactions", icon: BarChart3 },
        { id: "users", label: "Users", icon: Users },
        { id: "reports", label: "Reports", icon: PieChart },
    ]
    
    return (
        <div className="flex h-screen overflow-hidden bg-background">
        {/* Sidebar */}
        <aside
            className={`${
            isSidebarOpen ? "w-64" : "w-20"
            } bg-slate-900 text-white transition-all duration-300 ease-in-out flex flex-col`}
        >
        <div className="flex items-center h-16 px-4 border-b border-slate-800">
          <div className={`flex items-center ${isSidebarOpen ? "justify-between w-full" : "justify-center"}`}>
            {isSidebarOpen && (
              <div className="flex items-center gap-2">
                <Landmark className="h-6 w-6" />
                <span className="font-bold text-lg">Liquidity Admin</span>
              </div>
            )}
            {!isSidebarOpen && <Landmark className="h-6 w-6" />}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="text-slate-400 hover:text-white hover:bg-slate-800"
            >
              {isSidebarOpen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-chevrons-left"
                >
                  <path d="m11 17-5-5 5-5" />
                  <path d="m18 17-5-5 5-5" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-chevrons-right"
                >
                  <path d="m6 17 5-5-5-5" />
                  <path d="m13 17 5-5-5-5" />
                </svg>
              )}
            </Button>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-2">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center w-full ${
                    isSidebarOpen ? "justify-start px-4" : "justify-center"
                  } py-2 rounded-md ${
                    activeTab === item.id
                      ? "bg-slate-800 text-white"
                      : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  {isSidebarOpen && <span className="ml-3">{item.label}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <button
            className={`flex items-center ${
              isSidebarOpen ? "justify-start w-full" : "justify-center"
            } text-slate-400 hover:text-white`}
          >
            <LogOut className="h-5 w-5" />
            {isSidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b bg-white flex items-center justify-between px-6">
          {/*
          <div className="flex items-center w-full max-w-md">
            <Search className="h-4 w-4 text-muted-foreground absolute ml-3" />
            <Input placeholder="Search..." className="pl-9 w-full max-w-md bg-slate-50" />
          </div>
          */}
          <div className="flex-1"></div>
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-9 w-9 rounded-full">
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6 bg-slate-50">{children}</main>
      </div>
    </div>
    )

  }