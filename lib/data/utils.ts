import { IMG } from "../cloudinary/fallbacks";
import { normalizeCloudinaryDeliveryUrl } from "../cloudinary/index.ts";

export function normalizeCategory(raw: string, metal?: string): string {
  const lower = raw.toLowerCase();
  if (lower.includes("bangle"))
    return metal === "silver" ? "bracelets" : "bangles";
  if (lower.includes("anklet")) return "anklets";
  if (lower.includes("bracelet")) return "bracelets";
  if (
    lower.includes("jimmiki") ||
    lower.includes("jimikki") ||
    lower.includes("stud") ||
    lower.includes("drop earring") ||
    lower.includes("earring")
  )
    return "earrings";
  if (lower.includes("idol") || lower.includes("kuthuvilaku"))
    return metal === "silver" ? "idols" : "pendant";
  if (lower.includes("pendant") || lower.includes("locket")) return "pendant";
  if (lower.includes("ring")) return "rings";
  if (
    lower.includes("necklace") ||
    lower.includes("haram") ||
    lower.includes("choker") ||
    lower.includes("kasumalai") ||
    lower.includes("mango") ||
    lower.includes("fancy") ||
    lower.includes("chain")
  )
    return "necklace";
  return lower;
}

export const metals = [
  {
    slug: "gold",
    name: "Gold",
    icon: IMG.coinGold,
    description:
      "Feast your senses on these sparkling golden wonders from Kerala Jewellers. Our intricate designs and heritage embellishments evoke royal sentiments and elegant beauty.",
    heroTitle: "Elegant & Timeless Gold Jewellery",
    heroSubtitle:
      "Discover our exclusive collection of gold jewellery that stands the test of time. Perfect for every occasion.",
    heroBg: normalizeCloudinaryDeliveryUrl("https://res.cloudinary.com/htl6k8cd/image/upload/v1786011479/kerala-jewellers/banners/products-hero-gold.webp"),
  },
  {
    slug: "silver",
    name: "Silver",
    icon: IMG.coinSilver,
    description:
      "Explore a tasteful range of silver adornments from our collection and diversify your jewellery options.",
    heroTitle: "Classic Elegance <br>in Silver",
    heroSubtitle:
      "Explore our collection of timeless silver jewellery. Perfectly crafted for every moment.",
    heroBg: normalizeCloudinaryDeliveryUrl("https://res.cloudinary.com/htl6k8cd/image/upload/v1786011521/kerala-jewellers/banners/products-hero-silver.webp"),
  },
  {
    slug: "diamond",
    name: "Diamond",
    icon: IMG.coinGold,
    description:
      "Expressing a fashion statement is one thing. Unlocking your own personal style is a whole other game. Explore our exquisite diamond designs and find the right pieces that will make you feel like you.",
    heroTitle: "Timeless Brilliance in Diamonds",
    heroSubtitle:
      "Discover our exquisite collection of diamond jewellery, crafted to perfection for every occasion.",
    heroBg: normalizeCloudinaryDeliveryUrl("https://res.cloudinary.com/htl6k8cd/image/upload/v1786011524/kerala-jewellers/banners/products-hero-diamond.webp"),
  },
  {
    slug: "platinum",
    name: "Platinum",
    icon: IMG.coinGold,
    description:
      "Explore our refined collection of platinum jewellery, crafted for those who appreciate understated luxury and enduring elegance.",
    heroTitle: "Exquisite Platinum Jewellery",
    heroSubtitle:
      "Explore our refined collection of platinum jewellery, crafted for those who appreciate understated luxury.",
    heroBg: normalizeCloudinaryDeliveryUrl("https://res.cloudinary.com/htl6k8cd/image/upload/v1786011524/kerala-jewellers/banners/products-hero-diamond.webp"),
  },
];

