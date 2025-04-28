import Register from "@/components/RegistrationPage";
import { Database } from "@/types/db";
import { fetchData } from "@/utils/fetch";
import { isNotAuthenticated } from "@/utils/isAuthenticated";

type State = Database["public"]["Tables"]["states"]["Row"];

export default async function RegisterPage() {
  await isNotAuthenticated();
  const states = await fetchData<State[]>("/api/states");
  return <Register states={states.map((state) => state.code)} />;
}
