import { AppShell } from "@/components/templates/app-shell";
import { PageFrame } from "@/components/templates/page-frame";
import { ShopSettingsPage } from "@/components/templates/shop-settings";

export default function SettingsPage() {
  return (
    <AppShell>
      <PageFrame>
        <ShopSettingsPage />
      </PageFrame>
    </AppShell>
  );
}
