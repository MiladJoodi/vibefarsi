import { AppShell } from "@/components/templates/app-shell";
import { HelpPage } from "@/components/templates/help";
import { PageFrame } from "@/components/templates/page-frame";

export default function HelpRoute() {
  return (
    <AppShell>
      <PageFrame delayMs={300}>
        <HelpPage />
      </PageFrame>
    </AppShell>
  );
}
