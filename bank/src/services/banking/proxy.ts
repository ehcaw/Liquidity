import { createClient } from "@/utils/supabase/server";
import { getUserAccount } from "./account";
import { ClientError, ServerError } from "@/utils/exceptions";
import { createTransaction } from "./transaction";

export async function deposit(
  account_number: string,
  amount: number,
  create_transaction: boolean = true,
) {
  const supabase = await createClient();
  const account = await getUserAccount(account_number);

  const { data, error } = await supabase
    .from("accounts")
    .update({
      balance: account.balance + amount,
    })
    .eq("account_number", account_number)
    .select();

  if (error) {
    throw new ServerError(error.message);
  }

  if (!create_transaction) {
    return null;
  }
  return await createTransaction(
    data[0].id,
    data[0].balance,
    amount,
    "Deposit",
    `Deposited $${amount} into ${account.name}`,
  );
}

export async function withdraw(
  account_number: string,
  amount: number,
  create_transaction: boolean = true,
) {
  const supabase = await createClient();
  const account = await getUserAccount(account_number);

  if (account.balance < amount) {
    throw new ClientError("Insufficient funds", 400);
  }

  const { data, error } = await supabase
    .from("accounts")
    .update({
      balance: account.balance - amount,
    })
    .eq("account_number", account_number)
    .select();

  if (error) {
    throw new ServerError(error.message);
  }

  if (!create_transaction) {
    return null;
  }
  return await createTransaction(
    data[0].id,
    data[0].balance,
    amount * -1,
    "Withdrawal",
    `Withdrew $${amount} from ${account.name}`,
  );
}
