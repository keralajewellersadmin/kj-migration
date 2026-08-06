import { getCategories, getSiteSettings } from "@/lib/data/cms";
import ConditionalLayout from "@/components/ui/ConditionalLayout";

export const revalidate = 300;

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
    <ConditionalLayout navCategories={navCategories} settings={settings}>
      {children}
    </ConditionalLayout>
  );
}
