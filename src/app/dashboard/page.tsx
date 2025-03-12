import AccountsStats from "@/components/accounts-stats";
import { AccountsTable } from "@/components/accounts-table";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your financial accounts and balances
        </p>
      </div>
      <AccountsStats />
      <AccountsTable />
    </div>
  );
}
