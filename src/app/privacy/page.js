import LegalPage from "@/components/sections/LegalPage";
import { privacy } from "@/data/legal";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: privacy.title, path: "/privacy" });

export default function PrivacyPage() {
  return <LegalPage doc={privacy} />;
}
