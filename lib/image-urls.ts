import { normalizeCloudinaryDeliveryUrl } from "./cloudinary";

function normalizeImageMap<T extends Record<string, string>>(images: T): T {
  return Object.fromEntries(
    Object.entries(images).map(([key, value]) => [
      key,
      normalizeCloudinaryDeliveryUrl(value),
    ]),
  ) as T;
}

export const IMG = normalizeImageMap({
  // Bestsellers fallback (CMS products override these)
  antiqueIdol: "/assets/images/676e4568ee5ddd9c1b62ea34_white%20jewel%2016%20(1).png",
  antiqueIdolP500: "/assets/images/676e4568ee5ddd9c1b62ea34_white%20jewel%2016%20(1)-p-500.png",
  antiqueIdolP800: "/assets/images/676e4568ee5ddd9c1b62ea34_white%20jewel%2016%20(1)-p-800.png",
  antiqueIdolP1080: "/assets/images/676e4568ee5ddd9c1b62ea34_white%20jewel%2016%20(1).png",
  antiqueIdolP1600: "/assets/images/676e4568ee5ddd9c1b62ea34_white%20jewel%2016%20(1).png",
  antiqueIdolP2000: "/assets/images/676e4568ee5ddd9c1b62ea34_white%20jewel%2016%20(1).png",
  antiqueJimmiki: "/assets/images/676e4568ee5ddd9c1b62ea34_white%20jewel%2016%20(1).png",
  antiqueJimmikiP500: "/assets/images/676e4568ee5ddd9c1b62ea34_white%20jewel%2016%20(1)-p-500.png",
  antiqueJimmikiP800: "/assets/images/676e4568ee5ddd9c1b62ea34_white%20jewel%2016%20(1)-p-800.png",
  diamondNecklace: "/assets/images/676e4568ee5ddd9c1b62ea34_white%20jewel%2016%20(1).png",
  diamondNecklaceP500: "/assets/images/676e4568ee5ddd9c1b62ea34_white%20jewel%2016%20(1)-p-500.png",
  diamondNecklaceP800: "/assets/images/676e4568ee5ddd9c1b62ea34_white%20jewel%2016%20(1)-p-800.png",
  diamondNecklaceP1080: "/assets/images/676e4568ee5ddd9c1b62ea34_white%20jewel%2016%20(1).png",
  diamondNecklaceP1600: "/assets/images/676e4568ee5ddd9c1b62ea34_white%20jewel%2016%20(1).png",
  diamondNecklaceP2000: "/assets/images/676e4568ee5ddd9c1b62ea34_white%20jewel%2016%20(1).png",

  // Separator (static UI)
  separator: "https://res.cloudinary.com/htl6k8cd/image/upload/v1785683260/kerala-jewellers/gallery/66a9ee0da26cbfb9cf0ed206_Group%202085664970.png",

  // Features fallback (CMS features override these)
  featuresWeddings: "https://res.cloudinary.com/htl6k8cd/image/upload/v1785683307/kerala-jewellers/banners/66aa08b203540b7e28f7bcb3_Frame%202085664975.webp",
  featuresWeddingsP1080: "https://res.cloudinary.com/htl6k8cd/image/upload/w_1080,q_auto,f_auto/kerala-jewellers/banners/66aa08b203540b7e28f7bcb3_Frame%202085664975.webp",
  featuresAuthenticity: "https://res.cloudinary.com/htl6k8cd/image/upload/v1785683268/kerala-jewellers/gallery/66a9cf95a2a871357e4fef00_2147587092%201.png",
  featuresAuthenticityP500: "https://res.cloudinary.com/htl6k8cd/image/upload/w_500,q_auto,f_auto/kerala-jewellers/gallery/66a9cf95a2a871357e4fef00_2147587092%201.png",
  featuresHeritage: "https://res.cloudinary.com/htl6k8cd/image/upload/v1785683278/kerala-jewellers/gallery/66a9cf9526da64e4c3831b8a_144443%201.png",
  featuresHeritageP500: "https://res.cloudinary.com/htl6k8cd/image/upload/w_500,q_auto,f_auto/kerala-jewellers/gallery/66a9cf9526da64e4c3831b8a_144443%201.png",

  // Heritage fallback (CMS heritage overrides these)
  heritageHero: "https://res.cloudinary.com/htl6k8cd/image/upload/v1785683312/kerala-jewellers/banners/66aa0d1f3e89efeb11397196_Rectangle%20343.webp",
  heritageHeroP1080: "https://res.cloudinary.com/htl6k8cd/image/upload/w_1080,q_auto,f_auto/kerala-jewellers/banners/66aa0d1f3e89efeb11397196_Rectangle%20343.webp",
  heritageHeroP1600: "https://res.cloudinary.com/htl6k8cd/image/upload/w_1600,q_auto,f_auto/kerala-jewellers/banners/66aa0d1f3e89efeb11397196_Rectangle%20343.webp",
  heritageHeroP2000: "https://res.cloudinary.com/htl6k8cd/image/upload/w_2000,q_auto,f_auto/kerala-jewellers/banners/66aa0d1f3e89efeb11397196_Rectangle%20343.webp",

  // Latest banners fallback (CMS banners override these)
  latestBanner1: "/assets/images/66ae22bea9cab6312ffdd45d_Rectangle%20367%20(7).png",
  latestBanner2: "https://res.cloudinary.com/htl6k8cd/image/upload/v1785683322/kerala-jewellers/banners/66aa067372c8bb1c084deda0_Rectangle%20340.png",
  latestBanner3: "/assets/images/66ae22bef52614a0871d61a2_Rectangle%20367%20(8).png",

  // Static content — origin hero images (CMS-managed, fallback matches origin)
  aboutFallback: "https://res.cloudinary.com/htl6k8cd/image/upload/v1787693749/kerala-jewellers/heritage/66ab36052626ce8e9edda3ca_Rectangle_355.png",
  blogDecorative: "https://res.cloudinary.com/htl6k8cd/image/upload/v1787694059/kerala-jewellers/blog/66ab5ac76305a6ebd97fd501_Group_2085665034_1.png",

  // Hero slide backgrounds (fallback when CMS heroSlides empty)
  heroSlide1: "https://res.cloudinary.com/htl6k8cd/image/upload/v1785763761/kerala-jewellers/gallery/hero-slide-1-celebrate.webp",
  heroSlide2: "https://res.cloudinary.com/htl6k8cd/image/upload/v1785763776/kerala-jewellers/gallery/hero-slide-2-ethnic.webp",
  heroSlide3: "https://res.cloudinary.com/htl6k8cd/image/upload/v1785763778/kerala-jewellers/gallery/hero-slide-3-gold.webp",
  heroSlide4: "https://res.cloudinary.com/htl6k8cd/image/upload/v1785763779/kerala-jewellers/gallery/hero-slide-4-bride.webp",

  // Hero decorative (static UI)
  heroDecorative: "https://res.cloudinary.com/htl6k8cd/image/upload/v1785683304/kerala-jewellers/gallery/66a9cbe79d7e6142879677cf_Group%202085665034.png",

  // Megamenu images (static UI)
  megamenuGold: "https://res.cloudinary.com/htl6k8cd/image/upload/v1785683345/kerala-jewellers/banners/66ae16158fbb46cce3ea01a1_Rectangle%20366.png",
  megamenuSilver: "/assets/images/66ae1d64b0ff185260ad9b44_Rectangle%20367%20(1).png",
  megamenuDiamond: "/assets/images/66ae22bea9cab6312ffdd45d_Rectangle%20367%20(7).png",

  // UI (Local assets — logos, coins, icons)
  logoKj: "/assets/images/logo 1.png",
  coinGold: "/assets/coin/gold coin.png",
  coinSilver: "/assets/coin/silver coin.png",
  coinPlatinum: "/assets/coin/Platinum Coin.png",
  placeholder: "/assets/images/placeholder.svg",
});
