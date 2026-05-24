import AuthForm from "../../../components/auth-form";

export default function LoginPage() {
  return (
    <div className="mx-auto w-full max-w-md px-4 sm:px-0">
      <AuthForm mode="login" />
    </div>
  );
}
