import { LoginForm } from "../../../components/forms/login-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-6 p-6">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-xl font-semibold tracking-tight">Admin sign in</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Use your administrator credentials.
        </p>
      </div>
      <LoginForm />
    </main>
  );
}
