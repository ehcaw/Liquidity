import CheckDeposit from "@/components/check-deposit";
import { isAuthenticated } from "@/utils/isAuthenticated";
import { fetchData } from "@/utils/fetch";
import { Database } from "@/types/db";

type Account = Database["public"]["Tables"]["accounts"]["Row"];

export default async function CheckDepositPage() {
  const accounts = await fetchData<Account[]>("/api/account?status=active");
  await isAuthenticated();
  return (
    <div
      className="
        w-full              // Full width on mobile
        p-4                 // Base padding
        md:p-6             // More padding on medium screens
        flex
        flex-col           // Stack vertically on mobile
        md:flex-row        // Side by side on medium screens
        gap-4
        items-center
      "
    >
      <CheckDeposit accounts={accounts} />
    </div>
  );
}
