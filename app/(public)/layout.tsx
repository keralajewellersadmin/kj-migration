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

  const heroLcp = settings.heroSlides?.[0]?.image || settings.heroSlides?.find((s: { isPinned?: boolean }) => s.isPinned)?.image;

  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    name: "Kerala Jewellers",
    url: "https://keralajewellers.in",
    logo: "https://keralajewellers.in/assets/logo/favicon.png",
    description:
      "Kerala Jewellers offers exquisite gold, silver, and diamond jewellery crafted with precision since 1959.",
    address: {
      "@type": "PostalAddress",
      streetAddress: "19, Pondy Bazaar, T.Nagar",
      addressLocality: "Chennai",
      addressRegion: "Tamil Nadu",
      postalCode: "600017",
      addressCountry: "IN",
    },
    telephone: "+914428156711",
    email: "info@keralajewellers.in",
    sameAs: [
      settings.instagramUrl || "https://www.instagram.com/keralajewellers1959/",
      settings.facebookUrl || "https://www.facebook.com/KeralaJewellers",
      settings.youtubeUrl || "https://www.youtube.com/@kerala_jewellers",
    ],
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
      opens: "10:00",
      closes: "21:00",
    },
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Kerala Jewellers",
    url: "https://keralajewellers.in",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://keralajewellers.in/products?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#991f23" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="preload"
          as="style"
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Mulish:wght@300;400;500;600;700&display=swap"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Mulish:wght@300;400;500;600;700&display=swap"
        />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        {heroLcp && (
          <link rel="preload" as="image" href={heroLcp} fetchPriority="high" />
        )}
        <link
          rel="shortcut icon"
          href="/assets/logo/favicon.png"
          type="image/png"
        />
        <link rel="icon" href="/assets/logo/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/assets/logo/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
        />
        {gaId && (
          <>
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', '${gaId}', { page_path: window.location.pathname });`,
              }}
            />
          </>
        )}
      </head>
      <body>
        <ConditionalLayout navCategories={navCategories} settings={settings}>
          {children}
        </ConditionalLayout>
      </body>
    </html>
  );
}
