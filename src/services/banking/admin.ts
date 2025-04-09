import { ClientError, ServerError } from "@/utils/exceptions";
import { createClient } from "@/utils/supabase/server";
import { getAuthUser } from "@/services/auth/auth";
import { Database } from "@/types/db";

  // TODO: verify the user is an admin

export async function getTotalBankBalance() {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc('admin_get_total_bank_balance');

  if (error) {
    throw new ServerError(error.message);
  }

  return data;
}

export async function getTotalActiveAccounts() {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc('admin_count_active_accounts');

  if (error) {
    throw new ServerError(error.message);
  }

  return data;
}

export async function getNewAccounts() {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc('admin_count_new_accounts');

  if (error) {
    throw new ServerError(error.message);
  }

  return data;
}

export async function getTotalTransactions() {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc('admin_count_total_transactions');

  if (error) {
    throw new ServerError(error.message);
  }

  return data;
}

// returns 
export async function getPendingTransactions() {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc('admin_count_pending_transactions');

  if (error) {
    throw new ServerError(error.message);
  }

  return data;
}

// returns specified number of most recent transactions (default 5)
export async function getRecentTransactions(limit = 5) {
  const supabase = await createClient();

  const { data , error } = await supabase
  .from("transactions")
  .select("*")
  .order("created_at", { ascending: false })
  .limit(limit);

  if (error) {
    throw new ServerError(error.message);
  }
  return data;
}

export async function getAllTransactions() {
  const supabase = await createClient();

  const { data , error } = await supabase
  .from("transactions")
  .select("*");

  if (error) {
    throw new ServerError(error.message);
  }
  return data;
}

export async function getAllAccounts() {
  const supabase = await createClient();

  const { data , error } = await supabase
  .from("accounts")
  .select("*");

  if (error) {
    throw new ServerError(error.message);
  }
  return data;
}

export async function getAllUsers() {
  const supabase = await createClient();

  const { data , error } = await supabase
  .from("users")
  .select("*");

  if (error) {
    throw new ServerError(error.message);
  }
  return data;
}