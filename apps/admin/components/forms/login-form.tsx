"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema, type LoginSchemaType } from "@repo/zod-schemas";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { getApiErrorMessage } from "../../lib/api/error";
import { toastError, toastSuccess } from "../../lib/toast";
import { useAuth } from "../../providers/auth-provider";
import { ErrorAlert } from "../feedback/error-alert";

export function LoginForm() {
  const router = useRouter();
  const { status, login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchemaType>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { email: "", password: "" },
  });

  useEffect(() => {
    if (status === "authenticated") {
      router.replace("/");
    }
  }, [status, router]);

  const mutation = useMutation({
    mutationFn: (body: LoginSchemaType) => login(body),
    onSuccess: () => {
      setServerError(null);
      toastSuccess("Signed in successfully");
      router.replace("/");
    },
    onError: (err) => {
      const msg = getApiErrorMessage(err);
      setServerError(msg);
      toastError(msg);
    },
  });

  if (status === "loading" || status === "idle") {
    return (
      <p className="text-sm text-neutral-500" aria-live="polite">
        Checking session…
      </p>
    );
  }
  if (status === "authenticated") {
    return null;
  }

  return (
    <form
      className="flex w-full max-w-sm flex-col gap-4"
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
      noValidate
    >
      <ErrorAlert message={serverError} />

      <div className="flex flex-col gap-1">
        <label htmlFor="email" className="text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          {...register("email")}
        />
        {errors.email && (
          <p className="text-xs text-red-600">{errors.email.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="password" className="text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          {...register("password")}
        />
        {errors.password && (
          <p className="text-xs text-red-600">{errors.password.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {mutation.isPending ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
