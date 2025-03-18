import AccountsStats from "@/components/accounts-stats";
import type { AccountStats } from "@/components/accounts-stats";
import TransactionsTable from "@/components/transaction-table";
import { Database } from "@/types/db";
import { verifyUserAccount } from "@/services/banking/account";
import { redirect } from "next/navigation";
import { isAuthenticated } from "@/utils/isAuthenticated";
import { fetchData } from "@/utils/fetch";
import  AccountHeader from "@/components/accounts-header";
import BalanceChart from "@/components/balance-chart";

type Transaction = Database["public"]["Tables"]["transactions"]["Row"];
type Account = Database["public"]["Tables"]["accounts"]["Row"];
type DailyBalance = Database["public"]["Functions"]["get_daily_balance"]["Returns"];

export default async function AccountPage({
  params,
}: {
  params: Promise<{ account_number: string }>;
}) {
  const { account_number } = await params;
  await isAuthenticated();
  try {
    await verifyUserAccount(account_number);
  } catch (error) {
    redirect(`/dashboard`);
  }
  const account = await fetchData<Account>(`/api/account/${account_number}`);
  const stats = await fetchData<AccountStats>(
    `/api/account/${account_number}/stats`,
  );
  const dailyBalance = await fetchData<DailyBalance>(
    `/api/account/${account_number}/daily-balance`,
  );
  const transactions = await fetchData<Transaction[]>(
    `/api/account/${account_number}/transactions`,
  );
  return (
    <div className="flex flex-col gap-6 p-6">
      <AccountHeader account={account} />
      <AccountsStats stats={stats} dailyBalance={dailyBalance} />
      <TransactionsTable transactions={transactions} />
    </div>
  );
}
