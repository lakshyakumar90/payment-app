"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { getApiErrorMessage } from "../../lib/api/error";
import { adminResetCacheWallet } from "../../lib/api/wallet-admin-api";
import { toastError, toastSuccess } from "../../lib/toast";
import { ErrorAlert } from "../feedback/error-alert";
import { UserSearchSelect } from "./user-search-select";
import { AdminResetCacheWalletSchema } from "@repo/zod-schemas";

type AdminResetCacheFormValues = z.infer<typeof AdminResetCacheWalletSchema>;

export function AdminResetCacheForm() {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AdminResetCacheFormValues>({
    resolver: zodResolver(AdminResetCacheWalletSchema),
    defaultValues: { userId: "" },
  });

  const mutation = useMutation({
    mutationFn: (values: AdminResetCacheFormValues) =>
      adminResetCacheWallet(values),
    onSuccess: (data) => {
      toastSuccess(data.wallet.message);
      reset({ userId: "" });
    },
    onError: (e) => toastError(getApiErrorMessage(e)),
  });

  const errorMessage = mutation.isError ? getApiErrorMessage(mutation.error) : null;

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

      <button
        type="submit"
        disabled={mutation.isPending}
        className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {mutation.isPending ? "Resetting…" : "Reset cache for wallet"}
      </button>

      {mutation.isSuccess && (
        <p className="text-sm text-green-700">
          {mutation.data.wallet.message}
        </p>
      )}
    </form>
  );
}

