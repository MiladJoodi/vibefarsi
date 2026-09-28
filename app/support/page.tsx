import { AppShell } from "@/components/templates/app-shell";
import { PageFrame } from "@/components/templates/page-frame";
import { SupportPage } from "@/components/templates/support";

export default function SupportRoute() {
  return (
    <AppShell>
      <PageFrame>
        <SupportPage />
      </PageFrame>
    </AppShell>
  );
}
