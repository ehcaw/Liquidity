import { getAuthUser } from "@/services/auth/auth";
import { ClientError, ServerError } from "@/utils/exceptions";
import { redirect } from "next/navigation";

export const isAuthenticated = async () => {
  try {
    await getAuthUser();
  } catch (error) {
    if (error instanceof ClientError) {
      redirect('/signin')
    } else if (error instanceof ServerError) {
      redirect('/internal-error')
    }
  }
};
