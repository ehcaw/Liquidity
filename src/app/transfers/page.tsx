import TransferForm from "@/components/transfer-form"
import { Database } from "@/types/db";
import { fetchData } from "@/utils/fetch";
import { isAuthenticated } from "@/utils/isAuthenticated";

type Account = Database["public"]["Tables"]["accounts"]["Row"];

export default async function TransfersPage() {
  await isAuthenticated();
  const accounts = await fetchData<Account[]>('/api/account')
  return (
    <div className="container mx-auto max-w-3xl py-6">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold tracking-tight">Transfers</h1>
          <p className="text-muted-foreground">Schedule payments or create transfers between accounts</p>
        </div>

        <TransferForm accounts={accounts} />
      </div>
    </div>
  )
}

