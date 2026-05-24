import { redirect } from "next/navigation";
import AuthForm from "../../../components/auth-form";
import { getCurrentUser } from "../../../lib/auth";
import { registerAction } from "../../../lib/auth-actions";

export default async function RegisterPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect("/");
  }

  return (
    <div className="mx-auto w-full max-w-md px-4 sm:px-0">
      <AuthForm mode="register" action={registerAction} />
    </div>
  );
}
