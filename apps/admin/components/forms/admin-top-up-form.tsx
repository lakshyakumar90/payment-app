"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { getApiErrorMessage } from "../../lib/api/error"; // your file is `error.ts`
import { adminTopUpWallet } from "../../lib/api/wallet-admin-api";
import { toastError, toastSuccess } from "../../lib/toast";
import { ErrorAlert } from "../feedback/error-alert";
import { AdminTopUpWalletSchema } from "@repo/zod-schemas";
import { UserSearchSelect } from "./user-search-select";

type AdminTopUpFormValues = z.infer<typeof AdminTopUpWalletSchema>;



export function AdminTopUpForm() {
  // React Hook Form values are inferred from the shared Zod schema.
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<AdminTopUpFormValues>({
    resolver: zodResolver(AdminTopUpWalletSchema),
    defaultValues: { userId: "", amount: 100 },
  });

  const mutation = useMutation({
    mutationFn: (values: AdminTopUpFormValues) => adminTopUpWallet(values),
    onSuccess: (data) => {
      toastSuccess(`Wallet credited: ${data.wallet.amount}`);
      reset({ userId: "", amount: 100 });
    },
    onError: (e) => toastError(getApiErrorMessage(e)),
  });

  const errorMessage = mutation.isError
    ? getApiErrorMessage(mutation.error)
    : null;

  return (
    <form
      className="flex w-full max-w-lg flex-col gap-4"
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
      noValidate
    >
      <ErrorAlert message={errorMessage} />

      <div className="flex flex-col gap-1">
        <label htmlFor="userId" className="text-sm font-medium">
          User
        </label>

        <Controller
          name="userId"
          control={control}
          render={({ field }) => (
            <UserSearchSelect
              value={field.value}
              onChange={(id) => field.onChange(id)}
              disabled={mutation.isPending}
              placeholder="Type at least 2 characters to search…"
            />
          )}
        />

        {errors.userId && (
          <p className="mt-1 text-xs text-red-600">{errors.userId.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="amount" className="text-sm font-medium">
          Amount
        </label>
        <input
          id="amount"
          type="number"
          inputMode="decimal"
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm"
          {...register("amount", { valueAsNumber: true })}
        />
        {errors.amount && (
          <p className="text-xs text-red-600">{errors.amount.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {mutation.isPending ? "Topping up…" : "Top up wallet"}
      </button>

      {mutation.isSuccess && (
        <p className="text-sm text-green-700">
          Success. Credited{" "}
          <span className="font-medium">{mutation.data.wallet.amount}</span>{" "}
          to wallet{" "}
          <span className="font-medium">{mutation.data.wallet.walletId}</span>.
        </p>
      )}
    </form>
  );
}