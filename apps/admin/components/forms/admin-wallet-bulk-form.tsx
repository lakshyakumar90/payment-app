"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { getApiErrorMessage } from "../../lib/api/error";
import { toastError, toastSuccess } from "../../lib/toast";
import {
  adminDeductAllWallet,
  adminResetAllCachesWallet,
  adminTopUpAllWallet,
} from "../../lib/api/wallet-admin-api";
import { ErrorAlert } from "../feedback/error-alert";
import { AdminTopUpAllWalletSchema } from "@repo/zod-schemas";

type BulkAmountFormValues = z.infer<typeof AdminTopUpAllWalletSchema>;

export function AdminWalletBulkForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<BulkAmountFormValues>({
    resolver: zodResolver(AdminTopUpAllWalletSchema),
    defaultValues: { amount: 100 },
  });

  const [message, setMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const topUpAllMutation = useMutation({
    mutationFn: (values: BulkAmountFormValues) => adminTopUpAllWallet(values),
    onSuccess: (data) => {
      setErrorMessage(null);
      setMessage(`Success. Credited ${data.affectedCount} wallets with amount ${data.amount}.`);
      toastSuccess(`Top up all: ${data.affectedCount} wallets`);
    },
    onError: (e) => {
      const msg = getApiErrorMessage(e);
      setErrorMessage(msg);
      toastError(msg);
    },
  });

  const deductAllMutation = useMutation({
    mutationFn: (values: BulkAmountFormValues) => adminDeductAllWallet(values),
    onSuccess: (data) => {
      setErrorMessage(null);
      setMessage(`Success. Debited ${data.affectedCount} wallets with amount ${data.amount}.`);
      toastSuccess(`Deduct all: ${data.affectedCount} wallets`);
    },
    onError: (e) => {
      const msg = getApiErrorMessage(e);
      setErrorMessage(msg);
      toastError(msg);
    },
  });

  const resetAllMutation = useMutation({
    mutationFn: () => adminResetAllCachesWallet(),
    onSuccess: (data) => {
      setErrorMessage(null);
      setMessage(`Success. Reset cache for ${data.updatedCount} wallets.`);
      toastSuccess(`Reset all caches: ${data.updatedCount} wallets`);
    },
    onError: (e) => {
      const msg = getApiErrorMessage(e);
      setErrorMessage(msg);
      toastError(msg);
    },
  });

  const runWithAmountValues = (fn: (values: BulkAmountFormValues) => void) => {
    void handleSubmit((values) => fn(values))();
  };

  const isBusy =
    topUpAllMutation.isPending || deductAllMutation.isPending || resetAllMutation.isPending;

  return (
    <div className="flex w-full max-w-lg flex-col gap-4">
      <ErrorAlert message={errorMessage} />

      {message ? <p className="text-sm text-green-700">{message}</p> : null}

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
          disabled={isBusy}
        />
        {errors.amount && (
          <p className="text-xs text-red-600">{errors.amount.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-2">
        <button
          type="button"
          disabled={isBusy}
          onClick={() => runWithAmountValues((values) => topUpAllMutation.mutate(values))}
          className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {topUpAllMutation.isPending ? "Topping up…" : "Top up all wallets"}
        </button>

        <button
          type="button"
          disabled={isBusy}
          onClick={() => runWithAmountValues((values) => deductAllMutation.mutate(values))}
          className="rounded-md bg-neutral-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {deductAllMutation.isPending ? "Processing…" : "Deduct all wallets"}
        </button>

        <button
          type="button"
          disabled={resetAllMutation.isPending || isBusy}
          onClick={() => resetAllMutation.mutate()}
          className="rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm font-medium text-neutral-900 disabled:opacity-50"
        >
          {resetAllMutation.isPending ? "Resetting…" : "Reset all caches"}
        </button>
      </div>
    </div>
  );
}

