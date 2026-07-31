"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import type { SiteSettingsData } from "@/lib/data/cms";

type Category = { name: string; slug: string };

export default function ConditionalLayout({
  children,
  navCategories,
  settings,
}: {
  children: React.ReactNode;
  navCategories: Record<string, Category[]>;
  settings: SiteSettingsData;
}) {
  const pathname = usePathname();
  const isContact = pathname === "/contact";

  return (
    <>
      <Navbar navCategories={navCategories} rates={settings} />
      {children}
      <Footer hideMaps={isContact} settings={settings} />
    </>
  );
}
