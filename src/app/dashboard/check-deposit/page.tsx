import CheckDeposit from "@/components/check-deposit";
import { isAuthenticated } from "@/utils/isAuthenticated";
import { fetchData } from "@/utils/fetch";
import { Database } from "@/types/db";

type Account = Database["public"]["Tables"]["accounts"]["Row"];

export default async function CheckDepositPage() {
  const accounts = await fetchData<Account[]>("/api/account");
  await isAuthenticated();
  return <CheckDeposit accounts={accounts} />;
}
