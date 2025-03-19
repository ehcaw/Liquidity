import CreateAccountForm from "@/components/create-account-form";
import { isAuthenticated } from "@/utils/isAuthenticated";

const CreateAccount = async () => {
  await isAuthenticated();
  return (
    <div className="size-fit mx-auto">
      <CreateAccountForm />
    </div>
  );
};

export default CreateAccount;
