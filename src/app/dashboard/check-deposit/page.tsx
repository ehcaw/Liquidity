import CheckDeposit from "@/components/check-deposit";
import { isAuthenticated } from "@/utils/isAuthenticated";
import { ClientError, ServerError } from "@/utils/exceptions";

export default async function CheckDepositPage() {
  await isAuthenticated();
  return <CheckDeposit />;
}
