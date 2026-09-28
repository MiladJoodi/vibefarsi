import { AppShell } from "@/components/templates/app-shell";
import { InvoicePage } from "@/components/templates/invoice";
import { PageFrame } from "@/components/templates/page-frame";

export default function InvoicesRoute() {
  return (
    <AppShell>
      <PageFrame>
        <InvoicePage />
      </PageFrame>
    </AppShell>
  );
}
