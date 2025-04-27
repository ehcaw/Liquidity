import { Database } from "@/types/db";
import { ServerError } from "@/utils/exceptions";
import { createClient } from "@/utils/supabase/server";
import { getAuthUser } from "@/services/auth/auth";

type PaymentSchedule =
  Database["public"]["Tables"]["payment_schedule"]["Insert"];
export async function createPaymentSchedule(schedule: PaymentSchedule) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("payment_schedule")
    .insert(schedule)
    .select();

  if (error) {
    console.error("Transaction fetch error:", error);
    throw new ServerError(error.message);
  }
  return data;
}

export async function getUserPaymentSchedules() {
  const supabase = await createClient();
  const authUser = await getAuthUser();

  const { data, error } = await supabase.rpc('get_user_payment_schedules', {uid: authUser.id});

  if (error) {
    throw new ServerError(error.message);
  }

  return data;
}
