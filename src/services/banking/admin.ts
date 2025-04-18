import { ServerError } from "@/utils/exceptions";
import { createClient } from "@/utils/supabase/server";

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

interface ReportFilters {
  p_city?: string;
  p_date_from?: string;
  p_date_to?: string;
  p_max_balance?: number;
  p_min_balance?: number;
  p_state_code?: string;
  p_statuses?: ('Active' | 'Frozen' | 'Closed' | 'Pending' | 'Overdrawn')[];
  p_zip_codes?: string[];
}

export async function getReport(filters: ReportFilters) {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc('admin_account_report', filters);

  if (error) {
    throw new ServerError(error.message);
  }
  return data;
}