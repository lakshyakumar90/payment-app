import { AdminTransferForm } from "../../../../components/forms/admin-transfer-form";

export default function AdminTransferPage() {
  return (
    <div className="space-y-2">
      <div>
        <h1 className="text-xl font-semibold">Admin transfer</h1>
        <p className="mt-1 text-sm text-neutral-600">
          Transfer amount from one user wallet to another.
        </p>
      </div>

      <AdminTransferForm />
    </div>
  );
}

