import type { ReactNode } from "react";

import { AdminRouteGate } from "../../components/layout/admin-route-gate";

export default function AppGroupLayout({ children }: { children: ReactNode }) {
  return <AdminRouteGate>{children}</AdminRouteGate>;
}
