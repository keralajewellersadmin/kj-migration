import type { Metadata } from "next";
import { Montserrat, Mulish } from "next/font/google";
import "@/styles/tokens.css";
import "@/app/globals.css";
import { getCategories, getSiteSettings } from "@/lib/data/cms";
import ConditionalLayout from "@/components/ui/ConditionalLayout";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Kerala Jewellers",
  description: "Kerala Jewellers — Rebuild",
};

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-ui-loaded",
});

const mulish = Mulish({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-body-loaded",
});

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [goldCategories, silverCategories, diamondCategories, settings] =
    await Promise.all([
      getCategories("gold"),
      getCategories("silver"),
      getCategories("diamond"),
      getSiteSettings(),
    ]);

  const navCategories = {
    gold: goldCategories,
    silver: silverCategories,
    diamond: diamondCategories,
  };

  return (
    <html lang="en" className={`${montserrat.variable} ${mulish.variable}`}>
      <head>
        <link
          rel="preload"
          href="/assets/fonts/com4tdrify.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
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
