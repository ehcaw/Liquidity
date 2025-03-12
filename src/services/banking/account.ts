import { ServerError } from "@/utils/exceptions";
import { createClient } from "@/utils/supabase/server";
import { getAuthUser } from "@/services/auth/auth";
import { Database } from "@/types/db";

type AccountType = Database["public"]["Enums"]["account_type_enum"];

async function createAccountNumber() {
  const supabase = await createClient();
  let accountNumber: string;
  let isUnique = false;

  do {
    accountNumber = Math.floor(
      100000000000 + Math.random() * 900000000000,
    ).toString();

    const { data, error: selectError } = await supabase
      .from("accounts")
      .select()
      .eq("account_number", accountNumber);
    if (selectError) {
      throw new ServerError(selectError.message);
    }

    isUnique = data.length === 0;
  } while (!isUnique);

  return accountNumber;
}

export async function getUserAccounts() {
  const supabase = await createClient();
  const authUser = await getAuthUser();

  const { data, error: selectError } = await supabase
    .from("accounts")
    .select()
    .eq("user_id", authUser.id);
  if (selectError) {
    throw new ServerError(selectError.message);
  }

  return data;
}

export async function createAccount(name: string, accountType: AccountType) {
  const supabase = await createClient();
  const authUser = await getAuthUser();

  const accountNumber = await createAccountNumber();
  const { data, error: insertError } = await supabase
    .from("accounts")
    .insert({
      account_number: accountNumber,
      name: name,
      account_type: accountType,
      status: "Active",
      user_id: authUser.id,
    })
    .select();

  if (insertError) {
    throw new ServerError(insertError.message);
  }

  return data[0];
}

export async function getAllAccountStats() {
  const supabase = await createClient();
  const authUser = await getAuthUser();

  const { data: balance, error: balanceError } = await supabase.rpc(
    "get_total_balance",
    { uid: authUser.id },
  );
  if (balanceError) {
    throw new ServerError(balanceError.message);
  }

  const { data: change, error: changeError } = await supabase.rpc(
    "get_balance_change",
    { uid: authUser.id },
  );
  if (changeError) {
    throw new ServerError(changeError.message);
  }

  return { ...change, total_balance: balance };
}
