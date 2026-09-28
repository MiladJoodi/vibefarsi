import { AppShell } from "@/components/templates/app-shell";
import { CrmPage } from "@/components/templates/crm";
import { PageFrame } from "@/components/templates/page-frame";

export default function CustomersPage() {
  return (
    <AppShell>
      <PageFrame>
        <CrmPage />
      </PageFrame>
    </AppShell>
  );
}
