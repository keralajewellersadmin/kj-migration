import { getCategories, getSiteSettings } from "@/lib/data/cms";
import ConditionalLayout from "@/components/ui/ConditionalLayout";

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
        <link rel="preconnect" href="https://res.cloudinary.com" />
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
