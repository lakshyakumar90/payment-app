import { AdminWalletBulkForm } from "../../../../components/forms/admin-wallet-bulk-form";

export default function WalletBulkPage() {
  return (
    <div className="space-y-2">
      <div>
        <h1 className="text-xl font-semibold">Wallet bulk operations</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Apply top-up, deduct, or cache reset across all wallets.
        </p>
      </div>

      <AdminWalletBulkForm />
    </div>
  );
}

