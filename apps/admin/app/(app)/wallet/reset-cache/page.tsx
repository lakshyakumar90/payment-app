import { AdminResetCacheForm } from "../../../../components/forms/admin-reset-cache-form";

export default function WalletResetCachePage() {
  return (
    <div className="space-y-2">
      <div>
        <h1 className="text-xl font-semibold">Reset cache</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Recompute and store the ledger balance for a single wallet.
        </p>
      </div>

      <AdminResetCacheForm />
    </div>
  );
}

