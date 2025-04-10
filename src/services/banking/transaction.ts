import { ClientError, ServerError } from "@/utils/exceptions";
import { createClient } from "@/utils/supabase/server";
import { getAuthUser } from "@/services/auth/auth";
import { transferFunds } from "./account";
import { Database } from "@/types/db";
import { deposit, getUserAccount, withdraw } from "@/services/banking/account";
import { createLedgerEntry } from "./ledger";

type TransactionType =
  Database["public"]["Tables"]["transactions"]["Row"]["transaction_type"];

export async function getAllTransactions() {
  const authUser = await getAuthUser();
  // const supabase = createClient(
  //   process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  // );
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_user_transactions", {
    uid: authUser.id,
  });

  if (error) {
    throw new ServerError(error.message);
  }

  return data;
}

export async function checkCheckExistence(
  check_id: string,
  name: string,
  amount: number,
  date: string,
) {
  // const supabase = createClient(
  //   process.env.NEXT_PUBLIC_SUPABASE_URL || "",
  //   process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "",
  // );
  const supabase = await createClient();
  const { data: idBased, error } = await supabase
    .schema("public")
    .from("inserted_checks")
    .select("*")
    .eq("id", check_id)
    .single();

  const { data: informationBased } = await supabase
    .from("inserted_checks")
    .select()
    .eq("check_name", name)
    .eq("amount", amount)
    .eq("check_date", date);
  if (idBased == null && informationBased == null) {
    return false;
  }
  return true;
}

export async function depositFundsService(
  accountNumber: string,
  amount: number,
): Promise<{ success: boolean; error?: string }> {
  if (amount <= 0) {
    throw new ServerError("Deposit amount must be positive.");
  }
  const supabase = await createClient();
  const { error } = await supabase.rpc("deposit_funds", {
    p_account_number: accountNumber,
    p_amount: amount,
  });

  if (error) {
    console.error("Supabase deposit_funds RPC error:", error);
    // Improve error message based on actual DB error if possible
    return { success: false, error: "Error depositing funds" };
  }
  console.log(
    `Service: Successfully deposited ${amount} to ${accountNumber} via RPC.`,
  );
  return { success: true };
}

export async function insertCheck(
  name: string,
  amount: number,
  date: string,
  check_id?: string,
) {
  const supabase = await createClient();
  try {
    const { error } = await supabase
      .schema("public")
      .from("inserted_checks")
      .insert({
        id: check_id || `name:${name}/amount:${amount}/date${date}`,
        check_name: name,
        amount: amount,
        check_date: date,
      });
    if (error) {
      throw new ServerError(error.message);
    }
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
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

  const { data, error } = await supabase
    .from("transactions")
    .insert({
      account_id,
      amount,
      description,
      transaction_type: type,
      balance,
    })
    .select();

  if (error) {
    throw new ServerError(error.message);
  }

  await createLedgerEntry(data[0]);

  return data[0];
}
