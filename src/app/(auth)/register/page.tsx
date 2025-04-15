import Register from "@/components/RegistrationPage";
import { isNotAuthenticated } from "@/utils/isAuthenticated";

export default async function RegisterPage() {
  await isNotAuthenticated();
  return <Register />;
}
