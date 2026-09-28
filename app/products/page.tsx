import { AppShell } from "@/components/templates/app-shell";
import { AdminProductsPage } from "@/components/templates/admin-products";
import { PageFrame } from "@/components/templates/page-frame";

export default function ProductsPage() {
  return (
    <AppShell>
      <PageFrame>
        <AdminProductsPage />
      </PageFrame>
    </AppShell>
  );
}
