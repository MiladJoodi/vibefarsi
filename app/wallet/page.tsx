import { AppShell } from "@/components/templates/app-shell";
import { PageFrame } from "@/components/templates/page-frame";
import { WalletPage } from "@/components/templates/wallet";

export default function WalletRoute() {
  return (
    <AppShell>
      <PageFrame>
        <WalletPage />
      </PageFrame>
    </AppShell>
  );
}
