import { ServerError } from "@/utils/exceptions";
import { createClient } from "@/utils/supabase/server";
import { getAuthUser } from "@/services/auth/auth";

export async function getAllTransactions() {
  const authUser = await getAuthUser();
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_user_transactions", { uid: authUser.id });

  if (error) {
    throw new ServerError(error.message);
  }

  return data;
}
