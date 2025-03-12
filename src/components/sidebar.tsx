"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CreditCard,
  DollarSign,
  Home,
  PieChart,
  Settings,
  User,
} from "lucide-react";

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="hidden border-r bg-background md:block md:w-64">
      <div className="flex h-full flex-col">
        <div className="border-b px-6 py-4">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 font-semibold"
          >
            <DollarSign className="h-6 w-6" />
            <span>BankApp</span>
          </Link>
        </div>
        <div className="flex-1 overflow-auto py-2">
          <nav className="grid items-start px-4 text-sm font-medium">
            <Link
              href="/dashboard"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive("/dashboard")
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
            >
              <Home className="h-4 w-4" />
              Dashboard
            </Link>
            <Link
              href="/accounts"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${pathname.startsWith("/account")
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
            >
              <CreditCard className="h-4 w-4" />
              Accounts
            </Link>
            <Link
              href="/transactions"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive("/transactions")
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
            >
              <PieChart className="h-4 w-4" />
              Transactions
            </Link>
            <Link
              href="/profile"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive("/profile")
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
            >
              <User className="h-4 w-4" />
              Profile
            </Link>
            <Link
              href="/settings"
              className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all ${isActive("/settings")
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
            >
              <Settings className="h-4 w-4" />
              Settings
            </Link>
          </nav>
        </div>
        <div className="border-t p-4">
          <div className="flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="h-8 w-8 rounded-full bg-muted"></div>
            <div>
              <p className="text-sm font-medium">John Doe</p>
              <p className="text-xs text-muted-foreground">
                john.doe@example.com
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
