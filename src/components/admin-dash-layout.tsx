"use client"
import { DashboardSidebar } from "@/components/admin-dash-sidebar"
import { ReactNode, useState } from "react"
import { Database } from "@/types/db"
import { DashboardOverview } from "@/components/admin-dash-overview"
import { TransactionsTable } from "@/components/admin-transactions"
import { AccountsTable } from "@/components/admin-accounts"
import { UsersTable } from "@/components/admin-users"

type Transaction = Database["public"]["Tables"]["transactions"]["Row"];
type Account = Database["public"]["Tables"]["accounts"]["Row"];
type User = Database["public"]["Tables"]["users"]["Row"];

interface DashboardLayoutProps {
    overviewData: {
      balance: number;
      activeAccounts: number;
      pendingTransactions: number;
      newAccounts: number;
      totalTransactions: number;
      recentTransactions: Transaction[];
    };
    transactionsData: Transaction[];
    accountsData: Account[];
    usersData: User[];
    children?: ReactNode;
}

export function DashboardLayout({ 
  overviewData, 
  transactionsData,
  accountsData,
  usersData 
}: DashboardLayoutProps) {
    const [activeTab, setActiveTab] = useState("overview")
    
    return (
        <DashboardSidebar activeTab={activeTab} setActiveTab={setActiveTab}>
            {activeTab === "overview" && <DashboardOverview data={overviewData} />}
            {activeTab === "transactions" && <TransactionsTable data={transactionsData} />}
            {activeTab === "accounts" && <AccountsTable data={accountsData} />}
            {activeTab === "users" && <UsersTable data={usersData} />}
        </DashboardSidebar>
    )
}