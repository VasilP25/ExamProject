import AuthForm from "../../../components/auth-form";

export default function RegisterPage() {
  return (
    <div className="mx-auto w-full max-w-md px-4 sm:px-0">
      <AuthForm mode="register" />
    </div>
  );
}
