import { ClientError, ServerError } from "@/utils/exceptions";
import { createClient } from "@/utils/supabase/server";

export async function getAuthUser() {
  const supabase = await createClient();

  const { data, error: authError } = await supabase.auth.getUser();
  if (authError) {
    throw new ServerError(authError.message);
  }

  const sessionUser = data.user;

  const { data: user, error: selectError } = await supabase
    .from("users")
    .select()
    .eq("email", sessionUser.email || "");

  if (selectError) {
    throw new ClientError(selectError.message, 404);
  }

  return user[0];
}
