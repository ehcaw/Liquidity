import { ClientError, ServerError } from "@/utils/exceptions";
import { createClient } from "@/utils/supabase/server";
import { getAuthUser } from "@/services/auth/auth";
import { Database } from "@/types/db";

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


  // TODO: verify the user is an admin
