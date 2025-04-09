import { ClientError, ServerError } from "@/utils/exceptions";
import { createClient } from "@/utils/supabase/server";
import { getAuthUser } from "@/services/auth/auth";
import { Database } from "@/types/db";
import { deposit, getUserAccount, withdraw } from "@/services/banking/account";
import { createLedgerEntry } from "./ledger";

type TransactionType =
  Database["public"]["Tables"]["transactions"]["Row"]["transaction_type"];

export async function getAllTransactions() {
  const authUser = await getAuthUser();
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_user_transactions", {
    uid: authUser.id,
  });

  if (error) {
    throw new ServerError(error.message);
  }

  return data;
}

export async function createTransaction(
  account_id: number,
  balance: number,
  amount: number,
  type: TransactionType,
  description: string,
) {
  await getAuthUser();
  const supabase = await createClient();
  console.log(account_id, balance, amount, type, description);

  const { data, error } = await supabase.from("transactions").insert({
    account_id,
    amount,
    description,
    transaction_type: type,
    balance
  }).select();

  if (error) {
    throw new ServerError(error.message);
  }

  await createLedgerEntry(data[0])

  return data[0];
}
