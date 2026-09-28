import { AppShell } from "@/components/templates/app-shell";
import { NotificationsPage } from "@/components/templates/notifications";
import { PageFrame } from "@/components/templates/page-frame";

export default function NotificationsRoute() {
  return (
    <AppShell>
      <PageFrame delayMs={320}>
        <NotificationsPage />
      </PageFrame>
    </AppShell>
  );
}
