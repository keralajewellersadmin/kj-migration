import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import Features from "@/components/sections/Features";
import Categories from "@/components/sections/Categories";
import Bestsellers from "@/components/sections/Bestsellers";
import Latest from "@/components/sections/Latest";
import Heritage from "@/components/sections/Heritage";
import LazyReviews from "@/components/ui/LazyReviews";
import { getSiteSettings } from "@/lib/data/cms";

export const revalidate = 300;

export const metadata: Metadata = {
  title: "Kerala Jewellers — Gold, Silver & Diamond Jewellery in Chennai",
  description:
    "Kerala Jewellers — trusted since 1959 for gold, silver, and diamond jewellery in Chennai. Explore necklaces, bangles, rings, earrings, and more at our showrooms in T Nagar, Purasawalkam, and Porur.",
  openGraph: {
    title: "Kerala Jewellers — Gold, Silver & Diamond Jewellery in Chennai",
    description:
      "Trusted since 1959 for gold, silver, and diamond jewellery in Chennai. Explore our exclusive collections in-store & online.",
    url: "https://keralajewellers.in",
    siteName: "Kerala Jewellers",
    type: "website",
  },
};

export default async function Home() {
  const settings = await getSiteSettings();

  return (
    <>
      <Hero slides={settings.heroSlides} />
      <Features features={settings.features} />
      <Categories categories={settings.categories} />
      <Bestsellers bestsellerProducts={settings.bestsellerProducts} />
      <Latest banners={settings.banners} />
      <Heritage heritage={settings.heritage} />
      <LazyReviews reviews={settings.reviews} />
    </>
  );
}
