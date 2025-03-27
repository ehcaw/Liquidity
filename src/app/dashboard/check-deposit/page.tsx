import CheckDeposit from "@/components/check-deposit";
import { isAuthenticated } from "@/utils/isAuthenticated";

export default async function CheckDepositPage() {
  await isAuthenticated();
  return (
    <div className="size-fit mx-auto">
      <CheckDeposit />
    </div>
  );
}
