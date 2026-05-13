import { AdminTopUpForm } from "../../../../components/forms/admin-top-up-form";

export default function WalletTopUpPage() {
  return (
    <div className="space-y-2">
      <div>
        <h1 className="text-xl font-semibold">Wallet top up</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Credit a user’s wallet by selecting the user and entering an amount.
        </p>
      </div>

      <AdminTopUpForm />
    </div>
  );
}

