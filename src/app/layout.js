import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/jost/300.css";
import "@fontsource/jost/400.css";
import "@fontsource/jost/500.css";
import "@fontsource/great-vibes/400.css";
import "./globals.css";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import SiteOnly from "@/components/layout/SiteOnly";
import JsonLd from "@/components/ui/JsonLd";
import { site } from "@/data/site";
import { buildMetadata, organizationJsonLd } from "@/lib/seo";

export const metadata = {
  metadataBase: new URL(site.url),
  ...buildMetadata(),
  title: {
    default: `${site.name} | ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
};

export const viewport = {
  themeColor: "#101815",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en-GB">
      <head>
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.2/css/all.min.css"
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
      </head>
      <body className="min-h-dvh bg-ink">
        <SiteOnly>
          <a
            href="#main"
            className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[60] focus:bg-gold focus:px-4 focus:py-2 focus:text-ink"
          >
            Skip to content
          </a>
          <Header />
        </SiteOnly>
        <main id="main">{children}</main>
        <SiteOnly>
          <Footer />
          <JsonLd data={organizationJsonLd()} />
        </SiteOnly>
      </body>
    </html>
  );
}
