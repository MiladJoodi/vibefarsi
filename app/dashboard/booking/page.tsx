import { AppShell } from "@/components/templates/app-shell";
import { BookingPage } from "@/components/templates/booking";
import { PageFrame } from "@/components/templates/page-frame";

export default function BookingRoute() {
  return (
    <AppShell>
      <PageFrame delayMs={360}>
        <BookingPage />
      </PageFrame>
    </AppShell>
  );
}
