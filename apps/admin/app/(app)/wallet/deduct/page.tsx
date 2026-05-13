import { AdminDeductForm } from "../../../../components/forms/admin-deduct-form";

export default function WalletDeductPage() {
  return (
    <div className="space-y-2">
      <div>
        <h1 className="text-xl font-semibold">Wallet deduct</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Debit a user’s wallet by selecting the user and entering an amount.
        </p>
      </div>

      <AdminDeductForm />
    </div>
  );
}

