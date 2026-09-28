import { AppShell } from "@/components/templates/app-shell";
import { AdminOrdersPage } from "@/components/templates/admin-orders";
import { PageFrame } from "@/components/templates/page-frame";

export default function OrdersPage() {
  return (
    <AppShell>
      <PageFrame>
        <AdminOrdersPage />
      </PageFrame>
    </AppShell>
  );
}
