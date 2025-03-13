import AccountsStats from "@/components/accounts-stats";
import { AccountsTable } from "@/components/accounts-table";
import Link from "next/link";
import { Button } from "@/components/ui/button"; 
export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your financial accounts and balances
        </p>
      </div>
      <div className="flex justify-end">
        <Link href="/transfers">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
            Schedule Payment / Create Transfer
          </button>
        </Link>
      </div>
      <AccountsStats />
      <AccountsTable />
    </div>
  );
}