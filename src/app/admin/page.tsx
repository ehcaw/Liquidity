import { DashboardLayout } from "@/components/admin-dash-layout";
import { fetchData } from "@/utils/fetch";
import { Database } from "@/types/db";

type Transaction = Database["public"]["Tables"]["transactions"]["Row"];
type Account = Database["public"]["Tables"]["accounts"]["Row"];
type User = Database["public"]["Tables"]["users"]["Row"];

type OverviewData = {
  balance: number;
  activeAccounts: number;
  pendingTransactions: number;
  newAccounts: number;
  totalTransactions: number;
  recentTransactions: Transaction[];
};

export default async function AdminPage() {
  const [
    balance,
    activeAccounts,
    pendingTransactions,
    newAccounts,
    totalTransactions,
    recentTransactions
  ] = await Promise.all([
    fetchData<number>('/api/admin/bank/stats/bank_balance'),
    fetchData<number>('/api/admin/bank/stats/active_accounts'),
    fetchData<number>('/api/admin/bank/stats/pending_transactions'),
    fetchData<number>('/api/admin/bank/stats/new_accounts'),
    fetchData<number>('/api/admin/bank/stats/total_transactions'),
    fetchData<Transaction[]>('/api/admin/bank/stats/recent_transactions')
  ]);

  // Structure into OverviewData type
  const overviewData: OverviewData = {
    balance,
    activeAccounts,
    pendingTransactions,
    newAccounts,
    totalTransactions,
    recentTransactions
  };

  const [
    transactionsData,
    accountsData,
    usersData,
  ] = await Promise.all([
    fetchData<Transaction[]>('/api/admin/bank/stats/all_transactions'),
    fetchData<Account[]>('/api/admin/bank/stats/all_accounts'),
    fetchData<User[]>('/api/admin/bank/stats/all_users')
  ]);

  return (
    <DashboardLayout 
      overviewData={overviewData}
      transactionsData={transactionsData}
      accountsData={accountsData}
      usersData={usersData}
    />
  );
}