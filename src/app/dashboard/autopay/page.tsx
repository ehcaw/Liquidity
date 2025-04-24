import { isAuthenticated } from "@/utils/isAuthenticated";
import { fetchData } from "@/utils/fetch";
import { Database } from "@/types/db";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import AutopaymentList from "@/components/autopayment-list";

type Account = Database["public"]["Tables"]["accounts"]["Row"];
type PaymentSchedule = Database["public"]["Tables"]["payment_schedule"]["Row"] & {
  accounts: Pick<Account, "account_number" | "name" | "account_type">;
};

export default async function AutopayPage() {
  // Ensure user is authenticated
  await isAuthenticated();
  
  // Fetch active accounts for creating new auto-payments
  const accounts = await fetchData<Account[]>("/api/account?status=active");
  
  // Fetch existing auto-payments
  const schedules = await fetchData<PaymentSchedule[]>("/api/autopay");
  
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Auto-Payments</h1>
          <Link href="/dashboard/autopay/create">
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              New Auto-Payment
            </Button>
          </Link>
        </div>
        <p className="text-muted-foreground">
          Manage your recurring weekly payments
        </p>
      </div>
      
      <AutopaymentList schedules={schedules} />
    </div>
  );
}