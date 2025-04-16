import DepositForm from "@/components/deposit-form";
import TransferForm from "@/components/transfer-form";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import WithdrawForm from "@/components/withdraw-form";
import { Database } from "@/types/db";
import { fetchData } from "@/utils/fetch";
import { isAuthenticated } from "@/utils/isAuthenticated";

type Account = Database["public"]["Tables"]["accounts"]["Row"];

export default async function TransfersPage() {
  await isAuthenticated();
  const accounts = await fetchData<Account[]>("/api/account?status=active");
  return (
    <div className="container mx-auto max-w-3xl py-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Transactions</h1>
          <p className="text-muted-foreground">
            Transfer, deposit, and withdraw money between accounts
          </p>
        </div>
        <Tabs defaultValue="transfer">
          <TabsList>
            <TabsTrigger value="transfer">Transfer</TabsTrigger>
            <TabsTrigger value="deposit">Deposit</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
          </TabsList>
          <TabsContent value="transfer">
            <TransferForm accounts={accounts} />
          </TabsContent>
          <TabsContent value="deposit">
            <DepositForm accounts={accounts} />
          </TabsContent>
          <TabsContent value="withdraw">
            <WithdrawForm accounts={accounts} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
