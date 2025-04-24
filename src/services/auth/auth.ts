import { ClientError } from "@/utils/exceptions";
import { createClient } from "@/utils/supabase/server";

export async function getAuthUser() {
  const supabase = await createClient();

  const { data, error: authError } = await supabase.auth.getUser();
  if (authError) {
    throw new ClientError(authError.message, 401);
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

export async function userExists(email: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select()
    .eq("email", email);

  if (error) {
    throw new ClientError(error.message, 404);
  }

  return data.length > 0;
}

export async function promoteAdmin() {
  const user = await getAuthUser();
  const supabase = await createClient();

  const { error: updateError } = await supabase
    .from("users")
    .update({ role: "Admin" })
    .eq("email", user.email || "");

  if (updateError) {
    throw new ClientError(updateError.message, 400);
  }
}
