import LegalPage from "@/components/sections/LegalPage";
import { terms } from "@/data/legal";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({ title: terms.title, path: "/terms" });

export default function TermsPage() {
  return <LegalPage doc={terms} />;
}
