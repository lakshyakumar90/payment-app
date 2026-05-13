"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

import { getApiErrorMessage } from "../../lib/api/error";
import { toastError, toastSuccess } from "../../lib/toast";
import { adminTransferBetweenUsers } from "../../lib/api/transaction-admin-api";
import { ErrorAlert } from "../feedback/error-alert";
import { UserSearchSelect } from "./user-search-select";
import { AdminTransferBetweenUsersSchema } from "@repo/zod-schemas";

type AdminTransferFormValues = z.infer<typeof AdminTransferBetweenUsersSchema>;

export function AdminTransferForm() {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AdminTransferFormValues>({
    resolver: zodResolver(AdminTransferBetweenUsersSchema),
    defaultValues: { fromUserId: "", toUserId: "", amount: 100 },
  });

  const mutation = useMutation({
    mutationFn: async (values: AdminTransferFormValues) => {
      // Backend always returns 200; business logic is in `transactionResult.success`.
      const data = await adminTransferBetweenUsers(values);
      if (!data.transactionResult.success) {
        throw new Error(data.transactionResult.message);
      }
      return data;
    },
    onSuccess: (data, variables) => {
      toastSuccess(data.transactionResult.message);
      reset({
        fromUserId: variables.fromUserId,
        toUserId: variables.toUserId,
        amount: 100,
      });
    },
    onError: (e) => toastError(getApiErrorMessage(e)),
  });

  const errorMessage = mutation.isError ? getApiErrorMessage(mutation.error) : null;

  return (
    <form
      className="flex w-full max-w-xl flex-col gap-4"
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
      noValidate
    >
      <ErrorAlert message={errorMessage} />

      {mutation.isSuccess && mutation.data ? (
        <p className="text-sm text-green-700">{mutation.data.transactionResult.message}</p>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2">
        <div className="flex flex-col gap-1">
          <label htmlFor="fromUserId" className="text-sm font-medium">
            From user
          </label>
          <Controller
            name="fromUserId"
            control={control}
            render={({ field }) => (
              <UserSearchSelect
                value={field.value}
                onChange={(id) => field.onChange(id)}
                disabled={mutation.isPending}
                placeholder="Search from-user…"
              />
            )}
          />
          {errors.fromUserId && (
            <p className="mt-1 text-xs text-red-600">{errors.fromUserId.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label htmlFor="toUserId" className="text-sm font-medium">
            To user
          </label>
          <Controller
            name="toUserId"
            control={control}
            render={({ field }) => (
              <UserSearchSelect
                value={field.value}
                onChange={(id) => field.onChange(id)}
                disabled={mutation.isPending}
                placeholder="Search to-user…"
              />
            )}
          />
          {errors.toUserId && (
            <p className="mt-1 text-xs text-red-600">{errors.toUserId.message}</p>
          )}
        </div>
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
          disabled={mutation.isPending}
        />
        {errors.amount && (
          <p className="mt-1 text-xs text-red-600">{errors.amount.message}</p>
        )}
      </div>

      <button
        type="submit"
        disabled={mutation.isPending}
        className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {mutation.isPending ? "Processing…" : "Admin transfer"}
      </button>
    </form>
  );
}

