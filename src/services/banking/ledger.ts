import { createClient } from "@/utils/supabase/server";
import { getAuthUser } from "@/services/auth/auth";
import { Database } from "@/types/db";

type Transaction = Database["public"]["Tables"]["transactions"]["Row"];
export async function createLedgerEntry(transaction: Transaction) {
  await getAuthUser();
  const supabase = await createClient();

  const { error } = await supabase.from("ledger").insert({
    amount: transaction.amount,
    description: transaction.description,
    balance: transaction.balance,
    transaction_id: transaction.id,
    account_id: transaction.account_id,
    entry_category: transaction.amount >= 0 ? "Credit" : "Debit",
  });

  if (error) {
    throw new Error(error.message);
  }
}
