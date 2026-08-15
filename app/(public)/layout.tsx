import type { Metadata } from "next";
import { getCategories, getSiteSettings } from "@/lib/data/cms";
import ConditionalLayout from "@/components/ui/ConditionalLayout";

import "@/styles/tokens.css";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Kerala Jewellers",
  description:
    "Kerala Jewellers offers exquisite gold, silver, and diamond jewellery crafted with precision. Shop traditional and modern designs.",
  metadataBase: new URL("https://keralajewellers.in"),
  openGraph: {
    siteName: "Kerala Jewellers",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export const revalidate = 300;
export const dynamic = "force-dynamic";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const goldCategories = await getCategories("gold");
  const silverCategories = await getCategories("silver");
  const diamondCategories = await getCategories("diamond");
  const settings = await getSiteSettings();

  const navCategories = {
    gold: goldCategories,
    silver: silverCategories,
    diamond: diamondCategories,
  };

  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#991f23" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Mulish:wght@300;400;500;600;700&display=block"
        />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link
          rel="shortcut icon"
          href="/assets/logo/favicon.png"
          type="image/png"
        />
        <link rel="icon" href="/assets/logo/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/assets/logo/apple-touch-icon.png" />
      </head>
      <body>
        <ConditionalLayout navCategories={navCategories} settings={settings}>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
