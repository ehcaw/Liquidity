import { ClientError, ServerError } from "@/utils/exceptions";
import { createClient } from "@/utils/supabase/server";
import { getAuthUser } from "@/services/auth/auth";
import { Database } from "@/types/db";
import { createTransaction } from "@/services/banking/transaction";

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

export async function getUserAccount(account_number: string) {
  const supabase = await createClient();
  await getAuthUser();

  const { data, error: selectError } = await supabase
    .from("accounts")
    .select()
    .eq("account_number", account_number)
    .single();
  if (selectError) {
    throw new ServerError(selectError.message);
  }
  if (!data) {
    throw new ClientError("Account not found", 404);
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

export async function getAccountStats(account_number: string) {
  const supabase = await createClient();
  const authUser = await getAuthUser();

  const { data: balance, error: balanceError } = await supabase
    .from("accounts")
    .select("balance")
    .eq("account_number", account_number)
    .eq("user_id", authUser.id);
  if (balanceError) {
    throw new ServerError(balanceError.message);
  }
  if (balance.length === 0) {
    throw new ClientError("Account not found", 404);
  }

  const { data: change, error: changeError } = await supabase.rpc(
    "get_account_balance_change",
    { an: account_number },
  );
  if (changeError) {
    throw new ServerError(changeError.message);
  }

  return { ...change, total_balance: balance[0].balance };
}

export async function getAccountTransactions(account_number: string) {
  const supabase = await createClient();
  await getAuthUser();

  const { data, error } = await supabase.rpc("get_account_transactions", {
    an: account_number,
  });

  if (error) {
    throw new ServerError(error.message);
  }

  return data;
}

export async function getAccountDailyBalance(account_number: string) {
  const supabase = await createClient();
  await getAuthUser();
  const account = await getUserAccount(account_number);

  const { data, error } = await supabase.rpc("get_daily_balance", {
    aid: account.id,
  });

  if (error) {
    throw new ServerError(error.message);
  }

  return data;
}

export async function verifyUserAccount(account_number: string) {
  const authUser = await getAuthUser();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("accounts")
    .select()
    .eq("account_number", account_number)
    .eq("user_id", authUser.id);
  if (error || !data.length) {
    throw new ClientError(error?.message || "Account not found", 404);
  }
}

export async function transferFunds(
  to_account_number: string,
  amount: number,
  from_account_number?: string,
) {
  const supabase = await createClient();
  const { error } = await supabase.rpc("transfer_funds", {
    p_from_account: from_account_number || "",
    p_to_account: to_account_number,
    p_amount: amount,
  });
  if (error) throw new ClientError(`Transfer failed: ${error.message}`, 400);
export async function deposit(account_number: string, amount: number, create_transaction: boolean = true) {
  const supabase = await createClient();
  const authUser = await getAuthUser();
  const account = await getUserAccount(account_number);

  const { data, error } = await supabase.from("accounts").update({
    balance: account.balance + amount,
  }).eq("account_number", account_number).eq("user_id", authUser.id).select();

  if (error) {
    throw new ServerError(error.message);
  }

  if (!create_transaction) {
    return null;
  }
  return await createTransaction(data[0].id, data[0].balance, amount, "Deposit", `Deposited $${amount} into ${account.name}`);
}

export async function withdraw(account_number: string, amount: number, create_transaction: boolean = true) {
  const supabase = await createClient();
  const authUser = await getAuthUser();
  const account = await getUserAccount(account_number);

  if (account.balance < amount) {
    throw new ClientError("Insufficient funds", 400);
  }

  const { data, error } = await supabase.from("accounts").update({
    balance: account.balance - amount,
  }).eq("account_number", account_number).eq("user_id", authUser.id).select();

  if (error) {
    throw new ServerError(error.message);
  }

  if (!create_transaction) {
    return null;
  }
  return await createTransaction(data[0].id, data[0].balance, amount*-1, "Withdrawal", `Withdrew $${amount} from ${account.name}`);
}

export async function transfer(src_account_number: string, dest_account_number: string, amount: number, create_transaction: boolean = true) {
  await getAuthUser();
  const src_account = await getUserAccount(src_account_number);
  const dest_account = await getUserAccount(dest_account_number);

  await withdraw(src_account_number, amount, false);
  await deposit(dest_account_number, amount);
  
  if (!create_transaction) {
    return null;
  }
  console.log(src_account.balance, amount*-1);
  return await createTransaction(src_account.id, src_account.balance-amount, amount*-1, "Transfer", `Transferred $${amount} from ${src_account.name} to ${dest_account.name}`);
}
