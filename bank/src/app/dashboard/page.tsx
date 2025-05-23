import AccountsStats from "@/components/accounts-stats";
import type { AccountStats } from "@/components/accounts-stats";
import AccountsTable from "@/components/accounts-table";
import TransactionsTable from "@/components/transaction-table";
import { Database } from "@/types/db";
import { isAuthenticated } from "@/utils/isAuthenticated";
import { fetchData } from "@/utils/fetch";
import PromoteAdminBtn from "@/components/promote-admin-btn";
import PaymentsTable from "@/components/payments-table";

type Account = Database["public"]["Tables"]["accounts"]["Row"];
type Transaction = Database["public"]["Tables"]["transactions"]["Row"];
type Payment = Database["public"]["Tables"]["payment_schedule"]["Row"];

export default async function DashboardPage() {
  await isAuthenticated();
  const stats = await fetchData<AccountStats>("/api/account/stats");
  const accounts = await fetchData<Account[]>("/api/account");
  const transactions = await fetchData<Transaction[]>(
    "/api/account/transactions",
  );
  const payments = await fetchData<Payment[]>("/api/payment");
  console.log(payments);
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your financial accounts and balances
        </p>
        <PromoteAdminBtn />
      </div>
      <AccountsStats stats={stats} />
      <AccountsTable accounts={accounts} />
      <TransactionsTable transactions={transactions} />
      <PaymentsTable payments={payments} />
    </div>
  );
}
