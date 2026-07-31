// SEED DATA ONLY — not used at runtime; all data served via CMS
export type { Product, BlogBlock, BlogPost } from "./types";
import type { Product, BlogPost } from "./types";

export const products: Product[] = [
  {
    slug: "aadhya-necklace",
    name: "BOMBAY CHOKER",
    code: "KJG033",
    metal: "gold",
    category: "BOMBAY CHOKER",
    weight: "20g",
    purity: "91.6",
    description:
      "This opulent Bombay Choker is a magnificent fusion of intricate design and radiant splendor. Its broad, meticulously crafted band features a breathtaking fan-like motif at its center, adorned with delicate golden beads and vibrant gemstones. From its lower edge, exquisitely detailed floral drops suspend gracefully, adding a touch of enchanting movement. This choker is designed to make a grand statement, embodying traditional artistry and luxurious elegance for your most cherished occasions.",
    image: "/assets/images/679a27d9c65b974c2b51289a_8-600x600.jpg",
    imageSrcset:
      "/assets/images/679a27d9c65b974c2b51289a_8-600x600-p-500.jpg 500w, /assets/images/679a27d9c65b974c2b51289a_8-600x600.jpg 600w",
  },
  {
    slug: "ambika-necklace",
    name: "COIMBATORE HARAM",
    code: "KJG022",
    metal: "gold",
    category: "COIMBATORE HARAM",
    weight: "20g",
    purity: "91.6",
    description:
      "Embrace the timeless beauty of our Coimbatore Haram, a piece that beautifully blends traditional form with refined detailing. This long necklace features a graceful succession of golden mango motifs, each subtly accented with a vibrant gemstone, leading to a captivating central pendant. The intricate craftsmanship speaks volumes of heritage, creating a luxurious and elegant drape. Perfect for adding a touch of classic splendor to your most cherished moments, this piece is a true testament to artisanal brilliance.",
    image: "/assets/images/679a2bab09df585f1153e524_53-600x600.jpg",
    imageSrcset:
      "/assets/images/679a2bab09df585f1153e524_53-600x600-p-500.jpg 500w, /assets/images/679a2bab09df585f1153e524_53-600x600.jpg 600w",
  },
  {
    slug: "amrapali-necklace",
    name: "ANTIQUE HARAM",
    code: "KJG017",
    metal: "gold",
    category: "ANTIQUE HARAM",
    weight: "20g",
    purity: "91.6",
    description:
      "Embrace the timeless allure of our Antique Haram, a masterpiece reflecting heritage artistry. This exquisite necklace showcases a gracefully curved design, intricately etched with traditional motifs, creating a sense of enduring charm. Each circular setting cradles a rich, vibrant gemstone, adding a captivating depth of color. A delicate teardrop pendant completes this regal piece, promising to infuse your look with an air of classic elegance and sophistication.",
    image: "/assets/images/679a2da4f5c1f55b37458632_61-600x600.jpg",
    imageSrcset:
      "/assets/images/679a2da4f5c1f55b37458632_61-600x600-p-500.jpg 500w, /assets/images/679a2da4f5c1f55b37458632_61-600x600.jpg 600w",
  },
  {
    slug: "antique-ring-3",
    name: "CASTING RING",
    code: "KJG044",
    metal: "gold",
    category: "CASTING RING",
    weight: "4g",
    purity: "91.6",
    description:
      "Embrace delicate simplicity with our charming Casting Ring, a testament to understated elegance. This graceful piece features a subtle yet enchanting floral motif, meticulously crafted in radiant gold. The delicate design of the band intertwines beautifully, creating a fluid and feminine silhouette. Perfect for adding a touch of daily charm or as a thoughtful gift, this ring embodies refined style and enduring beauty, offering a touch of nature's grace to your hand.",
    image: "/assets/images/679a099d5e1865e0229fbfe7_17-600x600.jpg",
    imageSrcset:
      "/assets/images/679a099d5e1865e0229fbfe7_17-600x600-p-500.jpg 500w, /assets/images/679a099d5e1865e0229fbfe7_17-600x600.jpg 600w",
  },
  {
    slug: "antique-ring-4",
    name: "BOMBAY RING",
    code: "KJG043",
    metal: "gold",
    category: "BOMBAY RING",
    weight: "4g",
    purity: "91.6",
    description:
      "Adorn your hand with the captivating Bombay Ring, a magnificent display of intricate artistry. This grand circular piece features a meticulously detailed golden filigree center, surrounded by a halo of brilliant red and green gemstones. The outer edge is adorned with delicately crafted petal-like golden motifs, each cradling a vibrant red accent. This ring is designed to make a luxurious statement, embodying a timeless elegance and sophisticated charm that will truly stand out.",
    image: "/assets/images/679a09c63b3b13828850650a_10-600x600.jpg",
    imageSrcset:
      "/assets/images/679a09c63b3b13828850650a_10-600x600-p-500.jpg 500w, /assets/images/679a09c63b3b13828850650a_10-600x600.jpg 600w",
  },
  {
    slug: "antique-ring-5",
    name: "CULCUTTA RING",
    code: "KJG042",
    metal: "gold",
    category: "CULCUTTA RING",
    weight: "4g",
    purity: "91.6",
    description:
      "Presenting the elegant Culcutta Ring, a testament to refined golden craftsmanship. This striking piece features a sophisticated marquise shape, meticulously detailed with intricate patterns and delicate golden accents. The textured surface catches the light beautifully, creating a mesmerizing play of brilliance. Designed to make a subtle yet impactful statement, this ring is perfect for adding a touch of sophisticated charm to your everyday attire or for complementing a special occasion ensemble with its unique and graceful allure.",
    image: "/assets/images/679a09e73288ee175a02683f_7-600x600.jpg",
    imageSrcset:
      "/assets/images/679a09e73288ee175a02683f_7-600x600-p-500.jpg 500w, /assets/images/679a09e73288ee175a02683f_7-600x600.jpg 600w",
  },
  {
    slug: "antique-ring-6",
    name: "ANTIQUE ADJUSTABLE RING",
    code: "KJG041",
    metal: "gold",
    category: "ANTIQUE ADJUSTABLE RING",
    weight: "5g",
    purity: "91.6",
    description:
      "Discover the charm of our Antique Adjustable Ring, a beautifully crafted piece that blends traditional artistry with modern wearability. This exquisite ring features a prominent, intricately detailed golden top, adorned with delicate floral motifs and studded with vibrant gemstones that add a touch of rich color. Its adjustable design ensures a comfortable fit for any finger, making it a versatile and elegant accessory. Perfect for adding a touch of classic sophistication to your everyday style or special occasions.",
    image: "/assets/images/679a0a0e0667a0978a18b6a4_5-600x600.jpg",
    imageSrcset:
      "/assets/images/679a0a0e0667a0978a18b6a4_5-600x600-p-500.jpg 500w, /assets/images/679a0a0e0667a0978a18b6a4_5-600x600.jpg 600w",
  },
  {
    slug: "antique-ring-7",
    name: "STONE RING",
    code: "KJG040",
    metal: "gold",
    category: "STONE RING",
    weight: "5g",
    purity: "91.6",
    description:
      "Adorn your hand with this exquisite Stone Ring, a captivating blend of traditional craftsmanship and radiant beauty. At its heart lies a striking emerald-cut gemstone, surrounded by a halo of brilliant, pear-shaped accents that shimmer with every movement. The intricate golden filigree work around the edge adds a touch of delicate artistry. This elegant ring is a perfect statement piece, designed to add a touch of timeless sophistication and captivating sparkle to your everyday or special occasions.",
    image: "/assets/images/679a0a29d79392efb9e693b0_1-600x600.jpg",
    imageSrcset:
      "/assets/images/679a0a29d79392efb9e693b0_1-600x600-p-500.jpg 500w, /assets/images/679a0a29d79392efb9e693b0_1-600x600.jpg 600w",
  },
  {
    slug: "antique-ring-btmao",
    name: "ANTIQUE ADJUSTABLE RING",
    code: "KJG046",
    metal: "gold",
    category: "ANTIQUE ADJUSTABLE RING",
    weight: "3g",
    purity: "91.6",
    description:
      "Discover the intricate beauty of our Antique Adjustable Ring, a charming piece designed for timeless elegance. This ring features a beautifully detailed circular top, adorned with delicate golden beadwork and vibrant ruby-hued gemstones that create a captivating floral pattern. The adjustable band ensures a perfect fit, making it a versatile and cherished addition to any jewelry collection. It's an ideal accessory for adding a touch of traditional sophistication to your daily wear or special occasions.",
    image: "/assets/images/679a0756222d096c11c1d467_RING-600x600.jpg",
    imageSrcset:
      "/assets/images/679a0756222d096c11c1d467_RING-600x600-p-500.jpg 500w, /assets/images/679a0756222d096c11c1d467_RING-600x600.jpg 600w",
  },
  {
    slug: "antique-ring",
    name: "CASTING RING",
    code: "KJG045",
    metal: "gold",
    category: "CASTING RING",
    weight: "8g",
    purity: "91.6",
    description:
      "Embrace effortless charm with our delicate Casting Ring, a subtle yet captivating piece. This elegant ring features a graceful, fluid band that encircles a beautifully sculpted heart motif, adding a touch of romance to its design. The smooth, polished gold surface catches the light, creating a gentle shimmer. Perfect for everyday wear or as a heartfelt gift, this ring embodies understated elegance and enduring beauty, making it a cherished addition to any collection.",
    image: "/assets/images/679a09358611a7194720dec6_19-600x600.jpg",
    imageSrcset:
      "/assets/images/679a09358611a7194720dec6_19-600x600-p-500.jpg 500w, /assets/images/679a09358611a7194720dec6_19-600x600.jpg 600w",
  },
  {
    slug: "bahubali-bracelet-2",
    name: "BAHUBALI BRACELET",
    code: "KJG011",
    metal: "gold",
    category: "BAHUBALI BRACELET",
    weight: "5.5g",
    purity: "91.6",
    description:
      "Sleek and statement-making, this Bahubali bracelet is designed with signature interlocking links that bring boldness to your wrist. Its refined shine and structured form offer a perfect balance of tradition and trend—ideal for everyday elegance or festive flair.",
    image: "/assets/images/679b605f993db6a189bc16e1_110.png",
    imageSrcset:
      "/assets/images/679b605f993db6a189bc16e1_110-p-500.png 500w, /assets/images/679b605f993db6a189bc16e1_110-p-800.png 800w, /assets/images/679b605f993db6a189bc16e1_110-p-1080.png 1080w, /assets/images/679b605f993db6a189bc16e1_110-p-1600.png 1600w, /assets/images/679b605f993db6a189bc16e1_110-p-2000.png 2000w, /assets/images/679b605f993db6a189bc16e1_110.png 2048w",
  },
  {
    slug: "bahubali-bracelet",
    name: "BAHUBALI BRACELET",
    code: "KJG010",
    metal: "gold",
    category: "BAHUBALI BRACELET",
    weight: "6g",
    purity: "91.6",
    description:
      "Bold and commanding, the Bahubali bracelet features a classic Cuban link design crafted for those who appreciate timeless strength and style. With a smooth, polished finish and striking presence, this piece pairs perfectly with traditional attire or adds edge to a modern look.",
    image: "/assets/images/679b5f88cbdba4fdb6f457bc_103.png",
    imageSrcset:
      "/assets/images/679b5f88cbdba4fdb6f457bc_103-p-500.png 500w, /assets/images/679b5f88cbdba4fdb6f457bc_103-p-800.png 800w, /assets/images/679b5f88cbdba4fdb6f457bc_103-p-1080.png 1080w, /assets/images/679b5f88cbdba4fdb6f457bc_103-p-1600.png 1600w, /assets/images/679b5f88cbdba4fdb6f457bc_103-p-2000.png 2000w, /assets/images/679b5f88cbdba4fdb6f457bc_103.png 2048w",
  },
  {
    slug: "bangles-1",
    name: "BOMBAY BANGLES",
    code: "KJG078",
    metal: "gold",
    category: "BOMBAY BANGLES",
    weight: "48.28g",
    purity: "91.6",
    description:
      "Adorn your wrists with these exquisite Bombay Bangles, a perfect blend of classic elegance and intricate artistry. Each bangle features a beautifully polished golden surface, meticulously etched with delicate floral patterns and graceful vine motifs that encircle the entire piece. The detailed craftsmanship creates a subtle yet captivating shimmer, reflecting light with every movement. Ideal for both daily sophistication and special occasions, these bangles embody timeless beauty and refined charm, promising to be cherished additions to your collection.",
    image: "/assets/images/675fc18786b0e90abad93378_Frame%202085665115.png",
    imageSrcset:
      "/assets/images/675fc18786b0e90abad93378_Frame%202085665115-p-500.png 500w, /assets/images/675fc18786b0e90abad93378_Frame%202085665115-p-800.png 800w, /assets/images/675fc18786b0e90abad93378_Frame%202085665115-p-1080.png 1080w, /assets/images/675fc18786b0e90abad93378_Frame%202085665115.png 1136w",
  },
  {
    slug: "bangles-2",
    name: "COIMBATORE BANGLES",
    code: "KJG075",
    metal: "gold",
    category: "COIMBATORE BANGLES",
    weight: "35.68g",
    purity: "91.6",
    description:
      "Adorn your wrists with these captivating Coimbatore Bangles, a vibrant fusion of traditional design and sparkling elegance. Each bangle is meticulously crafted in radiant gold, featuring a series of exquisite settings alternately showcasing brilliant red and lush green gemstones. The smooth, polished surface and the thoughtful placement of stones create a dazzling play of color and light. Perfect for adding a touch of festive glamour to any ensemble, these bangles embody a rich heritage of artistry and timeless beauty, promising to be cherished additions to your collection.",
    image: "/assets/images/675fc02cd3c4e45185790712_Frame%202085664971.png",
    imageSrcset:
      "/assets/images/675fc02cd3c4e45185790712_Frame%202085664971-p-500.png 500w, /assets/images/675fc02cd3c4e45185790712_Frame%202085664971-p-800.png 800w, /assets/images/675fc02cd3c4e45185790712_Frame%202085664971-p-1080.png 1080w, /assets/images/675fc02cd3c4e45185790712_Frame%202085664971.png 1136w",
  },
  {
    slug: "bangles1",
    name: "BOMBAY BANGLES",
    code: "KJG074",
    metal: "gold",
    category: "BOMBAY BANGLES",
    weight: "19.82g",
    purity: "91.6",
    description:
      "Adorn your wrists with these elegant Bombay Bangles, a timeless pair that exudes subtle sophistication. Each bangle features a continuous array of delicate golden beads, meticulously crafted to create a shimmering, textured surface that catches the light beautifully. Designed for comfortable wear, these bangles are perfect for adding a touch of classic charm to your everyday attire or for complementing a festive ensemble with their refined simplicity. They embody enduring beauty and understated luxury, promising to be cherished additions to your collection.",
    image: "/assets/images/675fbff9487e6c15b1fa0bb1_Frame%202085665017.png",
    imageSrcset:
      "/assets/images/675fbff9487e6c15b1fa0bb1_Frame%202085665017.png 600w",
  },
  {
    slug: "bengali-bangles-2",
    name: "BENGALI BANGLES",
    code: "KJG008",
    metal: "gold",
    category: "BENGALI BANGLES",
    weight: "24g",
    purity: "91.6",
    description:
      "Rooted in regional charm, this Bengali bangle reflects intricate texture work and signature motifs that speak to tradition. With a bold, structured finish and refined detailing, it offers timeless elegance in a single statement piece—ideal for both cultural moments and contemporary styling.",
    image: "/assets/images/679b6195d98fff7fb43d4fd9_3-600x600.jpg",
    imageSrcset:
      "/assets/images/679b6195d98fff7fb43d4fd9_3-600x600-p-500.jpg 500w, /assets/images/679b6195d98fff7fb43d4fd9_3-600x600.jpg 600w",
  },
  {
    slug: "bengali-haram-2",
    name: "BENGALI HARAM",
    code: "KJG013",
    metal: "gold",
    category: "BENGALI HARAM",
    weight: "22g",
    purity: "91.6",
    description:
      "This exquisite Bengali Haram embodies timeless grace, meticulously crafted to adorn your décolletage with traditional charm. Each intricate golden motif is thoughtfully designed, hinting at classic heritage while offering a touch of modern sophistication. Delicately set gemstones add a captivating sparkle, making this piece a stunning statement for any occasion. It's a true testament to artisanal brilliance, promising to elevate your elegance.",
    image: "/assets/images/679b603ccbdba4fdb6f52e64_86-600x600.jpg",
    imageSrcset:
      "/assets/images/679b603ccbdba4fdb6f52e64_86-600x600-p-500.jpg 500w, /assets/images/679b603ccbdba4fdb6f52e64_86-600x600.jpg 600w",
  },
  {
    slug: "bombay-bangle-t5oh5",
    name: "BOMBAY BANGLES",
    code: "KJG004",
    metal: "gold",
    category: "BOMBAY BANGLES",
    weight: "32g",
    purity: "91.6",
    description:
      "Designed for festive finesse, these Bombay bangles blend traditional charm with bold ruby-hued accents. The intricate patterns and pop of red make them a perfect companion to your celebration wardrobe—vibrant, elegant, and effortlessly captivating.",
    image: "/assets/images/679b6298288cad7a50f2a5d6_18-600x600.jpg",
    imageSrcset:
      "/assets/images/679b6298288cad7a50f2a5d6_18-600x600-p-500.jpg 500w, /assets/images/679b6298288cad7a50f2a5d6_18-600x600.jpg 600w",
  },
  {
    slug: "bombay-bangle",
    name: "BOMBAY BANGLES",
    code: "KJG002",
    metal: "gold",
    category: "BOMBAY BANGLES",
    weight: "48g",
    purity: "91.6",
    description:
      "Bold, detailed, and rich in tradition — this Bombay bangle features intricate latticework with hints of earthy enamel tones. A true heritage piece, it captures the vibrance of classic Indian design while adding a regal touch to your jewellery collection. Perfect for festive wear or gifting with grace.",
    image: "/assets/images/679b6317d66ca46f3757f892_26-600x600.jpg",
    imageSrcset:
      "/assets/images/679b6317d66ca46f3757f892_26-600x600-p-500.jpg 500w, /assets/images/679b6317d66ca46f3757f892_26-600x600.jpg 600w",
  },
  {
    slug: "bombay-bangles-2",
    name: "BOMBAY BANGLES",
    code: "KJG007",
    metal: "gold",
    category: "BOMBAY BANGLES",
    weight: "40g",
    purity: "91.6",
    description:
      "Minimal yet meaningful, this classic Bombay bangle set blends traditional craftsmanship with timeless design. Accented with delicate floral motifs and a satin finish, this versatile piece transitions seamlessly from everyday wear to festive occasions with effortless charm.",
    image: "/assets/images/679b61d992ea3379975573f5_4%20(2)-600x600.jpg",
    imageSrcset:
      "/assets/images/679b61d992ea3379975573f5_4%20(2)-600x600-p-500.jpg 500w, /assets/images/679b61d992ea3379975573f5_4%20(2)-600x600.jpg 600w",
  },
  {
    slug: "bombay-bangles",
    name: "BOMBAY BANGLES",
    code: "KJG006",
    metal: "gold",
    category: "BOMBAY BANGLES",
    weight: "32g",
    purity: "91.6",
    description:
      "Radiating timeless charm, these Bombay bangles captivate with their polished diamond-cut texture and refined symmetry. Designed to shimmer with every movement, this elegant pair brings a perfect balance of subtle sparkle and classic sophistication to your everyday and festive looks.",
    image: "/assets/images/679b620d1061038f83d255bd_10-600x600.jpg",
    imageSrcset:
      "/assets/images/679b620d1061038f83d255bd_10-600x600-p-500.jpg 500w, /assets/images/679b620d1061038f83d255bd_10-600x600.jpg 600w",
  },
  {
    slug: "bracelet-1",
    name: "ANTIQUE JIMMIKI",
    code: "KJG082",
    metal: "gold",
    category: "ANTIQUE JIMMIKI",
    weight: "14g",
    purity: "22K",
    description:
      "These exquisite Antique Jimmiki earrings are a captivating blend of traditional design and vibrant elegance. Each earring features a beautifully detailed golden disc top, adorned with a floral motif, from which suspends a miniature jhumka. The jhumka is intricately designed with a golden framework, showcasing lush green and delicate ruby-hued gemstones, and is finished with a cascade of shimmering pearl drops. Perfect for both festive occasions and adding a refined touch to everyday wear, these earrings embody timeless grace and meticulous craftsmanship.",
    image: "/assets/images/675fc2264f81bca0584587a6_Frame%202085664973.png",
    imageSrcset:
      "/assets/images/675fc2264f81bca0584587a6_Frame%202085664973-p-500.png 500w, /assets/images/675fc2264f81bca0584587a6_Frame%202085664973-p-800.png 800w, /assets/images/675fc2264f81bca0584587a6_Frame%202085664973-p-1080.png 1080w, /assets/images/675fc2264f81bca0584587a6_Frame%202085664973.png 1136w",
  },
  {
    slug: "bracelet-2",
    name: "BOMBAY BANGLES",
    code: "KJG081",
    metal: "gold",
    category: "BOMBAY BANGLES",
    weight: "25.92g",
    purity: "91.6",
    description:
      "Adorn your wrists with these elegant Bombay Bangles, a timeless pair that exudes subtle sophistication. Each bangle features a sleek, polished golden surface, meticulously crafted with delicate linear textures that catch the light beautifully. Designed for comfortable wear, these bangles are perfect for adding a touch of classic charm to your everyday attire or for complementing a festive ensemble with their refined simplicity. They embody enduring beauty and understated luxury, promising to be cherished additions to your collection.",
    image: "/assets/images/675fc2040ad919481206c08d_Frame%202085664974.png",
    imageSrcset:
      "/assets/images/675fc2040ad919481206c08d_Frame%202085664974-p-500.png 500w, /assets/images/675fc2040ad919481206c08d_Frame%202085664974-p-800.png 800w, /assets/images/675fc2040ad919481206c08d_Frame%202085664974-p-1080.png 1080w, /assets/images/675fc2040ad919481206c08d_Frame%202085664974.png 1136w",
  },
  {
    slug: "bracelet-3",
    name: "KERALA BANGLES",
    code: "KJG080",
    metal: "gold",
    category: "KERALA BANGLES",
    weight: "36.58g",
    purity: "91.6",
    description:
      "Adorn your wrists with these classic Kerala Bangles, a harmonious blend of simplicity and traditional charm. This set of golden bangles features a subtle yet elegant textured surface, creating a delicate interplay of light with every movement. Designed for comfortable wear, these bangles are perfect for adding a touch of traditional sophistication to your everyday attire or for complementing a festive ensemble with their refined simplicity. They embody enduring beauty and understated luxury, promising to be cherished additions to your collection.",
    image: "/assets/images/675fc1d9021eb64b9c2296dd_Frame%202085665017-1.png",
    imageSrcset:
      "/assets/images/675fc1d9021eb64b9c2296dd_Frame%202085665017-1-p-500.png 500w, /assets/images/675fc1d9021eb64b9c2296dd_Frame%202085665017-1-p-800.png 800w, /assets/images/675fc1d9021eb64b9c2296dd_Frame%202085665017-1-p-1080.png 1080w, /assets/images/675fc1d9021eb64b9c2296dd_Frame%202085665017-1.png 1136w",
  },
  {
    slug: "bracelet-4",
    name: "BENGALI BANGLES",
    code: "KJG079",
    metal: "gold",
    category: "BENGALI BANGLES",
    weight: "49.90g",
    purity: "91.6",
    description:
      "Adorn your wrists with these captivating Bengali Bangles, a testament to intricate design and fluid elegance. Each bangle features a beautifully sculpted golden band with graceful undulations and delicate cut-out patterns, creating a mesmerizing interplay of light and shadow. The design is further enhanced by subtle, sparkling accents, adding a touch of sophisticated allure. Perfect for both festive occasions and adding a refined touch to everyday wear, these bangles embody timeless beauty and meticulous craftsmanship, promising to make a distinctive statement.",
    image: "/assets/images/675fc1baa23998da10edcc6c_Frame%202085665018.png",
    imageSrcset:
      "/assets/images/675fc1baa23998da10edcc6c_Frame%202085665018-p-500.png 500w, /assets/images/675fc1baa23998da10edcc6c_Frame%202085665018-p-800.png 800w, /assets/images/675fc1baa23998da10edcc6c_Frame%202085665018-p-1080.png 1080w, /assets/images/675fc1baa23998da10edcc6c_Frame%202085665018.png 1136w",
  },
  {
    slug: "bracelet-5",
    name: "Intricate Flate Mens Bracelet",
    code: "KJG094",
    metal: "gold",
    category: "Intricate Flate Mens Bracelet",
    weight: "",
    purity: "91.6",
    description:
      "This striking gold bracelet is a bold expression of strength and sophistication. Featuring a seamless arrangement of finely sculpted square links, each panel reflects masterful craftsmanship and precision. Its rich golden hue exudes timeless elegance, while the structured design lends a modern, masculine edge. Ideal for both ceremonial wear and everyday distinction, this bracelet is a powerful symbol of tradition redefined with contemporary flair. Meticulously crafted to make a lasting impression, it's more than an accessory—it's a statement of refined confidence.",
    image: "/assets/images/676276ba1d8b8accb3422bd2_white%20jewel%205.png",
    imageSrcset:
      "/assets/images/676276ba1d8b8accb3422bd2_white%20jewel%205-p-500.png 500w, /assets/images/676276ba1d8b8accb3422bd2_white%20jewel%205-p-800.png 800w, /assets/images/676276ba1d8b8accb3422bd2_white%20jewel%205-p-1080.png 1080w, /assets/images/676276ba1d8b8accb3422bd2_white%20jewel%205-p-1600.png 1600w, /assets/images/676276ba1d8b8accb3422bd2_white%20jewel%205-p-2000.png 2000w, /assets/images/676276ba1d8b8accb3422bd2_white%20jewel%205.png 2048w",
  },
  {
    slug: "chandani-necklace",
    name: "RAJKOT FANCY NECKLACE",
    code: "KJG024",
    metal: "gold",
    category: "RAJKOT FANCY NECKLACE",
    weight: "20g",
    purity: "91.6",
    description:
      "Introducing the contemporary charm of our Rajkot Fancy necklace, a modern twist on classic elegance. This captivating piece features a delicate golden chain leading to a striking circular pendant, artfully designed with intricate detailing and shimmering accents. A graceful teardrop element suspends below, adding a touch of fluid beauty. This exquisite necklace is perfect for daily wear or adding subtle sophistication to any ensemble, embodying understated luxury and refined design.",
    image: "/assets/images/679a2b04cf100fcd7689e627_49-600x600.jpg",
    imageSrcset:
      "/assets/images/679a2b04cf100fcd7689e627_49-600x600-p-500.jpg 500w, /assets/images/679a2b04cf100fcd7689e627_49-600x600.jpg 600w",
  },
  {
    slug: "culcutta-bangle-1",
    name: "CULCUTTA BANGLES",
    code: "KJG005",
    metal: "gold",
    category: "CULCUTTA BANGLES",
    weight: "48g",
    purity: "91.6",
    description:
      "A regal expression of heritage, these Culcutta bangles feature intricate granulation detailing with paisley-inspired motifs and rich red accents. Crafted to radiate timeless beauty, they make for a graceful heirloom addition to your festive and traditional ensembles.",
    image: "/assets/images/679b62502b74b7053b66e68c_12-600x600.jpg",
    imageSrcset:
      "/assets/images/679b62502b74b7053b66e68c_12-600x600-p-500.jpg 500w, /assets/images/679b62502b74b7053b66e68c_12-600x600.jpg 600w",
  },
  {
    slug: "culcutta-bangle",
    name: "CULCUTTA BANGLES",
    code: "KJG003",
    metal: "gold",
    category: "CULCUTTA BANGLES",
    weight: "40g",
    purity: "91.6",
    description:
      "A modern classic with a dazzling twist, these Culcutta bangles shimmer with fine hand-cut texture work that captures light from every angle. Perfectly balanced in form and finish, they bring effortless glamour to both everyday style and festive looks. A statement of subtle luxury.",
    image: "/assets/images/679b62c392ea3379975692a6_19-600x600.jpg",
    imageSrcset:
      "/assets/images/679b62c392ea3379975692a6_19-600x600-p-500.jpg 500w, /assets/images/679b62c392ea3379975692a6_19-600x600.jpg 600w",
  },
  {
    slug: "divya-prabha-necklace",
    name: "BENGALI HARAM",
    code: "KJG014",
    metal: "gold",
    category: "BENGALI HARAM",
    weight: "20g",
    purity: "91.6",
    description:
      "This resplendent Bengali Haram is a symphony of intricate artistry and classic design, a true masterpiece for the discerning. Its grand central pendant, adorned with radiant accents, commands attention, reflecting the rich heritage of traditional craftsmanship. This piece is designed to be cherished, offering a luxurious drape that beautifully complements any attire, making every moment an occasion to shine with unparalleled grace.",
    image: "/assets/images/679a2f8c470c92cef1f4398a_83-600x600.jpg",
    imageSrcset:
      "/assets/images/679a2f8c470c92cef1f4398a_83-600x600-p-500.jpg 500w, /assets/images/679a2f8c470c92cef1f4398a_83-600x600.jpg 600w",
  },
  {
    slug: "earrings-1",
    name: "COIMBATORE JIMMIKI",
    code: "KJG090",
    metal: "gold",
    category: "COIMBATORE JIMMIKI",
    weight: "8g",
    purity: "91.6",
    description:
      "These exquisite Coimbatore Jimmiki earrings are a captivating blend of traditional grandeur and vibrant elegance. Each earring features a beautifully detailed golden floral top, adorned with intricate beadwork and a prominent ruby-hued gemstone. From this exquisite top, a gracefully flared jhumka suspends, intricately designed with traditional motifs and finished with a cascade of delicate golden drops. Perfect for festive occasions and grand celebrations, these earrings embody timeless beauty and meticulous craftsmanship, promising to make a distinctive and regal statement.",
    image: "/assets/images/675fc315d3c4e451857b978c_Frame%202085665031.png",
    imageSrcset:
      "/assets/images/675fc315d3c4e451857b978c_Frame%202085665031-p-500.png 500w, /assets/images/675fc315d3c4e451857b978c_Frame%202085665031-p-800.png 800w, /assets/images/675fc315d3c4e451857b978c_Frame%202085665031-p-1080.png 1080w, /assets/images/675fc315d3c4e451857b978c_Frame%202085665031.png 1136w",
  },
  {
    slug: "earrings-2",
    name: "COIMBATORE JIMMIKI",
    code: "KJG089",
    metal: "gold",
    category: "COIMBATORE JIMMIKI",
    weight: "14g",
    purity: "91.6",
    description:
      "These exquisite Coimbatore Jimmiki earrings are a testament to intricate craftsmanship and traditional charm. Each earring features a delicate golden disc top, adorned with a subtle floral motif, from which suspends a beautifully flared jhumka. The jhumka is meticulously crafted with layers of intricate golden filigree and delicate beadwork, creating a mesmerizing play of light and texture. Perfect for both festive occasions and adding a refined touch to everyday wear, these earrings embody timeless beauty and meticulous artistry, promising to captivate with every turn.",
    image: "/assets/images/675fc30266f2aa68ab1e06dd_Frame%202085665029.png",
    imageSrcset:
      "/assets/images/675fc30266f2aa68ab1e06dd_Frame%202085665029-p-500.png 500w, /assets/images/675fc30266f2aa68ab1e06dd_Frame%202085665029-p-800.png 800w, /assets/images/675fc30266f2aa68ab1e06dd_Frame%202085665029-p-1080.png 1080w, /assets/images/675fc30266f2aa68ab1e06dd_Frame%202085665029.png 1136w",
  },
  {
    slug: "earrings-3",
    name: "CASTING DROP EARRINGS",
    code: "KJG088",
    metal: "gold",
    category: "CASTING DROP EARRINGS",
    weight: "8g",
    purity: "91.6",
    description:
      "These exquisite Casting Drop earrings are a magnificent blend of intricate design and vibrant elegance. Each earring features a beautifully sculpted floral top, adorned with delicate gemstones that add a touch of sparkle. From this elegant top, a gracefully flared jhumka suspends, intricately designed with traditional motifs and finished with a cascade of delicate golden chains and drops. Perfect for festive occasions and grand celebrations, these earrings embody timeless beauty and meticulous craftsmanship, promising to make a distinctive and regal statement.",
    image: "/assets/images/675fc2ea6bca2823ab7ff07d_Frame%202085665027.png",
    imageSrcset:
      "/assets/images/675fc2ea6bca2823ab7ff07d_Frame%202085665027-p-500.png 500w, /assets/images/675fc2ea6bca2823ab7ff07d_Frame%202085665027-p-800.png 800w, /assets/images/675fc2ea6bca2823ab7ff07d_Frame%202085665027-p-1080.png 1080w, /assets/images/675fc2ea6bca2823ab7ff07d_Frame%202085665027.png 1136w",
  },
  {
    slug: "earrings-4",
    name: "COIMBATORE JIMMIKI",
    code: "KJG087",
    metal: "gold",
    category: "COIMBATORE JIMMIKI",
    weight: "7g",
    purity: "91.6",
    description:
      "These exquisite Coimbatore Jimmiki earrings are a captivating blend of traditional grandeur and vibrant elegance. Each earring features a beautifully detailed golden floral top, adorned with intricate beadwork and prominent ruby-hued gemstones that form a dazzling cluster. From this exquisite top, a gracefully flared jhumka suspends, intricately designed with traditional motifs and finished with a cascade of delicate golden drops. Perfect for festive occasions and grand celebrations, these earrings embody timeless beauty and meticulous craftsmanship, promising to make a distinctive and regal statement.",
    image: "/assets/images/675fc2d040cb31258256409d_Frame%202085665026.png",
    imageSrcset:
      "/assets/images/675fc2d040cb31258256409d_Frame%202085665026-p-500.png 500w, /assets/images/675fc2d040cb31258256409d_Frame%202085665026-p-800.png 800w, /assets/images/675fc2d040cb31258256409d_Frame%202085665026-p-1080.png 1080w, /assets/images/675fc2d040cb31258256409d_Frame%202085665026.png 1136w",
  },
  {
    slug: "earrings-5",
    name: "COIMBATORE JIMMIKI",
    code: "KJG083",
    metal: "gold",
    category: "COIMBATORE JIMMIKI",
    weight: "12g",
    purity: "91.6",
    description:
      "These exquisite Coimbatore Jimmiki earrings are a testament to intricate craftsmanship and traditional charm. Each earring features a delicate floral top, from which suspends a gracefully flared jhumka adorned with meticulous golden patterns and subtle details. A petite golden drop dangles from the base, adding a touch of elegant movement. Perfect for both festive occasions and adding a refined touch to everyday wear, these earrings embody timeless beauty and meticulous artistry, promising to captivate with every turn.",
    image: "/assets/images/675fc25d2f46c1502036ce31_Frame%202085665021.png",
    imageSrcset:
      "/assets/images/675fc25d2f46c1502036ce31_Frame%202085665021-p-500.png 500w, /assets/images/675fc25d2f46c1502036ce31_Frame%202085665021-p-800.png 800w, /assets/images/675fc25d2f46c1502036ce31_Frame%202085665021-p-1080.png 1080w, /assets/images/675fc25d2f46c1502036ce31_Frame%202085665021.png 1136w",
  },
  {
    slug: "earrings-6",
    name: "BENGALI STUD EARRINGS",
    code: "KJG066",
    metal: "gold",
    category: "BENGALI STUD EARRINGS",
    weight: "8g",
    purity: "91.6",
    description:
      "These exquisite Bengali Stud earrings are a harmonious blend of traditional charm and intricate design. Each earring features a delicate floral top, from which suspends a gracefully crafted circular motif, adorned with fine golden filigree work. A subtle teardrop element dangles within the circle, adding a touch of elegant movement. Perfect for both festive occasions and adding a refined touch to everyday wear, these earrings embody timeless beauty and meticulous craftsmanship.",
    image: "/assets/images/676e45f4e23b1b93367da69f_jewel%2019-12%202.png",
    imageSrcset:
      "/assets/images/676e45f4e23b1b93367da69f_jewel%2019-12%202-p-500.png 500w, /assets/images/676e45f4e23b1b93367da69f_jewel%2019-12%202-p-800.png 800w, /assets/images/676e45f4e23b1b93367da69f_jewel%2019-12%202-p-1080.png 1080w, /assets/images/676e45f4e23b1b93367da69f_jewel%2019-12%202-p-1600.png 1600w, /assets/images/676e45f4e23b1b93367da69f_jewel%2019-12%202-p-2000.png 2000w, /assets/images/676e45f4e23b1b93367da69f_jewel%2019-12%202.png 2048w",
  },
  {
    slug: "earrings-7",
    name: "BENGALI STUD",
    code: "KJG065",
    metal: "gold",
    category: "BENGALI STUD",
    weight: "8g",
    purity: "91.6",
    description:
      "These exquisite Bengali Stud earrings are a captivating blend of traditional design and artistic flair. Each earring features a beautifully textured golden teardrop top, from which suspends a larger, intricately detailed leaf-like motif adorned with delicate golden beadwork. The design tapers gracefully, creating a stunning sense of movement and depth. Perfect for adding a touch of sophisticated charm to any ensemble, these earrings embody timeless elegance and meticulous craftsmanship.",
    image: "/assets/images/676e46051a386a12576bcdea_01%20(1).png",
    imageSrcset:
      "/assets/images/676e46051a386a12576bcdea_01%20(1)-p-500.png 500w, /assets/images/676e46051a386a12576bcdea_01%20(1)-p-800.png 800w, /assets/images/676e46051a386a12576bcdea_01%20(1)-p-1080.png 1080w, /assets/images/676e46051a386a12576bcdea_01%20(1)-p-1600.png 1600w, /assets/images/676e46051a386a12576bcdea_01%20(1)-p-2000.png 2000w, /assets/images/676e46051a386a12576bcdea_01%20(1).png 2048w",
  },
  {
    slug: "gold-ball-beaded-cascade-necklace",
    name: "BENGALI FANCY NECKLACE",
    code: "KJG016",
    metal: "gold",
    category: "BENGALI FANCY NECKLACE",
    weight: "20g",
    purity: "91.6",
    description:
      "This necklace features multiple strands of gleaming gold beads, creating a beautiful cascade effect. The varying lengths of the strands add depth and movement, making it a versatile piece that can be worn for both casual and formal occasions.  The warm, rich tone of the gold adds a touch of classic elegance",
    image: "/assets/images/679a2de0c41718bb1992aa6a_75-600x600.jpg",
    imageSrcset:
      "/assets/images/679a2de0c41718bb1992aa6a_75-600x600-p-500.jpg 500w, /assets/images/679a2de0c41718bb1992aa6a_75-600x600.jpg 600w",
  },
  {
    slug: "indrajaal-necklace",
    name: "BOMBAY FANCY NECKLACE",
    code: "KJG031",
    metal: "gold",
    category: "BOMBAY FANCY NECKLACE",
    weight: "20g",
    purity: "91.6",
    description:
      "This Bombay Fancy necklace is a captivating blend of traditional charm and intricate detailing. Each golden motif is meticulously crafted, adorned with vibrant red accents and delicate pearls, creating a rich tapestry of design. The piece drapes elegantly, offering a graceful silhouette that enhances any neckline. Perfect for adding a touch of sophisticated glamour to both festive occasions and everyday elegance, this necklace is a true testament to timeless artistry and refined beauty.",
    image: "/assets/images/679a2868982d955426af242b_12-600x600.jpg",
    imageSrcset:
      "/assets/images/679a2868982d955426af242b_12-600x600-p-500.jpg 500w, /assets/images/679a2868982d955426af242b_12-600x600.jpg 600w",
  },
  {
    slug: "jyotsna-necklace",
    name: "BENGALI FANCY NECKLACE",
    code: "KJG026",
    metal: "gold",
    category: "BENGALI FANCY NECKLACE",
    weight: "20g",
    purity: "91.6",
    description:
      "This stunning Bengali Fancy necklace is a testament to intricate design and vibrant elegance. A delicate golden chain leads to a magnificent circular pendant, intricately textured with fine golden work and adorned with brilliant, contrasting gemstones. Smaller spheres gracefully dangle from the base, adding delightful movement. Perfect for adding a sophisticated touch to any occasion, this piece effortlessly blends traditional charm with a captivating contemporary allure, promising to dazzle.",
    image: "/assets/images/679a2a13e21f615a95ac6411_30-600x600.jpg",
    imageSrcset:
      "/assets/images/679a2a13e21f615a95ac6411_30-600x600-p-500.jpg 500w, /assets/images/679a2a13e21f615a95ac6411_30-600x600.jpg 600w",
  },
  {
    slug: "kausalya-necklace",
    name: "BENGALI FANCY NECKLACE",
    code: "KJG025",
    metal: "gold",
    category: "BENGALI FANCY NECKLACE",
    weight: "20g",
    purity: "91.6",
    description:
      "Embrace the grand elegance of our Bengali Fancy necklace, a truly magnificent piece designed to make a statement. Its beautifully structured chain leads to a stunning, intricately detailed central pendant, reflecting the rich artistry of traditional design. Delicate drops cascade from the pendant, adding graceful movement and sparkle. This exquisite necklace is a testament to refined craftsmanship, perfect for adorning your most celebrated occasions with an air of sophisticated luxury and timeless charm.",
    image: "/assets/images/679a2a855ec3436aa7a603c5_33-600x600.jpg",
    imageSrcset:
      "/assets/images/679a2a855ec3436aa7a603c5_33-600x600-p-500.jpg 500w, /assets/images/679a2a855ec3436aa7a603c5_33-600x600.jpg 600w",
  },
  {
    slug: "kerala-bangles",
    name: "KERALA BANGLES",
    code: "KJG009",
    metal: "gold",
    category: "KERALA BANGLES",
    weight: "32g",
    purity: "91.6",
    description:
      "Inspired by traditional South Indian artistry, these Kerala bangles feature delicate detailing with a blend of textured finishes and polished accents. The rhythmic placement of beads adds depth while retaining an airy, graceful structure—perfect for elevating everyday looks or accenting festive attire.",
    image: "/assets/images/679b612b0eb1bbc8ac3adbe5_2-600x600.jpg",
    imageSrcset:
      "/assets/images/679b612b0eb1bbc8ac3adbe5_2-600x600-p-500.jpg 500w, /assets/images/679b612b0eb1bbc8ac3adbe5_2-600x600.jpg 600w",
  },
  {
    slug: "lakshmi-haar",
    name: "KASUMALAI",
    code: "KJG018",
    metal: "gold",
    category: "KASUMALAI",
    weight: "20g",
    purity: "91.6",
    description:
      "Behold the exquisite Kasumalai, a testament to South Indian heritage. This timeless necklace features a captivating cascade of golden coins, each meticulously crafted to perfection. The central pendant, richly detailed and adorned with brilliant gemstones, creates a magnificent focal point. Designed to drape elegantly, this piece exudes traditional charm and sophisticated allure, making it a perfect embodiment of grace for any grand occasion.",
    image: "/assets/images/679a2d6ccb859b7300ed919f_60-600x600.jpg",
    imageSrcset:
      "/assets/images/679a2d6ccb859b7300ed919f_60-600x600-p-500.jpg 500w, /assets/images/679a2d6ccb859b7300ed919f_60-600x600.jpg 600w",
  },
  {
    slug: "mallika-necklace",
    name: "MANGO NECKLACE",
    code: "KJG029",
    metal: "gold",
    category: "MANGO NECKLACE",
    weight: "20g",
    purity: "91.6",
    description:
      "Presenting the delightful Mango Necklace, a charming tribute to traditional design and artisanal grace. This exquisite piece features a continuous array of beautifully crafted golden mango motifs, each subtly enhanced with a shimmering gemstone, creating a vibrant display of color and texture. Designed to gracefully adorn your neckline, this necklace exudes a classic elegance that is perfect for both everyday sophistication and special celebrations, truly embodying timeless beauty.",
    image: "/assets/images/679a2916ad251a4f12a5016c_20-600x600.jpg",
    imageSrcset:
      "/assets/images/679a2916ad251a4f12a5016c_20-600x600-p-500.jpg 500w, /assets/images/679a2916ad251a4f12a5016c_20-600x600.jpg 600w",
  },
  {
    slug: "manasa-necklace-copy",
    name: "RAJKOT NECKLACE",
    code: "KJG021",
    metal: "gold",
    category: "RAJKOT NECKLACE",
    weight: "20g",
    purity: "91.6",
    description:
      "Discover the contemporary elegance of our Rajkot Necklace, a fusion of sleek design and traditional allure. This captivating piece features a smooth golden band from which delicate golden discs, intricately cut with enchanting patterns, gracefully suspend. Accentuated by vibrant green and clear gemstones, it creates a striking visual harmony. Perfect for a modern aesthetic yet rooted in exquisite craftsmanship, this necklace is designed to make a sophisticated statement.",
    image: "/assets/images/679a2c028ee3ec3b22fc438a_57(1)-600x600.jpg",
    imageSrcset:
      "/assets/images/679a2c028ee3ec3b22fc438a_57(1)-600x600-p-500.jpg 500w, /assets/images/679a2c028ee3ec3b22fc438a_57(1)-600x600.jpg 600w",
  },
  {
    slug: "mayura-necklace",
    name: "BOMBAY CHOKER",
    code: "KJG023",
    metal: "gold",
    category: "BOMBAY CHOKER",
    weight: "20g",
    purity: "91.6",
    description:
      "Adorn your neckline with the majestic Bombay Choker, a testament to opulent artistry and captivating design. This exquisite piece boasts a broad, intricately textured band, featuring graceful peacock motifs at its heart. Delicately set gemstones add a touch of vibrant sparkle, enhancing its regal charm. Perfect for making a grand statement, this choker beautifully blends traditional Indian grandeur with a sophisticated silhouette, designed to elevate any celebratory ensemble with unparalleled elegance.",
    image: "/assets/images/679a2b37588e45f5bded5674_52-600x600.jpg",
    imageSrcset:
      "/assets/images/679a2b37588e45f5bded5674_52-600x600-p-500.jpg 500w, /assets/images/679a2b37588e45f5bded5674_52-600x600.jpg 600w",
  },
  {
    slug: "meshwork-gold-choker",
    name: "BENGALI CHOKER",
    code: "KJG035",
    metal: "gold",
    category: "BENGALI CHOKER",
    weight: "20g",
    purity: "91.6",
    description:
      "This magnificent Bengali Choker is a celebration of intricate artistry and vibrant splendor. Its finely detailed golden band is adorned with delicate floral patterns and sparkling gemstones, creating a captivating display. A central, exquisite flower motif, richly embellished, leads to a graceful drop pendant, enhancing its regal charm. With its luxurious design and meticulous craftsmanship, this choker is destined to elevate your most special occasions, embodying a perfect blend of tradition and sophisticated elegance.",
    image: "/assets/images/679a2696a7a6cff6df778a1c_5-600x600.jpg",
    imageSrcset:
      "/assets/images/679a2696a7a6cff6df778a1c_5-600x600-p-500.jpg 500w, /assets/images/679a2696a7a6cff6df778a1c_5-600x600.jpg 600w",
  },
  {
    slug: "necklace-1-10",
    name: "FANCY NECKLACE",
    code: "KJG039",
    metal: "gold",
    category: "FANCY NECKLACE",
    weight: "20g",
    purity: "91.6",
    description:
      "This exquisite Fancy Necklace is a celebration of vibrant colors and sophisticated design. A delicate golden chain leads to a stunning array of multicolored gemstones, each set within an elegant golden circle. A grand, intricately detailed circular pendant with a floral motif and a graceful drop adds a captivating focal point. Perfect for adding a modern yet traditionally inspired touch, this necklace is designed to illuminate your style with its unique blend of artistry and charm.",
    image: "/assets/images/679a1fadf88ab9914d42a8f7_1-600x600.jpg",
    imageSrcset:
      "/assets/images/679a1fadf88ab9914d42a8f7_1-600x600-p-500.jpg 500w, /assets/images/679a1fadf88ab9914d42a8f7_1-600x600.jpg 600w",
  },
  {
    slug: "necklace-10",
    name: "Ruby Necklace",
    code: "KJG093",
    metal: "gold",
    category: "Ruby Necklace",
    weight: "",
    purity: "91.6",
    description:
      "This magnificent temple-style necklace is a radiant tribute to tradition and grandeur. Crafted in gleaming gold, it features triple strands of vivid ruby-pink stones that exude regal charm. The centerpiece showcases intricate Lakshmi motifs, symbolizing prosperity and grace, with a single pearl drop adding a touch of delicate elegance. Perfect for weddings and festive occasions, this heirloom-worthy piece blends divine artistry with timeless allure—designed to captivate hearts and command attention with every graceful movement. A legacy, reimagined in gold.",
    image: "/assets/images/676e46297f91e841d90d045b_jewel%2019-12%20(1).png",
    imageSrcset:
      "/assets/images/676e46297f91e841d90d045b_jewel%2019-12%20(1)-p-500.png 500w, /assets/images/676e46297f91e841d90d045b_jewel%2019-12%20(1)-p-800.png 800w, /assets/images/676e46297f91e841d90d045b_jewel%2019-12%20(1)-p-1080.png 1080w, /assets/images/676e46297f91e841d90d045b_jewel%2019-12%20(1)-p-1600.png 1600w, /assets/images/676e46297f91e841d90d045b_jewel%2019-12%20(1)-p-2000.png 2000w, /assets/images/676e46297f91e841d90d045b_jewel%2019-12%20(1).png 2048w",
  },
  {
    slug: "necklace-11",
    name: "BENGALI HARAM",
    code: "KJG064",
    metal: "gold",
    category: "BENGALI HARAM",
    weight: "68g",
    purity: "91.6",
    description:
      "This magnificent Bengali Haram is a breathtaking display of traditional opulence and masterful craftsmanship. It features a grand cascade of intricately detailed golden elements, including textured sections and circular motifs, leading to a prominent, intricately patterned teardrop pendant. The rich detailing and multi-layered design create a captivating presence, reflecting a profound heritage of artistry. Perfect for your most cherished celebrations, this long necklace drapes luxuriously, promising to command admiration and elevate your ensemble with unparalleled grace.",
    image: "/assets/images/676e483b8d148873fc0d0f75_2%20(1).png",
    imageSrcset:
      "/assets/images/676e483b8d148873fc0d0f75_2%20(1)-p-500.png 500w, /assets/images/676e483b8d148873fc0d0f75_2%20(1)-p-800.png 800w, /assets/images/676e483b8d148873fc0d0f75_2%20(1)-p-1080.png 1080w, /assets/images/676e483b8d148873fc0d0f75_2%20(1)-p-1600.png 1600w, /assets/images/676e483b8d148873fc0d0f75_2%20(1)-p-2000.png 2000w, /assets/images/676e483b8d148873fc0d0f75_2%20(1).png 2048w",
  },
  {
    slug: "necklace-12",
    name: "TURKEY HARAM",
    code: "KJG063",
    metal: "gold",
    category: "TURKEY HARAM",
    weight: "16g",
    purity: "91.6",
    description:
      "This elegant Turkey Haram is a testament to delicate craftsmanship and sophisticated design. Its graceful chain is composed of meticulously crafted golden oval links, each featuring subtle intricate patterns that catch the light beautifully. A charming teardrop pendant, adorned with delicate golden filigree, anchors the piece, adding a touch of fluid grace. Perfect for adding a refined touch to any occasion, this piece effortlessly blends traditional charm with a captivating contemporary allure.",
    image: "/assets/images/676e4854315bd8d382a9397f_1%20(1).png",
    imageSrcset:
      "/assets/images/676e4854315bd8d382a9397f_1%20(1)-p-500.png 500w, /assets/images/676e4854315bd8d382a9397f_1%20(1)-p-800.png 800w, /assets/images/676e4854315bd8d382a9397f_1%20(1)-p-1080.png 1080w, /assets/images/676e4854315bd8d382a9397f_1%20(1)-p-1600.png 1600w, /assets/images/676e4854315bd8d382a9397f_1%20(1)-p-2000.png 2000w, /assets/images/676e4854315bd8d382a9397f_1%20(1).png 2048w",
  },
  {
    slug: "necklace-13",
    name: "TURKEY HARAM",
    code: "KJG062",
    metal: "gold",
    category: "TURKEY HARAM",
    weight: "16g",
    purity: "91.6",
    description:
      "This stunning Turkey Haram is a magnificent display of intricate golden artistry. Its elaborate chain features beautifully crafted, interconnected golden motifs, leading to two grand circular pendants of descending size. Each pendant is meticulously detailed with captivating patterns, anchoring delicate golden drops that add a touch of fluid elegance. This piece is designed to drape luxuriously, making a grand statement while embodying sophisticated charm and timeless artisanal beauty for any cherished occasion.",
    image: "/assets/images/676e48695e9fb74edb440278_2048%20PNG.png",
    imageSrcset:
      "/assets/images/676e48695e9fb74edb440278_2048%20PNG-p-500.png 500w, /assets/images/676e48695e9fb74edb440278_2048%20PNG-p-800.png 800w, /assets/images/676e48695e9fb74edb440278_2048%20PNG-p-1080.png 1080w, /assets/images/676e48695e9fb74edb440278_2048%20PNG-p-1600.png 1600w, /assets/images/676e48695e9fb74edb440278_2048%20PNG-p-2000.png 2000w, /assets/images/676e48695e9fb74edb440278_2048%20PNG.png 2048w",
  },
  {
    slug: "necklace-14",
    name: "TEMPLE NECKLACE",
    code: "KJG061",
    metal: "gold",
    category: "TEMPLE NECKLACE",
    weight: "16g",
    purity: "91.6",
    description:
      "This magnificent Temple Necklace is a profound homage to spiritual artistry and grand design. Its elegant chain features a series of intricately crafted golden motifs, each adorned with subtle ruby accents, leading to a majestic central pendant. The pendant showcases a revered deity within a detailed temple-like structure, with delicate teardrop gems cascading below. Perfect for grand celebrations, this piece drapes beautifully to add an unparalleled touch of sacred elegance and timeless opulence to your ensemble.",
    image: "/assets/images/676e488951d226ebea1161de_jewel%2019-12.png",
    imageSrcset:
      "/assets/images/676e488951d226ebea1161de_jewel%2019-12-p-500.png 500w, /assets/images/676e488951d226ebea1161de_jewel%2019-12-p-800.png 800w, /assets/images/676e488951d226ebea1161de_jewel%2019-12-p-1080.png 1080w, /assets/images/676e488951d226ebea1161de_jewel%2019-12-p-1600.png 1600w, /assets/images/676e488951d226ebea1161de_jewel%2019-12-p-2000.png 2000w, /assets/images/676e488951d226ebea1161de_jewel%2019-12.png 2048w",
  },
  {
    slug: "necklace-16",
    name: "TURKEY HARAM",
    code: "KJG060",
    metal: "gold",
    category: "TURKEY HARAM",
    weight: "16g",
    purity: "22K",
    description:
      "This elegant Turkey Haram is a testament to delicate craftsmanship and sophisticated design. Its graceful chain is composed of meticulously crafted golden oval links, each featuring subtle intricate patterns that catch the light beautifully. A charming circular pendant, adorned with delicate golden filigree, anchors a shimmering teardrop element, adding a touch of fluid grace. Perfect for adding a refined touch to any occasion, this piece effortlessly blends traditional charm with a captivating contemporary allure.",
    image: "/assets/images/676e48a3768a65278bc820ef_white%20jewel%2012.png",
    imageSrcset:
      "/assets/images/676e48a3768a65278bc820ef_white%20jewel%2012.png 600w",
  },
  {
    slug: "necklace-17",
    name: "TURKEY HARAM",
    code: "KJG053",
    metal: "gold",
    category: "TURKEY HARAM",
    weight: "38g",
    purity: "91.6",
    description:
      "This exquisite Turkey Haram is a testament to sophisticated design and golden elegance. Its beautiful chain features a series of intricately crafted golden beads and textured discs, leading to a grand circular pendant. The pendant, meticulously detailed with a captivating floral motif, anchors a graceful golden drop, adding a touch of fluid beauty. Perfect for both traditional gatherings and contemporary celebrations, this piece drapes elegantly, promising to illuminate your style with its unique blend of artistry and charm.",
    image: "/assets/images/677e1c261a303bde7a84ff9b_01.png",
    imageSrcset:
      "/assets/images/677e1c261a303bde7a84ff9b_01-p-500.png 500w, /assets/images/677e1c261a303bde7a84ff9b_01-p-800.png 800w, /assets/images/677e1c261a303bde7a84ff9b_01-p-1080.png 1080w, /assets/images/677e1c261a303bde7a84ff9b_01-p-1600.png 1600w, /assets/images/677e1c261a303bde7a84ff9b_01-p-2000.png 2000w, /assets/images/677e1c261a303bde7a84ff9b_01.png 2048w",
  },
  {
    slug: "necklace-18",
    name: "CASTING HARAM",
    code: "KJG052",
    metal: "gold",
    category: "CASTING HARAM",
    weight: "16g",
    purity: "91.6",
    description:
      "This exquisite Casting Haram is a masterpiece of fluid design and vibrant elegance. Its long, graceful chain features a series of intricately crafted golden motifs, each subtly accented with delicate gemstones that add a touch of sparkle. The captivating central pendant, with its ornate floral design and peacock elements, creates a mesmerizing focal point. This piece is designed to drape luxuriously, making a grand statement while embodying sophisticated charm and timeless artisanal beauty for any cherished occasion.",
    image: "/assets/images/677e1c58469617f3d4ee11e9_02.png",
    imageSrcset:
      "/assets/images/677e1c58469617f3d4ee11e9_02-p-500.png 500w, /assets/images/677e1c58469617f3d4ee11e9_02-p-800.png 800w, /assets/images/677e1c58469617f3d4ee11e9_02-p-1080.png 1080w, /assets/images/677e1c58469617f3d4ee11e9_02-p-1600.png 1600w, /assets/images/677e1c58469617f3d4ee11e9_02-p-2000.png 2000w, /assets/images/677e1c58469617f3d4ee11e9_02.png 2048w",
  },
  {
    slug: "necklace-19",
    name: "ANTIQUE HARAM",
    code: "KJG051",
    metal: "gold",
    category: "ANTIQUE HARAM",
    weight: "24g",
    purity: "91.6",
    description:
      "This magnificent Antique Haram is a true testament to heritage and divine craftsmanship. Its long, elegant chain features a captivating blend of intricately detailed golden beads and vibrant green gemstones, leading to a grand central pendant. The pendant showcases a revered deity, meticulously sculpted with traditional motifs and accented with delicate ruby-hued stones. Perfect for grand celebrations, this piece drapes luxuriously, adding an unparalleled touch of sacred elegance and timeless opulence to your ensemble.",
    image: "/assets/images/677e1c74f86808f1f6c1bb73_03.png",
    imageSrcset: "/assets/images/677e1c74f86808f1f6c1bb73_03.png 600w",
  },
  {
    slug: "necklace-2-4",
    name: "ANTIQUE NECKLACE",
    code: "KJG038",
    metal: "gold",
    category: "ANTIQUE NECKLACE",
    weight: "20g",
    purity: "91.6",
    description:
      "This magnificent Antique Necklace is a grand spectacle of traditional artistry, featuring a captivating central deity motif. Flanked by intricately textured golden beads and delicate mango-shaped elements, the necklace forms a regal arc designed to adorn with unparalleled splendor. Each detail reflects a rich heritage of craftsmanship, creating a piece that is both timeless and exquisitely opulent. Perfect for your most cherished celebrations, it promises to elevate any ensemble with its majestic presence.",
    image: "/assets/images/679a1fe5509ed0aef32dc4b7_2-600x600.jpg",
    imageSrcset:
      "/assets/images/679a1fe5509ed0aef32dc4b7_2-600x600-p-500.jpg 500w, /assets/images/679a1fe5509ed0aef32dc4b7_2-600x600.jpg 600w",
  },
  {
    slug: "necklace-20",
    name: "CASTING HARAM",
    code: "KJG050",
    metal: "gold",
    category: "CASTING HARAM",
    weight: "16g",
    purity: "91.6",
    description:
      "This exquisite Casting Haram is a masterpiece of fluid design and vibrant elegance. Its long, graceful chain features a series of intricately crafted golden motifs, each subtly accented with delicate gemstones that add a touch of sparkle. The captivating central pendant, with its ornate floral design and dangling accents, creates a mesmerizing focal point. This piece is designed to drape luxuriously, making a grand statement while embodying sophisticated charm and timeless artisanal beauty for any cherished occasion.",
    image: "/assets/images/677e1c9230f1d908cb79ece9_4.png",
    imageSrcset:
      "/assets/images/677e1c9230f1d908cb79ece9_4-p-500.png 500w, /assets/images/677e1c9230f1d908cb79ece9_4-p-800.png 800w, /assets/images/677e1c9230f1d908cb79ece9_4-p-1080.png 1080w, /assets/images/677e1c9230f1d908cb79ece9_4-p-1600.png 1600w, /assets/images/677e1c9230f1d908cb79ece9_4-p-2000.png 2000w, /assets/images/677e1c9230f1d908cb79ece9_4.png 2048w",
  },
  {
    slug: "necklace-21",
    name: "CASTING NECKLACE",
    code: "KJG049",
    metal: "gold",
    category: "CASTING NECKLACE",
    weight: "16g",
    purity: "91.6",
    description:
      "This exquisite Casting Necklace is a contemporary masterpiece, blending modern design with subtle traditional accents. Its elegant golden chain gracefully descends to a captivating central pendant, intricately detailed with vibrant multi-colored gemstones. A sleek, polished drop suspends below, adding a touch of sophisticated allure. Perfect for adding refined elegance to both everyday ensembles and special occasions, this necklace embodies modern luxury and artistic craftsmanship, designed to illuminate your style effortlessly.",
    image: "/assets/images/677e1cdaa278d2e7bac68869_05.png",
    imageSrcset:
      "/assets/images/677e1cdaa278d2e7bac68869_05-p-500.png 500w, /assets/images/677e1cdaa278d2e7bac68869_05-p-800.png 800w, /assets/images/677e1cdaa278d2e7bac68869_05-p-1080.png 1080w, /assets/images/677e1cdaa278d2e7bac68869_05-p-1600.png 1600w, /assets/images/677e1cdaa278d2e7bac68869_05-p-2000.png 2000w, /assets/images/677e1cdaa278d2e7bac68869_05.png 2048w",
  },
  {
    slug: "necklace-22",
    name: "BENGALI HARAM",
    code: "KJG048",
    metal: "gold",
    category: "BENGALI HARAM",
    weight: "68g",
    purity: "91.6",
    description:
      "This magnificent Bengali Haram is a breathtaking display of traditional opulence and masterful craftsmanship. It features a grand cascade of intricately detailed golden coins, each adorned with subtle, vibrant accents, creating a rich tapestry of heritage. A majestic central pendant, exquisitely designed, anchors this piece, lending a touch of regal splendor. Perfect for your most cherished celebrations, this long necklace drapes luxuriously, promising to command admiration and elevate your ensemble with unparalleled grace.",
    image: "/assets/images/677e1d2dc742a023b88fb1dd_06.png",
    imageSrcset:
      "/assets/images/677e1d2dc742a023b88fb1dd_06-p-500.png 500w, /assets/images/677e1d2dc742a023b88fb1dd_06-p-800.png 800w, /assets/images/677e1d2dc742a023b88fb1dd_06-p-1080.png 1080w, /assets/images/677e1d2dc742a023b88fb1dd_06-p-1600.png 1600w, /assets/images/677e1d2dc742a023b88fb1dd_06-p-2000.png 2000w, /assets/images/677e1d2dc742a023b88fb1dd_06.png 2048w",
  },
  {
    slug: "necklace-23",
    name: "TEMPLE DESIGN NECKLACE",
    code: "KJG047",
    metal: "gold",
    category: "TEMPLE DESIGN NECKLACE",
    weight: "",
    purity: "91.6",
    description:
      "Behold this magnificent Temple Design necklace, a true embodiment of divine artistry and traditional grandeur. This exquisite piece features a meticulously crafted double-layered chain, adorned with intricate golden motifs and subtle ruby accents. A majestic central pendant, depicting a revered deity within a detailed temple-like structure, creates a breathtaking focal point. Perfect for grand celebrations, this necklace beautifully drapes to add an unparalleled touch of sacred elegance and timeless opulence to your ensemble.",
    image: "/assets/images/677e1d7c3ee51725cd1b90a0_7.png",
    imageSrcset:
      "/assets/images/677e1d7c3ee51725cd1b90a0_7-p-500.png 500w, /assets/images/677e1d7c3ee51725cd1b90a0_7-p-800.png 800w, /assets/images/677e1d7c3ee51725cd1b90a0_7-p-1080.png 1080w, /assets/images/677e1d7c3ee51725cd1b90a0_7-p-1600.png 1600w, /assets/images/677e1d7c3ee51725cd1b90a0_7-p-2000.png 2000w, /assets/images/677e1d7c3ee51725cd1b90a0_7.png 2048w",
  },
  {
    slug: "necklace-3-2",
    name: "ANTIQUE NECKLACE",
    code: "KJG037",
    metal: "gold",
    category: "ANTIQUE NECKLACE",
    weight: "20g",
    purity: "91.6",
    description:
      "This exquisite Antique Necklace captures the essence of timeless beauty with its meticulously crafted golden motifs. Each traditional design is intricately detailed, forming a regal cascade that beautifully adorns the neckline. Subtle, vibrant accents are thoughtfully placed throughout, adding a delicate sparkle to its classic charm. Perfect for those who appreciate heritage artistry, this piece promises to infuse any ensemble with an air of sophisticated elegance and enduring splendor.",
    image: "/assets/images/679a1ffe682e558fd5af0d67_3-600x600.jpg",
    imageSrcset:
      "/assets/images/679a1ffe682e558fd5af0d67_3-600x600-p-500.jpg 500w, /assets/images/679a1ffe682e558fd5af0d67_3-600x600.jpg 600w",
  },
  {
    slug: "necklace-3",
    name: "CASTING BRACELET",
    code: "KJG072",
    metal: "gold",
    category: "CASTING BRACELET",
    weight: "8g",
    purity: "91.6",
    description:
      "This delicate Casting Bracelet is a charming expression of love and elegance. It features a finely crafted golden chain that leads to a graceful cascade of interconnected heart motifs, each reflecting a soft shimmer. A subtle pearl drop suspends at the end, adding a touch of classic sophistication. Perfect for adding a heartfelt accent to your wrist or as a thoughtful gift, this bracelet embodies refined simplicity and enduring beauty, designed for everyday wear or special moments.",
    image: "/assets/images/676275a817383089e76d156a_white%20jewel%203.png",
    imageSrcset:
      "/assets/images/676275a817383089e76d156a_white%20jewel%203-p-500.png 500w, /assets/images/676275a817383089e76d156a_white%20jewel%203-p-800.png 800w, /assets/images/676275a817383089e76d156a_white%20jewel%203-p-1080.png 1080w, /assets/images/676275a817383089e76d156a_white%20jewel%203-p-1600.png 1600w, /assets/images/676275a817383089e76d156a_white%20jewel%203-p-2000.png 2000w, /assets/images/676275a817383089e76d156a_white%20jewel%203.png 2048w",
  },
  {
    slug: "necklace-4-2",
    name: "ANTIQUE NECKLACE",
    code: "KJG036",
    metal: "gold",
    category: "ANTIQUE NECKLACE",
    weight: "20g",
    purity: "91.6",
    description:
      "This magnificent Antique Necklace is a true homage to heritage, featuring a stunning array of meticulously crafted golden elements. Its design boasts intricate traditional motifs, with gracefully curved segments leading to a grand central pendant adorned with subtle, vibrant accents. The rich detailing and timeless artistry create a breathtaking display of opulence. Perfect for adding an air of regal splendor to any special occasion, this piece is a testament to enduring elegance and refined craftsmanship.",
    image: "/assets/images/679a206052e85cf3a957c279_4-600x600.jpg",
    imageSrcset:
      "/assets/images/679a206052e85cf3a957c279_4-600x600-p-500.jpg 500w, /assets/images/679a206052e85cf3a957c279_4-600x600.jpg 600w",
  },
  {
    slug: "necklace-4",
    name: "Signity Floral Leaf Gold Necklace",
    code: "KJG095",
    metal: "gold",
    category: "Signity Floral Leaf Gold Necklace",
    weight: "",
    purity: "91.6",
    description:
      "This radiant gold necklace is a vibrant celebration of color, culture, and craftsmanship. Adorned with a symphony of multicolored gemstones, each intricately set within petal-shaped gold motifs, it captures the essence of traditional elegance with a modern twist. The central floral pendant blossoms with brilliance, anchoring the design in timeless beauty. Ideal for festive occasions or grand celebrations, this necklace is more than jewelry—it's a masterpiece that speaks of heritage, joy, and the art of standing out with grace.",
    image: "/assets/images/676275cc43ac7f2dae7ef9ce_white%20jewel%204.png",
    imageSrcset:
      "/assets/images/676275cc43ac7f2dae7ef9ce_white%20jewel%204-p-500.png 500w, /assets/images/676275cc43ac7f2dae7ef9ce_white%20jewel%204-p-800.png 800w, /assets/images/676275cc43ac7f2dae7ef9ce_white%20jewel%204-p-1080.png 1080w, /assets/images/676275cc43ac7f2dae7ef9ce_white%20jewel%204-p-1600.png 1600w, /assets/images/676275cc43ac7f2dae7ef9ce_white%20jewel%204-p-2000.png 2000w, /assets/images/676275cc43ac7f2dae7ef9ce_white%20jewel%204.png 2048w",
  },
  {
    slug: "necklace-5",
    name: "MUGAPPU CHAIN",
    code: "KJG071",
    metal: "gold",
    category: "MUGAPPU CHAIN",
    weight: "32g",
    purity: "91.6",
    description:
      "This elegant Mugappu Chain is a testament to understated sophistication and refined craftsmanship. Its intricate golden chain is subtly adorned with a central oval motif, exquisitely detailed with vibrant gemstones that add a touch of color and sparkle. The classic design ensures versatile wear, making it perfect for both daily elegance and special occasions. This piece embodies timeless beauty and traditional charm, promising to elevate your style with its delicate presence.",
    image: "/assets/images/676275f1eaeb2463b2484b95_white%20jewel%206.png",
    imageSrcset:
      "/assets/images/676275f1eaeb2463b2484b95_white%20jewel%206-p-500.png 500w, /assets/images/676275f1eaeb2463b2484b95_white%20jewel%206-p-800.png 800w, /assets/images/676275f1eaeb2463b2484b95_white%20jewel%206-p-1080.png 1080w, /assets/images/676275f1eaeb2463b2484b95_white%20jewel%206-p-1600.png 1600w, /assets/images/676275f1eaeb2463b2484b95_white%20jewel%206-p-2000.png 2000w, /assets/images/676275f1eaeb2463b2484b95_white%20jewel%206.png 2048w",
  },
  {
    slug: "necklace-6",
    name: "BOMBAY NECKLACE",
    code: "KJG070",
    metal: "gold",
    category: "BOMBAY NECKLACE",
    weight: "28g",
    purity: "91.6",
    description:
      "This exquisite Bombay Necklace is a captivating blend of geometric elegance and intricate detailing. Its finely crafted golden chain features a series of alternating circular and hexagonal motifs, leading to a prominent rectangular pendant. The pendant is adorned with a delicate floral design, while a polished golden drop gracefully suspends below. Perfect for adding a sophisticated touch to both festive occasions and everyday elegance, this necklace is a true testament to timeless artistry and refined beauty.",
    image: "/assets/images/6762760947c36a79f4ab8e6c_white%20jewel%209.png",
    imageSrcset:
      "/assets/images/6762760947c36a79f4ab8e6c_white%20jewel%209-p-500.png 500w, /assets/images/6762760947c36a79f4ab8e6c_white%20jewel%209-p-800.png 800w, /assets/images/6762760947c36a79f4ab8e6c_white%20jewel%209-p-1080.png 1080w, /assets/images/6762760947c36a79f4ab8e6c_white%20jewel%209-p-1600.png 1600w, /assets/images/6762760947c36a79f4ab8e6c_white%20jewel%209-p-2000.png 2000w, /assets/images/6762760947c36a79f4ab8e6c_white%20jewel%209.png 2048w",
  },
  {
    slug: "necklace-7",
    name: "TURKEY HARAM",
    code: "KJG069",
    metal: "gold",
    category: "TURKEY HARAM",
    weight: "54g",
    purity: "91.6",
    description:
      "This magnificent Turkey Haram is a grand display of intricate golden artistry and traditional opulence. Its elegant, multi-layered chain features a series of beautifully crafted, interconnected golden motifs, leading to a prominent oval pendant. The pendant is meticulously detailed with captivating patterns, including delicate peacock figures, and anchors a cascade of shimmering golden drops. This piece is designed to drape luxuriously, making a grand statement while embodying sophisticated charm and timeless artisanal beauty for any cherished occasion.",
    image: "/assets/images/676276179b706e61c1b720ad_white%20jewel%2010.png",
    imageSrcset:
      "/assets/images/676276179b706e61c1b720ad_white%20jewel%2010-p-500.png 500w, /assets/images/676276179b706e61c1b720ad_white%20jewel%2010-p-800.png 800w, /assets/images/676276179b706e61c1b720ad_white%20jewel%2010-p-1080.png 1080w, /assets/images/676276179b706e61c1b720ad_white%20jewel%2010-p-1600.png 1600w, /assets/images/676276179b706e61c1b720ad_white%20jewel%2010-p-2000.png 2000w, /assets/images/676276179b706e61c1b720ad_white%20jewel%2010.png 2048w",
  },
  {
    slug: "necklace-8",
    name: "TURKEY NECKLACE",
    code: "KJG068",
    metal: "gold",
    category: "TURKEY NECKLACE",
    weight: "28g",
    purity: "91.6",
    description:
      "This exquisite Turkey Necklace is a magnificent display of intricate golden artistry. Its double-layered design features a series of meticulously crafted circular motifs, each adorned with delicate filigree work and subtle, vibrant gemstones that catch the light beautifully. The harmonious arrangement creates a captivating cascade, reflecting a rich heritage of artisanal excellence. Perfect for adding a touch of sophisticated glamour to both festive occasions and everyday elegance, this necklace is a true testament to timeless beauty.",
    image: "/assets/images/6762762dc9c76af7612a8408_white%20jewel%2011.png",
    imageSrcset:
      "/assets/images/6762762dc9c76af7612a8408_white%20jewel%2011-p-500.png 500w, /assets/images/6762762dc9c76af7612a8408_white%20jewel%2011-p-800.png 800w, /assets/images/6762762dc9c76af7612a8408_white%20jewel%2011-p-1080.png 1080w, /assets/images/6762762dc9c76af7612a8408_white%20jewel%2011-p-1600.png 1600w, /assets/images/6762762dc9c76af7612a8408_white%20jewel%2011-p-2000.png 2000w, /assets/images/6762762dc9c76af7612a8408_white%20jewel%2011.png 2048w",
  },
  {
    slug: "necklace-9",
    name: "RAJKOT HARAM",
    code: "KJG067",
    metal: "gold",
    category: "RAJKOT HARAM",
    weight: "32g",
    purity: "91.6",
    description:
      "This elegant Rajkot Haram is a testament to delicate craftsmanship and sophisticated design. Its graceful chain is composed of meticulously crafted golden oval links and polished beads, leading to a prominent circular pendant. The pendant, intricately detailed with captivating golden filigree and a vibrant central gemstone, anchors a shimmering teardrop gem. Perfect for adding a refined touch to any occasion, this piece effortlessly blends traditional charm with a captivating contemporary allure, promising to dazzle.",
    image: "/assets/images/6762764269ca12cf48283ef9_white%20jewel%2013.png",
    imageSrcset:
      "/assets/images/6762764269ca12cf48283ef9_white%20jewel%2013-p-500.png 500w, /assets/images/6762764269ca12cf48283ef9_white%20jewel%2013-p-800.png 800w, /assets/images/6762764269ca12cf48283ef9_white%20jewel%2013-p-1080.png 1080w, /assets/images/6762764269ca12cf48283ef9_white%20jewel%2013-p-1600.png 1600w, /assets/images/6762764269ca12cf48283ef9_white%20jewel%2013-p-2000.png 2000w, /assets/images/6762764269ca12cf48283ef9_white%20jewel%2013.png 2048w",
  },
  {
    slug: "necklace-24",
    name: "White Jewel Necklace",
    code: "KJG096",
    metal: "gold",
    category: "Necklace",
    weight: "42g",
    purity: "22K",
    description:
      "An elegant white jewel necklace featuring sparkling stone accents set in a refined gold framework. This piece combines traditional craftsmanship with a contemporary aesthetic, perfect for special occasions.",
    image: "/assets/images/676276179b706e61c1b720ad_white%20jewel%2010.png",
    imageSrcset:
      "/assets/images/676276179b706e61c1b720ad_white%20jewel%2010-p-500.png 500w, /assets/images/676276179b706e61c1b720ad_white%20jewel%2010-p-800.png 800w, /assets/images/676276179b706e61c1b720ad_white%20jewel%2010-p-1080.png 1080w, /assets/images/676276179b706e61c1b720ad_white%20jewel%2010-p-1600.png 1600w, /assets/images/676276179b706e61c1b720ad_white%20jewel%2010-p-2000.png 2000w, /assets/images/676276179b706e61c1b720ad_white%20jewel%2010.png 2048w",
  },
  {
    slug: "pallavi-necklace",
    name: "BENGALI FANCY NECKLACE",
    code: "KJG027",
    metal: "gold",
    category: "BENGALI FANCY NECKLACE",
    weight: "20g",
    purity: "91.6",
    description:
      "Presenting our magnificent Bengali Fancy necklace, a grand cascade of intricately crafted golden motifs. This striking piece features an elegant design, with each element meticulously shaped and adorned with subtle, vibrant accents, creating a rich visual tapestry. The necklace drapes beautifully, exuding traditional splendor with a refined touch. Perfect for making a distinguished statement at any significant event, this piece is a true celebration of opulent artistry and enduring charm.",
    image: "/assets/images/679a29886bb8b03e27ff86b5_23-600x600.jpg",
    imageSrcset:
      "/assets/images/679a29886bb8b03e27ff86b5_23-600x600-p-500.jpg 500w, /assets/images/679a29886bb8b03e27ff86b5_23-600x600.jpg 600w",
  },
  {
    slug: "pendant-2",
    name: "FANCY JIMMIKI",
    code: "KJG076",
    metal: "gold",
    category: "FANCY JIMMIKI",
    weight: "12g",
    purity: "8.0mm Cushion-Cut Ame...",
    description:
      "These exquisite Fancy Jimmiki earrings are a captivating blend of traditional design and fluid elegance. Each earring features a delicate golden top, from which suspends a beautifully crafted golden hoop. Within the hoop, a miniature jhumka, adorned with intricate details and subtle red accents, adds a playful charm. A cascade of delicate pearl drops gracefully dangles from the hoop, enhancing their ethereal beauty. Perfect for both festive occasions and adding a refined touch to everyday wear, these earrings embody timeless grace and meticulous craftsmanship.",
    image: "/assets/images/675fc09903839d0c7592c311_Frame%202085665020.png",
    imageSrcset:
      "/assets/images/675fc09903839d0c7592c311_Frame%202085665020-p-500.png 500w, /assets/images/675fc09903839d0c7592c311_Frame%202085665020-p-800.png 800w, /assets/images/675fc09903839d0c7592c311_Frame%202085665020-p-1080.png 1080w, /assets/images/675fc09903839d0c7592c311_Frame%202085665020.png 1136w",
  },
  {
    slug: "pendant-3",
    name: "Lord Venkateshwara Pendant",
    code: "KJG096",
    metal: "gold",
    category: "Lord Venkateshwara Pendant",
    weight: "",
    purity: "91.6",
    description:
      "This divine gold pendant is a radiant emblem of devotion and elegance. Featuring a finely detailed deity motif framed within an oval medallion, its sunburst engraving exudes spiritual brilliance. The central figure is adorned with delicate accents of color, enhancing its sacred presence and artistic intricacy. Crafted with reverence and finesse, this pendant is perfect for daily grace or festive adornment. It blends spiritual strength with timeless style, offering a meaningful piece that speaks to both faith and finesse.",
    image: "/assets/images/67626d495c7fb2f6701325e9_1.png",
    imageSrcset:
      "/assets/images/67626d495c7fb2f6701325e9_1-p-500.png 500w, /assets/images/67626d495c7fb2f6701325e9_1-p-800.png 800w, /assets/images/67626d495c7fb2f6701325e9_1-p-1080.png 1080w, /assets/images/67626d495c7fb2f6701325e9_1-p-1600.png 1600w, /assets/images/67626d495c7fb2f6701325e9_1-p-2000.png 2000w, /assets/images/67626d495c7fb2f6701325e9_1.png 2048w",
  },
  {
    slug: "pendant-5",
    name: "MADHA LOCKET",
    code: "KJG059",
    metal: "gold",
    category: "MADHA LOCKET",
    weight: "",
    purity: "91.6",
    description:
      "This exquisite Madha Locket is a deeply meaningful piece, beautifully capturing a revered spiritual image in radiant gold. Meticulously crafted, it depicts the divine figures with intricate details, standing gracefully on a crescent moon base. The polished finish enhances its sacred presence, creating a truly captivating accessory. Perfect for daily wear or as a cherished symbol of faith and devotion, this locket offers a touch of serene beauty and timeless elegance, designed to be worn close to your heart.",
    image: "/assets/images/6776700e3b04ae151a8c9777_5%20(1).png",
    imageSrcset:
      "/assets/images/6776700e3b04ae151a8c9777_5%20(1)-p-500.png 500w, /assets/images/6776700e3b04ae151a8c9777_5%20(1)-p-800.png 800w, /assets/images/6776700e3b04ae151a8c9777_5%20(1)-p-1080.png 1080w, /assets/images/6776700e3b04ae151a8c9777_5%20(1)-p-1600.png 1600w, /assets/images/6776700e3b04ae151a8c9777_5%20(1)-p-2000.png 2000w, /assets/images/6776700e3b04ae151a8c9777_5%20(1).png 2048w",
  },
  {
    slug: "pendant-6",
    name: "DIVINE PENDANT",
    code: "KJG058",
    metal: "gold",
    category: "DIVINE PENDANT",
    weight: "",
    purity: "91.6",
    description:
      "Embrace sacred artistry with our exquisite Divine Pendant, a beautifully rendered emblem of devotion. This charming piece features a meticulously detailed deity figure, elegantly framed within a golden circular motif adorned with delicate rope-like textures. The intricate craftsmanship captures a sense of timeless reverence and golden splendor. Perfect for daily wear or as a cherished symbol of faith, this pendant embodies a blend of traditional charm and sophisticated elegance, designed to be worn close to your heart.",
    image: "/assets/images/6776701e555dc042b402ca1c_07.png",
    imageSrcset:
      "/assets/images/6776701e555dc042b402ca1c_07-p-500.png 500w, /assets/images/6776701e555dc042b402ca1c_07-p-800.png 800w, /assets/images/6776701e555dc042b402ca1c_07-p-1080.png 1080w, /assets/images/6776701e555dc042b402ca1c_07-p-1600.png 1600w, /assets/images/6776701e555dc042b402ca1c_07-p-2000.png 2000w, /assets/images/6776701e555dc042b402ca1c_07.png 2048w",
  },
  {
    slug: "pendant-7",
    name: "CROSS LOCKET",
    code: "KJG057",
    metal: "gold",
    category: "CROSS LOCKET",
    weight: "3g",
    purity: "91.6",
    description:
      "Embrace timeless faith with our elegantly crafted Cross Locket. This delicate piece features a classic cross design, meticulously detailed with subtle floral motifs at its center and artfully shaped tips, enhancing its serene beauty. The polished golden surface catches the light, offering a gentle glow. Perfect for daily wear or as a cherished symbol of devotion, this locket embodies grace and refined simplicity, designed to be worn close to your heart as a constant source of inspiration.",
    image: "/assets/images/6776702ae9363fec8d187c45_08.png",
    imageSrcset:
      "/assets/images/6776702ae9363fec8d187c45_08-p-500.png 500w, /assets/images/6776702ae9363fec8d187c45_08-p-800.png 800w, /assets/images/6776702ae9363fec8d187c45_08-p-1080.png 1080w, /assets/images/6776702ae9363fec8d187c45_08-p-1600.png 1600w, /assets/images/6776702ae9363fec8d187c45_08-p-2000.png 2000w, /assets/images/6776702ae9363fec8d187c45_08.png 2048w",
  },
  {
    slug: "pendant-8",
    name: "DIVINE PENDANT",
    code: "KJG056",
    metal: "gold",
    category: "DIVINE PENDANT",
    weight: "2g",
    purity: "91.6",
    description:
      "Embrace spiritual elegance with our exquisite Divine Pendant, a beautifully crafted emblem of faith and artistry. This charming piece features a meticulously detailed deity figure, nestled within a delicate golden leaf-shaped setting. The intricate textures and polished gold create a radiant glow, making it a truly captivating accessory. Perfect for daily wear or as a cherished gift, this pendant offers a touch of sacred beauty and sophisticated charm, designed to be worn close to your heart.",
    image: "/assets/images/67626dece31b4678d5b8209e_11.png",
    imageSrcset:
      "/assets/images/67626dece31b4678d5b8209e_11-p-500.png 500w, /assets/images/67626dece31b4678d5b8209e_11-p-800.png 800w, /assets/images/67626dece31b4678d5b8209e_11-p-1080.png 1080w, /assets/images/67626dece31b4678d5b8209e_11-p-1600.png 1600w, /assets/images/67626dece31b4678d5b8209e_11-p-2000.png 2000w, /assets/images/67626dece31b4678d5b8209e_11.png 2048w",
  },
  {
    slug: "personalised-ring-1",
    name: "CULCUTTA RING",
    code: "KJG092",
    metal: "gold",
    category: "CULCUTTA RING",
    weight: "12.84g",
    purity: "91.6",
    description:
      "Presenting the exquisite Calcutta Ring, a testament to intricate golden craftsmanship. This elegant piece features a wide, finely detailed band with a delicate filigree pattern and graceful diagonal lines. Adorning the band are three beautifully sculpted floral motifs, adding a touch of natural charm and sophistication. The radiant golden finish catches the light, creating a mesmerizing play of brilliance. Designed to make a subtle yet impactful statement, this ring is perfect for adding a touch of sophisticated charm to your everyday attire or for complementing a special occasion ensemble with its unique and graceful allure.",
    image: "/assets/images/675fc3973be4249c1a63f652_6.png",
    imageSrcset:
      "/assets/images/675fc3973be4249c1a63f652_6-p-500.png 500w, /assets/images/675fc3973be4249c1a63f652_6-p-800.png 800w, /assets/images/675fc3973be4249c1a63f652_6-p-1080.png 1080w, /assets/images/675fc3973be4249c1a63f652_6.png 1136w",
  },
  {
    slug: "personalised-ring-2",
    name: "ANTIQUE JIMMIKI",
    code: "KJG091",
    metal: "gold",
    category: "ANTIQUE JIMMIKI",
    weight: "14g",
    purity: "91.6",
    description:
      "These magnificent Antique Jimmiki earrings are a captivating blend of traditional grandeur and vibrant elegance. Each earring features a beautifully detailed golden square top, adorned with intricate beadwork and a prominent lush green gemstone. From this exquisite top, a gracefully flared jhumka suspends, intricately designed with delicate golden beads and finished with a cascade of shimmering golden drops. Perfect for festive occasions and grand celebrations, these earrings embody timeless beauty and meticulous craftsmanship, promising to make a distinctive and regal statement.",
    image: "/assets/images/675fc36ac1b997bff10d267e_Frame%202085665022.png",
    imageSrcset:
      "/assets/images/675fc36ac1b997bff10d267e_Frame%202085665022-p-500.png 500w, /assets/images/675fc36ac1b997bff10d267e_Frame%202085665022-p-800.png 800w, /assets/images/675fc36ac1b997bff10d267e_Frame%202085665022.png 852w",
  },
  {
    slug: "personalised-ring-3",
    name: "CASTING STUD",
    code: "KJG077",
    metal: "gold",
    category: "CASTING STUD",
    weight: "6g",
    purity: "91.6",
    description:
      "These enchanting Casting Stud earrings are a perfect blend of modern elegance and delicate charm. Each earring features a sleek, diamond-studded bar that suspends a beautifully crafted golden heart. The heart is intricately detailed with a delicate filigree pattern and a central cluster of vibrant pink gemstones, adding a touch of romantic sparkle. Perfect for both everyday sophistication and special occasions, these earrings embody refined beauty and timeless allure, designed to captivate with every movement.",
    image: "/assets/images/675fc16c2f46c1502035cb07_Frame%202085665028.png",
    imageSrcset:
      "/assets/images/675fc16c2f46c1502035cb07_Frame%202085665028-p-500.png 500w, /assets/images/675fc16c2f46c1502035cb07_Frame%202085665028-p-800.png 800w, /assets/images/675fc16c2f46c1502035cb07_Frame%202085665028-p-1080.png 1080w, /assets/images/675fc16c2f46c1502035cb07_Frame%202085665028.png 1136w",
  },
  {
    slug: "ratnavali-necklace",
    name: "BOMBAY FANCY NECKLACE",
    code: "KJG032",
    metal: "gold",
    category: "BOMBAY FANCY NECKLACE",
    weight: "20g",
    purity: "91.6",
    description:
      "This stunning Bombay Fancy necklace is a testament to exquisite craftsmanship and traditional allure. Its intricate design features a series of meticulously crafted golden elements, each adorned with subtle, vibrant accents that catch the light beautifully. The grand central pendant serves as a captivating focal point, embodying a rich heritage of artistry. This elegant piece promises to drape luxuriously, adding an air of sophistication and timeless beauty to any festive or special occasion.",
    image: "/assets/images/679a283c9c807fe36a1c50f6_10-600x600.jpg",
    imageSrcset:
      "/assets/images/679a283c9c807fe36a1c50f6_10-600x600-p-500.jpg 500w, /assets/images/679a283c9c807fe36a1c50f6_10-600x600.jpg 600w",
  },
  {
    slug: "revati-necklace",
    name: "ANTIQUE NECKLACE",
    code: "KJG019",
    metal: "gold",
    category: "ANTIQUE NECKLACE",
    weight: "20g",
    purity: "91.6",
    description:
      "This exquisite Antique Necklace is a true ode to heritage, meticulously crafted with intricate gold work and vibrant embellishments. Its crescent-shaped design, adorned with delicate golden beads and a central, richly detailed pendant, exudes regal charm. The interplay of traditional motifs and sparkling gemstones creates a captivating allure. Perfect for adding a touch of timeless elegance and opulence to any special occasion, this piece is a testament to refined artistry.",
    image: "/assets/images/679a2d04a495b5f7b5f18ac5_59-600x600.jpg",
    imageSrcset: "/assets/images/679a2d04a495b5f7b5f18ac5_59-600x600.jpg 600w",
  },
  {
    slug: "ring-5",
    name: "FANCY RING",
    code: "KJG055",
    metal: "gold",
    category: "FANCY RING",
    weight: "4g",
    purity: "1/10 CT. T.W. Diamond T...",
    description:
      "Discover the sophisticated simplicity of our Fancy Ring, a contemporary piece designed for effortless elegance. This striking ring features a sleek golden band composed of multiple, gently undulating lines that create a beautiful sense of movement and texture. Its polished surface reflects light with subtle brilliance, offering a modern take on classic style. Perfect for adding a refined touch to your everyday look or for stacking with other favorites, this ring embodies understated luxury and timeless appeal.",
    image: "/assets/images/677670ac11332d59a9f50e40_104.png",
    imageSrcset:
      "/assets/images/677670ac11332d59a9f50e40_104-p-500.png 500w, /assets/images/677670ac11332d59a9f50e40_104-p-800.png 800w, /assets/images/677670ac11332d59a9f50e40_104-p-1080.png 1080w, /assets/images/677670ac11332d59a9f50e40_104-p-1600.png 1600w, /assets/images/677670ac11332d59a9f50e40_104-p-2000.png 2000w, /assets/images/677670ac11332d59a9f50e40_104.png 2048w",
  },
  {
    slug: "ring-6",
    name: "FANCY RING",
    code: "KJG054",
    metal: "gold",
    category: "FANCY RING",
    weight: "4g",
    purity: "91.6",
    description:
      "Embrace the sweet charm of our Fancy Ring, a beautifully sculpted piece designed for everyday elegance. This ring features a sleek golden band that gracefully curves to embrace a delicate heart motif, adding a touch of romance and allure. The smooth, polished surface catches the light, creating a subtle yet captivating shimmer. Perfect for adding a heartfelt touch to your daily style or as a thoughtful gift, this ring embodies refined simplicity and enduring beauty.",
    image: "/assets/images/677671053cd57cac799283b0_113.png",
    imageSrcset:
      "/assets/images/677671053cd57cac799283b0_113-p-500.png 500w, /assets/images/677671053cd57cac799283b0_113-p-800.png 800w, /assets/images/677671053cd57cac799283b0_113-p-1080.png 1080w, /assets/images/677671053cd57cac799283b0_113-p-1600.png 1600w, /assets/images/677671053cd57cac799283b0_113-p-2000.png 2000w, /assets/images/677671053cd57cac799283b0_113.png 2048w",
  },
  {
    slug: "ring",
    name: "CASTING RING",
    code: "KJG073",
    metal: "gold",
    category: "CASTING RING",
    weight: "4g",
    purity: "91.6",
    description:
      "Discover the subtle sophistication of our Casting Ring, a modern and elegant addition to any jewelry collection. This beautifully crafted golden band features a distinctive textured surface, creating a subtle wave-like pattern that catches the light with understated brilliance. Its sleek and polished finish offers a contemporary take on classic design, making it perfect for everyday wear or as a refined accent for special occasions. This ring embodies refined simplicity and enduring style.",
    image: "/assets/images/67626e62a057962d5cad5d60_17.png",
    imageSrcset:
      "/assets/images/67626e62a057962d5cad5d60_17-p-500.png 500w, /assets/images/67626e62a057962d5cad5d60_17-p-800.png 800w, /assets/images/67626e62a057962d5cad5d60_17-p-1080.png 1080w, /assets/images/67626e62a057962d5cad5d60_17-p-1600.png 1600w, /assets/images/67626e62a057962d5cad5d60_17-p-2000.png 2000w, /assets/images/67626e62a057962d5cad5d60_17.png 2048w",
  },
  {
    slug: "secret-garden-choker-necklace",
    name: "BENGALI CHOKER",
    code: "KJG034",
    metal: "gold",
    category: "BENGALI CHOKER",
    weight: "20g",
    purity: "91.6",
    description:
      "Presenting the magnificent Bengali Choker, a true embodiment of regal splendor and intricate craftsmanship. Its wide, textured golden band is adorned with vibrant rows of gemstones and delicate pearl drops, creating a breathtaking display. A central floral motif, richly detailed, anchors a graceful teardrop pendant, adding a touch of unparalleled elegance. This choker is designed to make a grand statement, seamlessly blending traditional opulence with sophisticated charm for your most cherished occasions.",
    image: "/assets/images/679a273bcb859b7300e6ecd5_6-600x600.jpg",
    imageSrcset:
      "/assets/images/679a273bcb859b7300e6ecd5_6-600x600-p-500.jpg 500w, /assets/images/679a273bcb859b7300e6ecd5_6-600x600.jpg 600w",
  },
  {
    slug: "studs-1",
    name: "ANTIQUE JIMMIKI",
    code: "KJG085",
    metal: "gold",
    category: "ANTIQUE JIMMIKI",
    weight: "8g",
    purity: "91.6",
    description:
      "These exquisite Antique Jimmiki earrings are a captivating blend of traditional grandeur and vibrant elegance. Each earring features a beautifully detailed golden disc top, adorned with intricate beadwork and a prominent ruby-hued gemstone. From this exquisite top, a gracefully flared jhumka suspends, intricately designed with delicate golden beads and finished with a cascade of shimmering pearl-like drops. Perfect for festive occasions and grand celebrations, these earrings embody timeless beauty and meticulous craftsmanship, promising to make a distinctive and regal statement.",
    image: "/assets/images/675fc1537d8c306b6649602e_Frame%202085665025.png",
    imageSrcset:
      "/assets/images/675fc1537d8c306b6649602e_Frame%202085665025-p-500.png 500w, /assets/images/675fc1537d8c306b6649602e_Frame%202085665025-p-800.png 800w, /assets/images/675fc1537d8c306b6649602e_Frame%202085665025-p-1080.png 1080w, /assets/images/675fc1537d8c306b6649602e_Frame%202085665025.png 1136w",
  },
  {
    slug: "studs-2",
    name: "ANTIQUE JIMMIKI",
    code: "KJG086",
    metal: "gold",
    category: "ANTIQUE JIMMIKI",
    weight: "10g",
    purity: "91.6",
    description:
      "These magnificent Antique Jimmiki earrings are a captivating blend of traditional grandeur and vibrant elegance. Each earring features a beautifully detailed golden peacock motif top, adorned with intricate beadwork and prominent ruby-hued gemstones. From this exquisite top, a gracefully flared jhumka suspends, intricately designed with traditional motifs and finished with a cascade of delicate golden drops. Perfect for festive occasions and grand celebrations, these earrings embody timeless beauty and meticulous craftsmanship, promising to make a distinctive and regal statement.",
    image: "/assets/images/675fc2ae0ad9194812075926_Frame%202085665024.png",
    imageSrcset:
      "/assets/images/675fc2ae0ad9194812075926_Frame%202085665024-p-500.png 500w, /assets/images/675fc2ae0ad9194812075926_Frame%202085665024-p-800.png 800w, /assets/images/675fc2ae0ad9194812075926_Frame%202085665024-p-1080.png 1080w, /assets/images/675fc2ae0ad9194812075926_Frame%202085665024.png 1136w",
  },
  {
    slug: "studs-3",
    name: "ANTIQUE JIMMIKI",
    code: "KJG084",
    metal: "gold",
    category: "ANTIQUE JIMMIKI",
    weight: "8g",
    purity: "91.6",
    description:
      "These magnificent Antique Jimmiki earrings are a captivating blend of traditional grandeur and vibrant elegance. Each earring features a beautifully detailed golden teardrop top, adorned with intricate beadwork and a prominent ruby-hued gemstone. From this exquisite top, a gracefully flared jhumka suspends, intricately designed with traditional motifs and finished with a cascade of delicate golden drops. Perfect for festive occasions and grand celebrations, these earrings embody timeless beauty and meticulous craftsmanship, promising to make a distinctive and regal statement.",
    image: "/assets/images/675fc27ca23998da10ee7bbe_Frame%202085665023.png",
    imageSrcset:
      "/assets/images/675fc27ca23998da10ee7bbe_Frame%202085665023-p-500.png 500w, /assets/images/675fc27ca23998da10ee7bbe_Frame%202085665023-p-800.png 800w, /assets/images/675fc27ca23998da10ee7bbe_Frame%202085665023-p-1080.png 1080w, /assets/images/675fc27ca23998da10ee7bbe_Frame%202085665023.png 1136w",
  },
  {
    slug: "swarna-rekha-necklace",
    name: "CULCATTA HARAM",
    code: "KJG015",
    metal: "gold",
    category: "CULCATTA HARAM",
    weight: "20g",
    purity: "91.6",
    description:
      "Presenting the Calcutta Haram, a truly captivating piece that beautifully merges classic charm with modern sophistication. Its elegant chain leads to a stunning teardrop pendant, intricately detailed and adorned with vibrant gemstones, creating a mesmerizing focal point. This exquisite piece embodies timeless artistry, designed to drape gracefully and add a touch of regal splendor to any ensemble. It's a testament to enduring craftsmanship and refined taste.",
    image: "/assets/images/679a2e1a588e45f5bdf0bbec_76-600x600.jpg",
    imageSrcset:
      "/assets/images/679a2e1a588e45f5bdf0bbec_76-600x600-p-500.jpg 500w, /assets/images/679a2e1a588e45f5bdf0bbec_76-600x600.jpg 600w",
  },
  {
    slug: "tarangini-necklace",
    name: "CULCUTTA CHOKER",
    code: "KJG030",
    metal: "gold",
    category: "CULCUTTA CHOKER",
    weight: "20g",
    purity: "91.6",
    description:
      "Adorn your neckline with the captivating Culcutta Choker, a masterpiece of intricate golden artistry. This resplendent piece features a beautifully textured wide band, showcasing a stunning interplay of traditional patterns and delicate detailing. A graceful golden drop suspends from the center, adding a touch of refined elegance and subtle movement. Perfect for adding a majestic flair to your special occasions, this choker embodies timeless sophistication and artisanal splendor, designed to be cherished.",
    image: "/assets/images/679a28b854faef826e777f82_17-600x600.jpg",
    imageSrcset:
      "/assets/images/679a28b854faef826e777f82_17-600x600-p-500.jpg 500w, /assets/images/679a28b854faef826e777f82_17-600x600.jpg 600w",
  },
  {
    slug: "tejasvi-necklace",
    name: "BENGALI CHOKER",
    code: "KJG028",
    metal: "gold",
    category: "BENGALI CHOKER",
    weight: "20g",
    purity: "91.6",
    description:
      "Adorn your neckline with the captivating Bengali Choker, a masterpiece of intricate design and luxurious presence. This stunning piece features a broad, textured golden band, exquisitely embellished with vibrant gemstones that highlight its regal contours. A central, exquisitely detailed motif anchors a delicate teardrop pendant, adding a graceful flourish. Perfect for grand celebrations, this choker embodies a fusion of traditional splendor and sophisticated elegance, promising to leave a lasting impression.",
    image: "/assets/images/679a295c72cd92f8d9f711c8_22-600x600.jpg",
    imageSrcset:
      "/assets/images/679a295c72cd92f8d9f711c8_22-600x600-p-500.jpg 500w, /assets/images/679a295c72cd92f8d9f711c8_22-600x600.jpg 600w",
  },
  {
    slug: "turkey-bangle",
    name: "TURKEY BANGLES",
    code: "KJG001",
    metal: "gold",
    category: "TURKEY BANGLES",
    weight: "40g",
    purity: "91.6",
    description:
      "Timeless craftsmanship meets intricate Turkish artistry in this bold pair of filigree bangles. Designed with delicate latticework and fine detailing, these bangles add an heirloom touch to your festive and wedding wardrobe. Their lightweight grace and ornate finish make them a statement piece for every tradition-forward celebration.",
    image: "/assets/images/679b6388181601b2a5970df1_puru%20(7)-600x600.png",
    imageSrcset:
      "/assets/images/679b6388181601b2a5970df1_puru%20(7)-600x600-p-500.png 500w, /assets/images/679b6388181601b2a5970df1_puru%20(7)-600x600.png 600w",
  },
  {
    slug: "turkey-bracelet-1",
    name: "TURKEY BRACELET",
    code: "KJG012",
    metal: "gold",
    category: "TURKEY BRACELET",
    weight: "4g",
    purity: "91.6",
    description:
      "A delicate blend of culture and craftsmanship, this Turkey bracelet features a graceful chain design with a polished finish. Lightweight yet striking, it brings a touch of heritage charm to modern-day styling—perfect for stacking or wearing solo with effortless poise.",
    image: "/assets/images/679b5ee210d0a2a59e6fa011_114.png",
    imageSrcset: "/assets/images/679b5ee210d0a2a59e6fa011_114.png 600w",
  },
  {
    slug: "vaidehi-necklace",
    name: "BOMBAY FANCY",
    code: "KJG020",
    metal: "gold",
    category: "BOMBAY FANCY",
    weight: "20g",
    purity: "91.6",
    description:
      "Presenting the stunning Bombay Fancy necklace, a magnificent creation that truly captures the essence of elaborate design. This opulent piece features beautifully crafted golden segments, each adorned with vibrant gemstones, leading to a grand central pendant. The intricate detailing, inspired by traditional motifs, creates a breathtaking display of artistry. Designed to make a captivating statement, this necklace promises to add an unparalleled touch of luxury and grace to any grand occasion.",
    image: "/assets/images/679a2caac1783614439e7b15_58-600x600.jpg",
    imageSrcset:
      "/assets/images/679a2caac1783614439e7b15_58-600x600-p-500.jpg 500w, /assets/images/679a2caac1783614439e7b15_58-600x600.jpg 600w",
  },
  {
    slug: "anklet",
    name: "Fancy Anklets",
    code: "KJS005",
    metal: "silver",
    category: "Fancy Anklets",
    weight: "20g",
    purity: "92.6",
    description:
      "Adorn your ankles with these delicate and stylish Fancy Anklets, a perfect blend of modern simplicity and charming detail. Each anklet features a slender silver-toned chain, gracefully interspersed with polished beads and subtle, shimmering golden accents. These elegant pieces are designed to catch the light with every step, adding a touch of understated glamour to your look. Perfect for everyday wear or to complement your favorite sandals, these anklets embody subtle sophistication and effortless beauty.",
    image: "/assets/images/676e4295315bd8d382a56fdb_25%20(2).png",
    imageSrcset:
      "/assets/images/676e4295315bd8d382a56fdb_25%20(2)-p-500.png 500w, /assets/images/676e4295315bd8d382a56fdb_25%20(2)-p-800.png 800w, /assets/images/676e4295315bd8d382a56fdb_25%20(2)-p-1080.png 1080w, /assets/images/676e4295315bd8d382a56fdb_25%20(2)-p-1600.png 1600w, /assets/images/676e4295315bd8d382a56fdb_25%20(2)-p-2000.png 2000w, /assets/images/676e4295315bd8d382a56fdb_25%20(2).png 2048w",
  },
  {
    slug: "bracelet-1-copy-2",
    name: "Fancy Anklets",
    code: "KJS007",
    metal: "silver",
    category: "Fancy Anklets",
    weight: "20g",
    purity: "91.6",
    description:
      "Adorn your ankles with these delicate and stylish Fancy Anklets, a perfect blend of modern simplicity and charming detail. Each anklet features a slender silver-toned chain, gracefully interspersed with polished beads and subtle, shimmering blue and white accented beads. These elegant pieces are designed to catch the light with every step, adding a touch of understated glamour to your look. Perfect for everyday wear or to complement your favorite sandals, these anklets embody subtle sophistication and effortless beauty.",
    image: "/assets/images/676270aca2ac9182313f0e9c_29%20(1).png",
    imageSrcset:
      "/assets/images/676270aca2ac9182313f0e9c_29%20(1)-p-500.png 500w, /assets/images/676270aca2ac9182313f0e9c_29%20(1)-p-800.png 800w, /assets/images/676270aca2ac9182313f0e9c_29%20(1)-p-1080.png 1080w, /assets/images/676270aca2ac9182313f0e9c_29%20(1)-p-1600.png 1600w, /assets/images/676270aca2ac9182313f0e9c_29%20(1)-p-2000.png 2000w, /assets/images/676270aca2ac9182313f0e9c_29%20(1).png 2048w",
  },
  {
    slug: "bracelet-1-copy",
    name: "Antique Bangles",
    code: "KJS013",
    metal: "silver",
    category: "Antique Bangles",
    weight: "15g",
    purity: "",
    description:
      "This exquisite Antique Bangle is a captivating piece that beautifully blends traditional design with vibrant elegance. Crafted from lustrous silver-toned metal, the bangle features a wide, structured band adorned with intricate rope-like detailing along its edges. A series of prominent, circular red gemstones are meticulously set across the band, creating a dazzling contrast and adding a touch of regal charm. Designed with a secure clasp, this bangle embodies a rich heritage of artistry and timeless beauty, promising to make a distinctive and elegant statement on any wrist.",
    image: "/assets/images/6761250ca3aea688b961702d_13.webp",
    imageSrcset:
      "/assets/images/6761250ca3aea688b961702d_13-p-500.png 500w, /assets/images/6761250ca3aea688b961702d_13-p-800.png 800w, /assets/images/6761250ca3aea688b961702d_13-p-1080.png 1080w, /assets/images/6761250ca3aea688b961702d_13-p-1600.png 1600w, /assets/images/6761250ca3aea688b961702d_13-p-2000.png 2000w, /assets/images/6761250ca3aea688b961702d_13.webp 2048w",
  },
  {
    slug: "silver-fancy-anklet-green-beads",
    name: "Fancy Anklets",
    code: "KJS014",
    metal: "silver",
    category: "Fancy Anklets",
    weight: "20g",
    purity: "92.6",
    description:
      "Adorn your ankles with these exquisite Fancy Anklets, a perfect blend of delicate design and modern elegance. Each anklet features a slender silver-toned chain, gracefully interspersed with shimmering green and clear beads, creating a captivating floral motif at intervals. The design cascades beautifully, adding a touch of fluid grace and sparkle with every step. Perfect for both everyday wear and special occasions, these anklets embody subtle sophistication and effortless beauty, designed to enhance your style with their enchanting allure.",
    image: "/assets/images/67612535f08d1468c07f9fd2_19.png",
    imageSrcset:
      "/assets/images/67612535f08d1468c07f9fd2_19-p-500.png 500w, /assets/images/67612535f08d1468c07f9fd2_19-p-800.png 800w, /assets/images/67612535f08d1468c07f9fd2_19-p-1080.png 1080w, /assets/images/67612535f08d1468c07f9fd2_19-p-1600.png 1600w, /assets/images/67612535f08d1468c07f9fd2_19-p-2000.png 2000w, /assets/images/67612535f08d1468c07f9fd2_19.png 2048w",
  },
  {
    slug: "silver-ladies-bracelet-oval-links",
    name: "Ladies Bracelet",
    code: "KJS004",
    metal: "silver",
    category: "Ladies Bracelet",
    weight: "28g",
    purity: "",
    description:
      "This elegant Ladies Bracelet is a contemporary piece designed for versatile sophistication. It features a finely crafted silver-toned chain composed of alternating elongated and shorter oval links, creating a beautiful sense of fluidity and light. The polished finish catches the eye with a subtle gleam, making it a perfect accessory for both everyday wear and special occasions. This bracelet embodies modern simplicity and refined charm, promising to elevate your style effortlessly.",
    image: "/assets/images/676e44019792b6db3dd0e5d9_30.png",
    imageSrcset:
      "/assets/images/676e44019792b6db3dd0e5d9_30-p-500.png 500w, /assets/images/676e44019792b6db3dd0e5d9_30-p-800.png 800w, /assets/images/676e44019792b6db3dd0e5d9_30-p-1080.png 1080w, /assets/images/676e44019792b6db3dd0e5d9_30-p-1600.png 1600w, /assets/images/676e44019792b6db3dd0e5d9_30-p-2000.png 2000w, /assets/images/676e44019792b6db3dd0e5d9_30.png 2048w",
  },
  {
    slug: "silver-mens-bracelet-textured-links",
    name: "Mens Bracelet",
    code: "KJS003",
    metal: "silver",
    category: "Mens Bracelet",
    weight: "28g",
    purity: "92.6",
    description:
      "Elevate your style with this sophisticated Men's Bracelet, a contemporary piece designed for the modern individual. This striking bracelet features a series of intricately crafted silver-toned links, alternating between polished segments and textured circular motifs that catch the light with subtle brilliance. The robust yet refined design makes it a versatile accessory for everyday wear or to add a distinctive touch to a special occasion. This bracelet embodies understated luxury and confident style, promising to be a cherished addition to any collection.",
    image: "/assets/images/676e438df90d258aa857c4de_14.png",
    imageSrcset: "/assets/images/676e438df90d258aa857c4de_14.png 600w",
  },
  {
    slug: "silver-fancy-anklet-floral-pink",
    name: "Fancy Anklets",
    code: "KJS018",
    metal: "silver",
    category: "Fancy Anklets",
    weight: "25g",
    purity: "",
    description:
      "Adorn your ankles with these exquisite Fancy Anklets, a magnificent display of delicate design and modern elegance. Each anklet features a substantial silver-toned chain, gracefully interspersed with shimmering floral motifs and adorned with subtle pink gemstones. The design cascades beautifully, creating a mesmerizing play of light and texture with every step. Perfect for both everyday wear and special occasions, these anklets embody subtle sophistication and effortless beauty, designed to enhance your style with their enchanting allure.",
    image: "/assets/images/6761256df08d1468c08033d8_23.png",
    imageSrcset:
      "/assets/images/6761256df08d1468c08033d8_23-p-500.png 500w, /assets/images/6761256df08d1468c08033d8_23-p-800.png 800w, /assets/images/6761256df08d1468c08033d8_23-p-1080.png 1080w, /assets/images/6761256df08d1468c08033d8_23-p-1600.png 1600w, /assets/images/6761256df08d1468c08033d8_23-p-2000.png 2000w, /assets/images/6761256df08d1468c08033d8_23.png 2048w",
  },
  {
    slug: "silver-fancy-anklet-teardrop-gems",
    name: "Fancy Anklets",
    code: "KJS017",
    metal: "silver",
    category: "Fancy Anklets",
    weight: "20g",
    purity: "92.6",
    description:
      "Adorn your ankles with these exquisite Fancy Anklets, a perfect blend of delicate design and modern elegance. Each anklet features a substantial silver-toned chain, gracefully interspersed with shimmering teardrop gemstones in vibrant shades of green and pink. The design cascades beautifully, adding a touch of fluid grace and sparkle with every step. Perfect for both everyday wear and special occasions, these anklets embody subtle sophistication and effortless beauty, designed to enhance your style with their enchanting allure.",
    image: "/assets/images/6761255b9f5feaafe791d192_22.png",
    imageSrcset:
      "/assets/images/6761255b9f5feaafe791d192_22-p-500.png 500w, /assets/images/6761255b9f5feaafe791d192_22-p-800.png 800w, /assets/images/6761255b9f5feaafe791d192_22-p-1080.png 1080w, /assets/images/6761255b9f5feaafe791d192_22-p-1600.png 1600w, /assets/images/6761255b9f5feaafe791d192_22-p-2000.png 2000w, /assets/images/6761255b9f5feaafe791d192_22.png 2048w",
  },
  {
    slug: "silver-fancy-anklet-rose-motifs",
    name: "Fancy Anklets",
    code: "KJS016",
    metal: "silver",
    category: "Fancy Anklets",
    weight: "20g",
    purity: "92.6",
    description:
      "Adorn your ankles with these exquisite Fancy Anklets, a perfect blend of delicate design and modern elegance. Each anklet features a slender silver-toned chain, gracefully interspersed with shimmering rose motifs adorned with colorful gemstones in shades of green and pink. The design cascades beautifully, adding a touch of fluid grace and sparkle with every step. Perfect for both everyday wear and special occasions, these anklets embody subtle sophistication and effortless beauty, designed to enhance your style with their enchanting allure.",
    image: "/assets/images/676125500a0c1e0a421d1fda_21.png",
    imageSrcset:
      "/assets/images/676125500a0c1e0a421d1fda_21-p-500.png 500w, /assets/images/676125500a0c1e0a421d1fda_21-p-800.png 800w, /assets/images/676125500a0c1e0a421d1fda_21-p-1080.png 1080w, /assets/images/676125500a0c1e0a421d1fda_21-p-1600.png 1600w, /assets/images/676125500a0c1e0a421d1fda_21-p-2000.png 2000w, /assets/images/676125500a0c1e0a421d1fda_21.png 2048w",
  },
  {
    slug: "silver-antique-anklet-leaf-floral",
    name: "Antique Anklets",
    code: "KJS015",
    metal: "silver",
    category: "Antique Anklets",
    weight: "25g",
    purity: "92.6",
    description:
      "Adorn your ankles with these magnificent Antique Anklets, a grand display of intricate craftsmanship and vibrant elegance. Each anklet features a substantial silver-toned chain, meticulously detailed with delicate leaf motifs and interspersed with charming floral patterns adorned with colorful gemstones in shades of green and pink. The design cascades beautifully, creating a mesmerizing play of light and texture with every step. Perfect for adding a touch of regal charm to special occasions, these anklets embody a rich heritage of artistry and timeless beauty, promising to make a distinctive and elegant statement.",
    image: "/assets/images/67612544b1c3db2d072eda81_20.png",
    imageSrcset:
      "/assets/images/67612544b1c3db2d072eda81_20-p-500.png 500w, /assets/images/67612544b1c3db2d072eda81_20-p-800.png 800w, /assets/images/67612544b1c3db2d072eda81_20-p-1080.png 1080w, /assets/images/67612544b1c3db2d072eda81_20-p-1600.png 1600w, /assets/images/67612544b1c3db2d072eda81_20-p-2000.png 2000w, /assets/images/67612544b1c3db2d072eda81_20.png 2048w",
  },
  {
    slug: "idoels-4",
    name: "Antique Idol",
    code: "KJS002",
    metal: "silver",
    category: "Antique Idol",
    weight: "28g",
    purity: "92.6",
    description:
      "This captivating sculpture, rendered in a lustrous silver-toned metal, depicts a wise sage figure, standing with a serene expression and holding sacred symbols, upon a beautifully detailed pedestal. The exquisite craftsmanship captures a sense of timeless reverence and profound spiritual presence. Perfect for your sacred space or as a distinguished collector's item, this idol embodies a rich heritage of devotion and artistic excellence, promising to inspire tranquility and admiration.",
    image: "/assets/images/67766f87652b4a6a3987f3a1_106.png",
    imageSrcset:
      "/assets/images/67766f87652b4a6a3987f3a1_106-p-500.png 500w, /assets/images/67766f87652b4a6a3987f3a1_106-p-800.png 800w, /assets/images/67766f87652b4a6a3987f3a1_106-p-1080.png 1080w, /assets/images/67766f87652b4a6a3987f3a1_106-p-1600.png 1600w, /assets/images/67766f87652b4a6a3987f3a1_106-p-2000.png 2000w, /assets/images/67766f87652b4a6a3987f3a1_106.png 2048w",
  },
  {
    slug: "idols-2",
    name: "Antique Idols",
    code: "KJS009",
    metal: "silver",
    category: "Antique Idols",
    weight: "28g",
    purity: "",
    description:
      "Behold this majestic Antique Idol, a revered piece that embodies divine grace and intricate artistry. This captivating sculpture, rendered in a lustrous silver-toned metal, depicts a revered deity playing a flute, standing gracefully upon a beautifully detailed pedestal. The exquisite craftsmanship captures a sense of timeless reverence and profound spiritual presence. Perfect for your sacred space or as a distinguished collector's item, this idol embodies a rich heritage of devotion and artistic excellence, promising to inspire tranquility and admiration.",
    image: "/assets/images/676126233009098d09e68cbb_7.webp",
    imageSrcset:
      "/assets/images/676126233009098d09e68cbb_7-p-500.png 500w, /assets/images/676126233009098d09e68cbb_7-p-800.png 800w, /assets/images/676126233009098d09e68cbb_7-p-1080.png 1080w, /assets/images/676126233009098d09e68cbb_7-p-1600.png 1600w, /assets/images/676126233009098d09e68cbb_7-p-2000.png 2000w, /assets/images/676126233009098d09e68cbb_7.webp 2048w",
  },
  {
    slug: "idols-3",
    name: "Antique Kuthuvilaku",
    code: "KJS008",
    metal: "silver",
    category: "Antique Kuthuvilaku",
    weight: "337g",
    purity: "92.6",
    description:
      "Behold this pair of magnificent Antique Kuthuvilaku (traditional lamps), revered pieces that embody divine grace and intricate artistry. Crafted from lustrous silver-toned metal, each lamp stands tall with a beautifully detailed base adorned with traditional motifs. The central pillar features elegant grooves and intricate carvings, leading up to a classic oil reservoir. A finely sculpted peacock figure crowns each lamp, adding a touch of majestic beauty. Perfect for your sacred space or as distinguished collector's items, these Kuthuvilakus embody a rich heritage of devotion and artistic excellence, promising to inspire tranquility and admiration.",
    image: "/assets/images/67627081e31b4678d5ba49cf_9%20(1).png",
    imageSrcset:
      "/assets/images/67627081e31b4678d5ba49cf_9%20(1)-p-500.png 500w, /assets/images/67627081e31b4678d5ba49cf_9%20(1)-p-800.png 800w, /assets/images/67627081e31b4678d5ba49cf_9%20(1)-p-1080.png 1080w, /assets/images/67627081e31b4678d5ba49cf_9%20(1)-p-1600.png 1600w, /assets/images/67627081e31b4678d5ba49cf_9%20(1)-p-2000.png 2000w, /assets/images/67627081e31b4678d5ba49cf_9%20(1).png 2048w",
  },
  {
    slug: "idols-5",
    name: "Antique Idol",
    code: "KJS001",
    metal: "silver",
    category: "Antique Idol",
    weight: "28g",
    purity: "92.5",
    description:
      "Behold this majestic Antique Idol, a revered piece that embodies divine grace and intricate artistry. This captivating sculpture, rendered in a lustrous silver-toned metal, depicts a deity with multiple arms, each holding sacred symbols, and a lower body transforming into a fish-like tail, standing upon a beautifully detailed pedestal. The exquisite craftsmanship captures a sense of timeless reverence and profound spiritual presence. Perfect for your sacred space or as a distinguished collector's item, this idol embodies a rich heritage of devotion and artistic excellence, promising to inspire tranquility and admiration.",
    image: "/assets/images/67766fa7d514e286b3ae7693_100.png",
    imageSrcset:
      "/assets/images/67766fa7d514e286b3ae7693_100-p-500.png 500w, /assets/images/67766fa7d514e286b3ae7693_100-p-800.png 800w, /assets/images/67766fa7d514e286b3ae7693_100-p-1080.png 1080w, /assets/images/67766fa7d514e286b3ae7693_100-p-1600.png 1600w, /assets/images/67766fa7d514e286b3ae7693_100-p-2000.png 2000w, /assets/images/67766fa7d514e286b3ae7693_100.png 2048w",
  },
  {
    slug: "idols",
    name: "Antique Idols",
    code: "KJS010",
    metal: "silver",
    category: "Antique Idols",
    weight: "28g",
    purity: "",
    description:
      "This captivating sculpture, rendered in a lustrous silver-toned metal, depicts a multi-armed deity holding sacred symbols, standing gracefully upon a beautifully detailed pedestal. The exquisite craftsmanship captures a sense of timeless reverence and profound spiritual presence. Perfect for your sacred space or as a distinguished collector's item, this idol embodies a rich heritage of devotion and artistic excellence, promising to inspire tranquility and admiration.",
    image: "/assets/images/67627018eaeb2463b24313b0_10%20(1).png",
    imageSrcset:
      "/assets/images/67627018eaeb2463b24313b0_10%20(1)-p-500.png 500w, /assets/images/67627018eaeb2463b24313b0_10%20(1)-p-800.png 800w, /assets/images/67627018eaeb2463b24313b0_10%20(1)-p-1080.png 1080w, /assets/images/67627018eaeb2463b24313b0_10%20(1)-p-1600.png 1600w, /assets/images/67627018eaeb2463b24313b0_10%20(1)-p-2000.png 2000w, /assets/images/67627018eaeb2463b24313b0_10%20(1).png 2048w",
  },
  {
    slug: "necklace1",
    name: "Mens chain",
    code: "KJS006",
    metal: "silver",
    category: "Mens chain",
    weight: "19.3g",
    purity: "92.6",
    description:
      "Elevate your everyday style with this robust Men's Chain, a statement piece designed for modern sophistication. This finely crafted silver-toned chain features a series of intricately linked oval segments, creating a substantial yet refined presence. The polished finish catches the light with subtle brilliance, making it a versatile accessory for both casual and formal wear. This chain embodies confident style and enduring quality, promising to be a cherished addition to any collection.",
    image: "/assets/images/67627465a42b98c5bbaee296_12.png",
    imageSrcset:
      "/assets/images/67627465a42b98c5bbaee296_12-p-500.png 500w, /assets/images/67627465a42b98c5bbaee296_12-p-800.png 800w, /assets/images/67627465a42b98c5bbaee296_12-p-1080.png 1080w, /assets/images/67627465a42b98c5bbaee296_12-p-1600.png 1600w, /assets/images/67627465a42b98c5bbaee296_12-p-2000.png 2000w, /assets/images/67627465a42b98c5bbaee296_12.png 2048w",
  },
  {
    slug: "pendant-1",
    name: "Antique Idol",
    code: "KJS024",
    metal: "silver",
    category: "Antique Idol",
    weight: "28g",
    purity: "92.6",
    description:
      "Behold this majestic Idol, a revered piece that embodies divine grace and intricate artistry. This captivating sculpture, rendered in a lustrous silver-toned metal, depicts a multi-armed deity with a distinctive animal head, holding sacred symbols, and standing gracefully upon a beautifully detailed pedestal. The exquisite craftsmanship captures a sense of timeless reverence and profound spiritual presence. Perfect for your sacred space or as a distinguished collector's item, this idol embodies a rich heritage of devotion and artistic excellence, promising to inspire tranquility and admiration.",
    image: "/assets/images/6761263843208175014554d5_15.webp",
    imageSrcset:
      "/assets/images/6761263843208175014554d5_15-p-500.png 500w, /assets/images/6761263843208175014554d5_15-p-800.png 800w, /assets/images/6761263843208175014554d5_15-p-1080.png 1080w, /assets/images/6761263843208175014554d5_15-p-1600.png 1600w, /assets/images/6761263843208175014554d5_15-p-2000.png 2000w, /assets/images/6761263843208175014554d5_15.webp 2048w",
  },
  {
    slug: "silver-antique-idol-kurma-avatar",
    name: "Antique Idol",
    code: "KJS023",
    metal: "silver",
    category: "Antique Idol",
    weight: "28g",
    purity: "92.6",
    description:
      "Behold this majestic Idol, a revered piece that embodies divine grace and intricate artistry. This captivating sculpture, rendered in a lustrous silver-toned metal, depicts a multi-armed deity with a turtle-like lower body, holding sacred symbols, and standing gracefully upon a beautifully detailed pedestal. The exquisite craftsmanship captures a sense of timeless reverence and profound spiritual presence. Perfect for your sacred space or as a distinguished collector's item, this idol embodies a rich heritage of devotion and artistic excellence, promising to inspire tranquility and admiration.",
    image: "/assets/images/67612644bb30041888fc9d40_18.webp",
    imageSrcset:
      "/assets/images/67612644bb30041888fc9d40_18-p-500.png 500w, /assets/images/67612644bb30041888fc9d40_18-p-800.png 800w, /assets/images/67612644bb30041888fc9d40_18-p-1080.png 1080w, /assets/images/67612644bb30041888fc9d40_18-p-1600.png 1600w, /assets/images/67612644bb30041888fc9d40_18-p-2000.png 2000w, /assets/images/67612644bb30041888fc9d40_18.webp 2048w",
  },
  {
    slug: "silver-antique-idol-rama-bow",
    name: "Antique Idol",
    code: "KJS022",
    metal: "silver",
    category: "Antique Idol",
    weight: "28g",
    purity: "92.6",
    description:
      "Behold this majestic Idol, a revered piece that embodies divine grace and intricate artistry. This captivating sculpture, rendered in a lustrous silver-toned metal, depicts a valiant deity holding a bow and arrow, standing gracefully upon a beautifully detailed pedestal. The exquisite craftsmanship captures a sense of timeless reverence and profound spiritual presence. Perfect for your sacred space or as a distinguished collector's item, this idol embodies a rich heritage of devotion and artistic excellence, promising to inspire tranquility and admiration.",
    image: "/assets/images/6761260c71dc5aa53837aca6_4.webp",
    imageSrcset:
      "/assets/images/6761260c71dc5aa53837aca6_4-p-500.png 500w, /assets/images/6761260c71dc5aa53837aca6_4-p-800.png 800w, /assets/images/6761260c71dc5aa53837aca6_4-p-1080.png 1080w, /assets/images/6761260c71dc5aa53837aca6_4-p-1600.png 1600w, /assets/images/6761260c71dc5aa53837aca6_4-p-2000.png 2000w, /assets/images/6761260c71dc5aa53837aca6_4.webp 2048w",
  },
  {
    slug: "pendant-4",
    name: "Antique Idol",
    code: "KJS021",
    metal: "silver",
    category: "Antique Idol",
    weight: "28g",
    purity: "92.6",
    description:
      "Behold this majestic Idol, a revered piece that embodies divine grace and intricate artistry. This captivating sculpture, rendered in a lustrous silver-toned metal, depicts a cheerful deity holding an umbrella and a small pot, standing gracefully upon a beautifully detailed pedestal. The exquisite craftsmanship captures a sense of timeless reverence and profound spiritual presence. Perfect for your sacred space or as a distinguished collector's item, this idol embodies a rich heritage of devotion and artistic excellence, promising to inspire tranquility and admiration.",
    image: "/assets/images/676125d19441e16dbe1ae0db_2.webp",
    imageSrcset:
      "/assets/images/676125d19441e16dbe1ae0db_2-p-500.png 500w, /assets/images/676125d19441e16dbe1ae0db_2-p-800.png 800w, /assets/images/676125d19441e16dbe1ae0db_2-p-1080.png 1080w, /assets/images/676125d19441e16dbe1ae0db_2-p-1600.png 1600w, /assets/images/676125d19441e16dbe1ae0db_2-p-2000.png 2000w, /assets/images/676125d19441e16dbe1ae0db_2.webp 2048w",
  },
  {
    slug: "silver-fancy-anklet-yellow-blue-beads",
    name: "Fancy Anklets",
    code: "KJS020",
    metal: "silver",
    category: "Fancy Anklets",
    weight: "15g",
    purity: "92.7",
    description:
      "Adorn your ankles with these delicate and stylish Fancy Anklets, a perfect blend of modern simplicity and charming detail. Each anklet features a slender silver-toned chain, gracefully interspersed with polished beads and subtle, shimmering yellow and light blue accented beads. These elegant pieces are designed to catch the light with every step, adding a touch of understated glamour to your look. Perfect for everyday wear or to complement your favorite sandals, these anklets embody subtle sophistication and effortless beauty.",
    image: "/assets/images/676125b32a0fdad633ac8876_26.png",
    imageSrcset:
      "/assets/images/676125b32a0fdad633ac8876_26-p-500.png 500w, /assets/images/676125b32a0fdad633ac8876_26-p-800.png 800w, /assets/images/676125b32a0fdad633ac8876_26-p-1080.png 1080w, /assets/images/676125b32a0fdad633ac8876_26-p-1600.png 1600w, /assets/images/676125b32a0fdad633ac8876_26-p-2000.png 2000w, /assets/images/676125b32a0fdad633ac8876_26.png 2048w",
  },
  {
    slug: "silver-fancy-anklet-evil-eye-bells",
    name: "Fancy Anklets",
    code: "KJS019",
    metal: "silver",
    category: "Fancy Anklets",
    weight: "25g",
    purity: "",
    description:
      "Adorn your ankles with these delightful Fancy Anklets, a perfect blend of delicate design and charming detail. Each anklet features a slender silver-toned chain, gracefully interspersed with polished beads, shimmering bell motifs, and vibrant evil eye beads in brilliant blue. These elegant pieces are designed to catch the light with every step, adding a touch of playful glamour to your look. Perfect for everyday wear or to complement your favorite sandals, these anklets embody subtle sophistication and effortless beauty.",
    image: "/assets/images/676125846dced8c03bc7261b_24.png",
    imageSrcset:
      "/assets/images/676125846dced8c03bc7261b_24-p-500.png 500w, /assets/images/676125846dced8c03bc7261b_24-p-800.png 800w, /assets/images/676125846dced8c03bc7261b_24-p-1080.png 1080w, /assets/images/676125846dced8c03bc7261b_24-p-1600.png 1600w, /assets/images/676125846dced8c03bc7261b_24-p-2000.png 2000w, /assets/images/676125846dced8c03bc7261b_24.png 2048w",
  },
  {
    slug: "ring-copy",
    name: "Baby Bracelet",
    code: "KJS011",
    metal: "silver",
    category: "Baby Bracelet",
    weight: "15g",
    purity: "92.6",
    description:
      "Presenting our charming Baby Bracelet, a delightful accessory designed with care for your little one. This adorable silver-toned bracelet features an adjustable band, adorned with a playful mix of smooth spherical beads and vibrant evil eye beads in shades of blue, pink, and black. Designed for gentle comfort and a touch of traditional protection, these bracelets add a sweet and colorful accent to any baby's wrist. They are a perfect blend of thoughtful design and adorable charm, making them a cherished gift for new arrivals.",
    image: "/assets/images/676124daacc48b8c3d2c145b_3.png",
    imageSrcset:
      "/assets/images/676124daacc48b8c3d2c145b_3-p-500.png 500w, /assets/images/676124daacc48b8c3d2c145b_3-p-800.png 800w, /assets/images/676124daacc48b8c3d2c145b_3-p-1080.png 1080w, /assets/images/676124daacc48b8c3d2c145b_3-p-1600.png 1600w, /assets/images/676124daacc48b8c3d2c145b_3-p-2000.png 2000w, /assets/images/676124daacc48b8c3d2c145b_3.png 2048w",
  },
  {
    slug: "silver-baby-bracelet-charm-beads",
    name: "Baby Bracelet",
    code: "KJS012",
    metal: "silver",
    category: "Baby Bracelet",
    weight: "15g",
    purity: "92.6",
    description:
      "Presenting our charming Baby Bracelet, a delightful accessory designed with care for your little one. This adorable silver-toned bracelet features an adjustable band, adorned with a playful mix of smooth spherical beads and two captivating charms: a vibrant yellow cartoon character with a red bow, and a delicate disc with a purple gemstone. Designed for gentle comfort and a touch of whimsical charm, these bracelets add a sweet and colorful accent to any baby's wrist. They are a perfect blend of thoughtful design and adorable flair, making them a cherished gift for new arrivals.",
    image: "/assets/images/676124e5a749577bb73a0a06_5.png",
    imageSrcset:
      "/assets/images/676124e5a749577bb73a0a06_5-p-500.png 500w, /assets/images/676124e5a749577bb73a0a06_5-p-800.png 800w, /assets/images/676124e5a749577bb73a0a06_5-p-1080.png 1080w, /assets/images/676124e5a749577bb73a0a06_5-p-1600.png 1600w, /assets/images/676124e5a749577bb73a0a06_5-p-2000.png 2000w, /assets/images/676124e5a749577bb73a0a06_5.png 2048w",
  },
  {
    slug: "necklace-2",
    name: "Diamond Necklace",
    code: "KJD004",
    metal: "diamond",
    category: "Diamond Necklace",
    weight: "150g",
    purity: "",
    description:
      "Symbol of lightness and delicacy, the hummingbird evokes curiosity and joy. Studio Design' PolyFaune collection features classic products with colorful patterns, inspired by the traditional japanese origamis. To wear with a chino or jeans. The sublimation textile printing process provides an exceptional color rendering and a color, guaranteed overtime.",
    image: "/assets/images/676279fbdbde280118329e2f_27.png",
    imageSrcset:
      "/assets/images/676279fbdbde280118329e2f_27-p-500.png 500w, /assets/images/676279fbdbde280118329e2f_27-p-800.png 800w, /assets/images/676279fbdbde280118329e2f_27-p-1080.png 1080w, /assets/images/676279fbdbde280118329e2f_27-p-1600.png 1600w, /assets/images/676279fbdbde280118329e2f_27-p-2000.png 2000w, /assets/images/676279fbdbde280118329e2f_27.png 2048w",
  },
  {
    slug: "diamond-necklace-kjd002",
    name: "Diamond Necklace",
    code: "KJD002",
    metal: "diamond",
    category: "Diamond Necklace",
    weight: "90g",
    purity: "",
    description:
      "Symbol of lightness and delicacy, the hummingbird evokes curiosity and joy. Studio Design' PolyFaune collection features classic products with colorful patterns, inspired by the traditional japanese origamis. To wear with a chino or jeans. The sublimation textile printing process provides an exceptional color rendering and a color, guaranteed overtime.",
    image: "/assets/images/676e48dcb047f5c6ba51986d_white%20jewel%2014.png",
    imageSrcset:
      "/assets/images/676e48dcb047f5c6ba51986d_white%20jewel%2014-p-500.png 500w, /assets/images/676e48dcb047f5c6ba51986d_white%20jewel%2014-p-800.png 800w, /assets/images/676e48dcb047f5c6ba51986d_white%20jewel%2014-p-1080.png 1080w, /assets/images/676e48dcb047f5c6ba51986d_white%20jewel%2014-p-1600.png 1600w, /assets/images/676e48dcb047f5c6ba51986d_white%20jewel%2014-p-2000.png 2000w, /assets/images/676e48dcb047f5c6ba51986d_white%20jewel%2014.png 2048w",
  },
  {
    slug: "diamond-necklace-kjd001",
    name: "Diamond Necklace",
    code: "KJD001",
    metal: "diamond",
    category: "Diamond Necklace",
    weight: "80g",
    purity: "",
    description:
      "Symbol of lightness and delicacy, the hummingbird evokes curiosity and joy. Studio Design' PolyFaune collection features classic products with colorful patterns, inspired by the traditional japanese origamis. To wear with a chino or jeans. The sublimation textile printing process provides an exceptional color rendering and a color, guaranteed overtime.",
    image:
      "/assets/images/676e4568ee5ddd9c1b62ea34_white%20jewel%2016%20(1).png",
    imageSrcset:
      "/assets/images/676e4568ee5ddd9c1b62ea34_white%20jewel%2016%20(1)-p-500.png 500w, /assets/images/676e4568ee5ddd9c1b62ea34_white%20jewel%2016%20(1)-p-800.png 800w, /assets/images/676e4568ee5ddd9c1b62ea34_white%20jewel%2016%20(1)-p-1080.png 1080w, /assets/images/676e4568ee5ddd9c1b62ea34_white%20jewel%2016%20(1)-p-1600.png 1600w, /assets/images/676e4568ee5ddd9c1b62ea34_white%20jewel%2016%20(1)-p-2000.png 2000w, /assets/images/676e4568ee5ddd9c1b62ea34_white%20jewel%2016%20(1).png 2048w",
  },
  {
    slug: "diamond-choker-kjd005",
    name: "Diamond Choker",
    code: "KJD005",
    metal: "diamond",
    category: "Diamond Choker",
    weight: "250g",
    purity: "",
    description:
      "Symbol of lightness and delicacy, the hummingbird evokes curiosity and joy. Studio Design' PolyFaune collection features classic products with colorful patterns, inspired by the traditional japanese origamis. To wear with a chino or jeans. The sublimation textile printing process provides an exceptional color rendering and a color, guaranteed overtime.",
    image: "/assets/images/676279ad69ca12cf482b6029_28.png",
    imageSrcset:
      "/assets/images/676279ad69ca12cf482b6029_28-p-500.png 500w, /assets/images/676279ad69ca12cf482b6029_28-p-800.png 800w, /assets/images/676279ad69ca12cf482b6029_28-p-1080.png 1080w, /assets/images/676279ad69ca12cf482b6029_28-p-1600.png 1600w, /assets/images/676279ad69ca12cf482b6029_28-p-2000.png 2000w, /assets/images/676279ad69ca12cf482b6029_28.png 2048w",
  },
  {
    slug: "ring-2",
    name: "Diamond Ring",
    code: "KJD003",
    metal: "diamond",
    category: "Diamond Ring",
    weight: "100g",
    purity: "",
    description:
      "Symbol of lightness and delicacy, the hummingbird evokes curiosity and joy. Studio Design' PolyFaune collection features classic products with colorful patterns, inspired by the traditional japanese origamis. To wear with a chino or jeans. The sublimation textile printing process provides an exceptional color rendering and a color, guaranteed overtime.",
    image: "/assets/images/67627a5f630cb3671e5475b1_8.png",
    imageSrcset:
      "/assets/images/67627a5f630cb3671e5475b1_8-p-500.png 500w, /assets/images/67627a5f630cb3671e5475b1_8-p-800.png 800w, /assets/images/67627a5f630cb3671e5475b1_8-p-1080.png 1080w, /assets/images/67627a5f630cb3671e5475b1_8-p-1600.png 1600w, /assets/images/67627a5f630cb3671e5475b1_8-p-2000.png 2000w, /assets/images/67627a5f630cb3671e5475b1_8.png 2048w",
  },
  {
    slug: "diamond-ring-kjd006",
    name: "Diamond Ring",
    code: "KJD006",
    metal: "diamond",
    category: "Diamond Ring",
    weight: "90g",
    purity: "",
    description:
      "Symbol of lightness and delicacy, the hummingbird evokes curiosity and joy. Studio Design' PolyFaune collection features classic products with colorful patterns, inspired by the traditional japanese origamis. To wear with a chino or jeans. The sublimation textile printing process provides an exceptional color rendering and a color, guaranteed overtime.",
    image: "/assets/images/67627a255c7fb2f6701eec3d_6%20(1).png",
    imageSrcset:
      "/assets/images/67627a255c7fb2f6701eec3d_6%20(1)-p-500.png 500w, /assets/images/67627a255c7fb2f6701eec3d_6%20(1)-p-800.png 800w, /assets/images/67627a255c7fb2f6701eec3d_6%20(1)-p-1080.png 1080w, /assets/images/67627a255c7fb2f6701eec3d_6%20(1)-p-1600.png 1600w, /assets/images/67627a255c7fb2f6701eec3d_6%20(1)-p-2000.png 2000w, /assets/images/67627a255c7fb2f6701eec3d_6%20(1).png 2048w",
  },
];

export const blogPosts: BlogPost[] = [
  {
    slug: "akshaya-tritiya-gold-offers-in-porur---why-this-is-the-best-time-to-buy-gold",
    title:
      "Akshaya Tritiya Gold Offers in Porur — Why This Is the Best Time to Buy Gold",
    thumbnail: "/assets/images/69e32f4f46d62d7f20bf5b63_pondy%20bazar.png",
    excerpt:
      "Akshaya Tritiya is one of the most auspicious days in India to invest in gold and jewellery. The word “Akshaya” means “never diminishing,” symbolizing eternal wealth and prosperity. This makes it the perfect occasion to buy gold for weddings, investments, and family traditions.",
    date: "April 18, 2026",
    body: [
      {
        type: "h2",
        text: " Celebrate Akshaya Tritiya with Prosperity and Gold",
      },
      {
        type: "p",
        text: 'Akshaya Tritiya is one of the most auspicious days in India to invest in gold and jewellery. The word "Akshaya" means "never diminishing," symbolizing eternal wealth and prosperity. This makes it the perfect occasion to buy gold for weddings, investments, and family traditions.',
      },
      {
        type: "p",
        text: "If you are looking for the best Akshaya Tritiya gold offers in Porur, Kerala Jewellers brings you exclusive festive collections and limited-time deals.",
      },
      {
        type: "h2",
        text: "Why Buying Gold on Akshaya Tritiya Is Special",
      },
      {
        type: "p",
        text: "Buying gold during Akshaya Tritiya is believed to bring:",
      },
      {
        type: "ul",
        items: [
          "Long-term prosperity",
          "Financial growth",
          "Good fortune for families",
        ],
      },
      {
        type: "p",
        text: "Many customers choose this day to purchase:",
      },
      {
        type: "ul",
        items: ["Bridal jewellery", "Gold coins", "Investment jewellery"],
      },
      {
        type: "p",
        text: "This tradition has made Akshaya Tritiya one of the busiest and most rewarding days for jewellery buyers.",
      },
      {
        type: "h2",
        text: "Best Place to Buy Gold in Porur",
      },
      {
        type: "p",
        text: "If you are searching for a trusted jewellery shop in Porur, Kerala Jewellers stands out for its quality, craftsmanship, and customer service.",
      },
      {
        type: "p",
        text: "We offer:",
      },
      {
        type: "ul",
        items: [
          "Certified gold jewellery",
          "Exclusive bridal collections",
          "Transparent pricing",
          "Friendly in-store experience",
        ],
      },
      {
        type: "p",
        text: "Our showroom in Porur, Chennai is designed to help you explore a wide range of traditional and modern jewellery.",
      },
      {
        type: "h2",
        text: "Exclusive Akshaya Tritiya Offers in Porur",
      },
      {
        type: "p",
        text: "To make your purchase even more special, Kerala Jewellers brings you exciting festive offers:",
      },
      {
        type: "ul",
        items: [
          "0% making charges on selected designs",
          "Special discounts on bridal jewellery",
          "Free gifts on eligible purchases",
        ],
      },
      {
        type: "p",
        text: "These offers are available only for a limited time during the Akshaya Tritiya season.",
      },
      {
        type: "h2",
        text: "Explore Our Bridal & Wedding Collections",
      },
      {
        type: "p",
        text: "Akshaya Tritiya is the perfect time to shop for weddings. Our collection includes:",
      },
      {
        type: "ul",
        items: [
          "Traditional gold necklaces",
          "Temple jewellery",
          "Bridal sets",
          "Modern lightweight designs",
        ],
      },
      {
        type: "p",
        text: "Whether you are preparing for your big day or investing in timeless jewellery, we have something for everyone.",
      },
      {
        type: "h2",
        text: "Visit Kerala Jewellers, Porur Today",
      },
      {
        type: "p",
        text: "Celebrate this Akshaya Tritiya with elegance and tradition. Visit Kerala Jewellers in Porur to explore our latest collections and festive offers.",
      },
      {
        type: "p",
        text: "Location: Porur, Chennai Contact us for more details or visit our showroom",
      },
      {
        type: "p",
        text: "Make this auspicious occasion truly special with gold that lasts forever.",
      },
      {
        type: "p",
        text: '"',
      },
    ],
  },
  {
    slug: "akshaya-tritiya-jewellery-collections-in-porur---explore-exclusive-gold-designs-in-chennai",
    title:
      "Akshaya Tritiya Jewellery Collections in Porur — Explore Exclusive Gold Designs in Chennai",
    thumbnail: "/assets/images/69e32fe16738875c8e2b6d29_Untitled-2-01.jpg",
    excerpt:
      "Akshaya Tritiya is the perfect occasion to invest in gold and celebrate tradition with elegance. Jewellery bought on this day is believed to bring lasting prosperity, making it an ideal time to explore new designs and collections.",
    date: "April 18, 2026",
    body: [
      {
        type: "h2",
        text: " Discover Stunning Gold Collections for Akshaya Tritiya",
      },
      {
        type: "p",
        text: "Akshaya Tritiya is the perfect occasion to invest in gold and celebrate tradition with elegance. Jewellery bought on this day is believed to bring lasting prosperity, making it an ideal time to explore new designs and collections.",
      },
      {
        type: "p",
        text: "If you are searching for exclusive Akshaya Tritiya jewellery collections in Porur, Kerala Jewellers offers a wide range of premium gold designs crafted for every occasion.",
      },
      {
        type: "h2",
        text: "Bridal Jewellery Collections for the Festive Season",
      },
      {
        type: "p",
        text: "Akshaya Tritiya is a popular time for wedding shopping. Our bridal collections are designed to reflect tradition, elegance, and grandeur.",
      },
      {
        type: "ul",
        items: [
          "Heavy gold bridal sets",
          "Traditional temple jewellery",
          "Layered necklace designs",
          "Matching earrings and bangles",
        ],
      },
      {
        type: "p",
        text: "These collections are perfect for brides who want a timeless and luxurious look.",
      },
      {
        type: "h2",
        text: " Lightweight & Daily Wear Gold Jewellery",
      },
      {
        type: "p",
        text: "Not every purchase has to be heavy. For customers looking for comfort and style, our lightweight collections are ideal.",
      },
      {
        type: "ul",
        items: [
          "Minimal gold chains",
          "Elegant studs and small earrings",
          "Office-wear bangles",
          "Trendy daily wear designs",
        ],
      },
      {
        type: "p",
        text: "These pieces are affordable, stylish, and perfect for everyday use.",
      },
      {
        type: "h2",
        text: "Traditional & Temple Jewellery Designs",
      },
      {
        type: "p",
        text: "Celebrate Akshaya Tritiya with heritage-inspired jewellery. Our traditional collections feature intricate craftsmanship and cultural significance.",
      },
      {
        type: "ul",
        items: [
          "Antique-finish gold jewellery",
          "Temple-inspired motifs",
          "South Indian classic designs",
        ],
      },
      {
        type: "p",
        text: "These are perfect for festive occasions and special events.",
      },
      {
        type: "h2",
        text: "Modern & Trending Gold Designs",
      },
      {
        type: "p",
        text: "For those who prefer a contemporary look, Kerala Jewellers also offers modern collections that blend tradition with current trends.",
      },
      {
        type: "ul",
        items: [
          "Sleek gold necklaces",
          "Geometric patterns",
          "Fusion jewellery designs",
        ],
      },
      {
        type: "p",
        text: "These collections are ideal for younger buyers and modern fashion preferences.",
      },
      {
        type: "h2",
        text: "Exclusive Akshaya Tritiya Collection Offers in Porur",
      },
      {
        type: "p",
        text: "To make your shopping even more special, Kerala Jewellers brings festive offers on selected collections:",
      },
      {
        type: "ul",
        items: [
          "Special pricing on bridal jewellery",
          "Discounts on lightweight collections",
          "Limited-time festive benefits",
        ],
      },
      {
        type: "p",
        text: "These offers are available only during the Akshaya Tritiya season.",
      },
      {
        type: "h2",
        text: "Visit Kerala Jewellers, Porur to Explore the Collections",
      },
      {
        type: "p",
        text: "If you're looking for a trusted jewellery shop in Porur, visit Kerala Jewellers to experience a wide range of Akshaya Tritiya collections in person.",
      },
      {
        type: "p",
        text: "Porur, Chennai Visit our showroom or contact us for details",
      },
      {
        type: "p",
        text: "Celebrate this auspicious occasion with gold that reflects beauty, tradition, and prosperity.",
      },
      {
        type: "p",
        text: '"',
      },
    ],
  },
  {
    slug: "best-jewellery-shopping-in-purasawalkam-discover-trusted-designs-at",
    title:
      "Best Jewellery Shopping in Purasawalkam? Discover Trusted Designs at",
    thumbnail:
      "/assets/images/69e5de9a55c4196eb7948b2b_WhatsApp%20Image%202026-04-18%20at%203.50.49%20PM.jpeg",
    excerpt:
      "is one of the busiest and most popular shopping areas in Chennai. Known for fashion stores, family shopping, and traditional markets, it is also a go-to destination for people searching for quality gold jewellery, bridal collections, and elegant gifts.",
    date: "April 20, 2026",
    body: [
      {
        type: "p",
        text: "is one of the busiest and most popular shopping areas in Chennai. Known for fashion stores, family shopping, and traditional markets, it is also a go-to destination for people searching for quality gold jewellery, bridal collections, and elegant gifts.",
      },
      {
        type: "p",
        text: "If you are looking for a trusted jewellery store in Purasawalkam, Kerala Jewellers is a name worth visiting.",
      },
      {
        type: "h2",
        text: "Why Purasawalkam is Popular for Jewellery Shopping",
      },
      {
        type: "p",
        text: "Families across Chennai visit Purasawalkam because it offers convenience, variety, and easy access. Whether it is a wedding purchase, festive shopping, or buying a special gift, the area remains one of the city's favorite shopping hubs.",
      },
      {
        type: "p",
        text: "That makes choosing the right jeweller even more important.",
      },
      {
        type: "h2",
        text: "Find Gold Jewellery for Every Occasion",
      },
      {
        type: "p",
        text: "At Kerala Jewellers, customers can explore collections suitable for:",
      },
      {
        type: "ul",
        items: [
          "Wedding and bridal jewellery",
          "Gold necklaces and chains",
          "Bangles and bracelets",
          "Earrings and studs",
          "Rings and gifting jewellery",
          "Traditional and modern designs",
        ],
      },
      {
        type: "p",
        text: "Whether you prefer classic South Indian jewellery or lightweight trendy styles, there are options for every taste.",
      },
      {
        type: "h2",
        text: "Trusted Jewellery Store Near Purasawalkam",
      },
      {
        type: "p",
        text: "When buying jewellery, trust matters as much as design. Customers want purity, elegant craftsmanship, and a smooth buying experience. That is why many jewellery buyers near Purasawalkam look for reputed names they can rely on.",
      },
      {
        type: "p",
        text: "Kerala Jewellers continues to be a preferred choice for families seeking quality and service.",
      },
      {
        type: "h2",
        text: "Bridal Jewellery Shopping Made Easy",
      },
      {
        type: "p",
        text: "Planning a wedding can be stressful, especially when searching for the perfect jewellery. Brides and families need beautiful matching sets, timeless designs, and dependable service.",
      },
      {
        type: "p",
        text: "If you are shopping in Purasawalkam for bridal jewellery, Kerala Jewellers offers collections designed for life's biggest celebrations.",
      },
      {
        type: "h2",
        text: "Why Choose Kerala Jewellers in Purasawalkam Area?",
      },
      {
        type: "p",
        text: "Customers choose Kerala Jewellers for:",
      },
      {
        type: "ul",
        items: [
          "Trusted gold jewellery shopping",
          "Elegant bridal collections",
          "Traditional and modern styles",
          "Convenient shopping near Purasawalkam",
          "Friendly customer experience",
        ],
      },
      {
        type: "h2",
        text: "Visit Today",
      },
      {
        type: "p",
        text: "If you are searching for the best jewellery shop in Purasawalkam, explore the timeless collections at Kerala Jewellers and find jewellery made for every special moment.",
      },
      {
        type: "p",
        text: '"',
      },
    ],
  },
  {
    slug: "bridal-gold-jewellery-trends-in-kerala-2026-guide",
    title: "Bridal Gold Jewellery Trends in Kerala (2026 Guide)",
    thumbnail: "/assets/images/69df5e909c8d2a905c917b05_dty.png",
    excerpt:
      "Kerala has always been known for its rich tradition of gold jewellery, especially when it comes to weddings. Brides in Kerala don’t just wear jewellery—they showcase heritage, elegance, and timeless beauty. If you’re planning your wedding or looking for the latest styles, this guide covers the top bridal gold jewellery trends in Kerala for 2026.",
    date: "April 17, 2026",
    body: [
      {
        type: "p",
        text: "Kerala has always been known for its rich tradition of gold jewellery, especially when it comes to weddings. Brides in Kerala don't just wear jewellery\"they showcase heritage, elegance, and timeless beauty. If you're planning your wedding or looking for the latest styles, this guide covers the top bridal gold jewellery trends in Kerala for 2026.",
      },
      {
        type: "h2",
        text: "Why Gold Jewellery is Essential in Kerala Weddings",
      },
      {
        type: "p",
        text: "Gold holds deep cultural and emotional value in Kerala. It symbolizes prosperity, purity, and family tradition. From temple jewellery to layered necklaces, bridal gold jewellery is an important part of every Kerala wedding.",
      },
      {
        type: "p",
        text: "Many families also see gold as an investment, making it both a style statement and a financial asset.",
      },
      {
        type: "h2",
        text: "Top Bridal Gold Jewellery Trends in Kerala (2026)",
      },
      {
        type: "p",
        text: "Temple jewellery continues to dominate Kerala bridal fashion. These designs feature traditional motifs like Lakshmi, peacocks, and floral patterns. They pair beautifully with sarees like Kasavu and silk sarees.",
      },
      {
        type: "p",
        text: "Brides are now choosing multiple layers of necklaces instead of a single heavy piece. This gives a royal and grand look while allowing flexibility in styling.",
      },
      {
        type: "p",
        text: "Antique gold jewellery with a matte finish is trending. It gives a vintage look and pairs perfectly with traditional bridal outfits.",
      },
      {
        type: "p",
        text: "Modern brides are also opting for lightweight gold jewellery that offers comfort without compromising on style. These pieces are perfect for long wedding events.",
      },
      {
        type: "p",
        text: "Personalized jewellery with initials, meaningful symbols, or custom designs is becoming popular among Kerala brides.",
      },
      {
        type: "h2",
        text: "How to Choose the Right Bridal Jewellery",
      },
      {
        type: "p",
        text: "Always choose jewellery that complements your bridal saree. Traditional sarees go well with temple jewellery, while designer sarees can be paired with modern styles.",
      },
      {
        type: "p",
        text: "Avoid wearing all heavy pieces. Mix statement jewellery with simpler designs for a balanced look.",
      },
      {
        type: "p",
        text: '"',
      },
    ],
  },
  {
    slug: "gold-jewellery-trends-tamil-nadu-2026",
    title: "Gold Jewellery Trends in Tamil Nadu 2026",
    thumbnail: "/assets/images/69df5e8c23a90c1879ed4573_kjp%20advestiment.png",
    excerpt: "Gold Jewellery Trends in Tamil Nadu 2026",
    date: "April 15, 2026",
    body: [
      {
        type: "p",
        text: "Gold Jewellery Trends in Tamil Nadu 2026",
      },
      {
        type: "p",
        text: "Gold jewellery in Tamil Nadu has always been a symbol of tradition, elegance, and cultural pride. In 2026, the trend is all about blending timeless heritage with modern style. At Kerala Jewellers Chennai, we bring you the latest gold jewellery designs that perfectly match today's fashion while staying rooted in tradition.",
      },
      {
        type: "p",
        text: "If you're looking for the best gold jewellery in Chennai, here are the top trends you should explore this year.",
      },
      {
        type: "p",
        text: "Minimalist & Lightweight Gold Jewellery",
      },
      {
        type: "p",
        text: "Lightweight gold jewellery is becoming increasingly popular for daily wear. Simple chains, sleek bangles, and minimal pendants are perfect for office use and casual outings. These designs are comfortable, stylish, and easy to wear every day.",
      },
      {
        type: "p",
        text: "Temple Jewellery Revival",
      },
      {
        type: "p",
        text: "Traditional temple jewellery is making a strong comeback in 2026. Inspired by South Indian heritage, these pieces feature intricate carvings of deities, peacocks, and lotus motifs. Perfect for weddings and festive occasions, temple jewellery remains a favorite among Tamil Nadu customers.",
      },
      {
        type: "p",
        text: "Personalised Gold Jewellery",
      },
      {
        type: "p",
        text: "Custom jewellery is trending like never before. Name pendants, engraved bangles, and initial-based designs add a personal touch and make meaningful gifts. At Kerala Jewellers, we offer customised gold jewellery tailored to your style.",
      },
      {
        type: "p",
        text: "Layered Gold Necklaces",
      },
      {
        type: "p",
        text: "Layering multiple gold chains is a modern trend that adds elegance to any outfit. Mixing different chain lengths creates a bold yet classy look that works for both traditional and western outfits.",
      },
      {
        type: "p",
        text: "Fusion Jewellery Designs",
      },
      {
        type: "p",
        text: "Fusion jewellery combines traditional craftsmanship with modern aesthetics. These designs are versatile and can be styled with silk sarees or contemporary outfits, making them perfect for any occasion.",
      },
      {
        type: "p",
        text: "Explore Gold Jewellery at Kerala Jewellers Chennai",
      },
      {
        type: "p",
        text: "Visit Kerala Jewellers in Porur, Pondy Bazar, or Purasaiwalkam to explore the latest gold jewellery collections in Tamil Nadu. Whether you're shopping for daily wear or special occasions, we have something perfect for you.",
      },
      {
        type: "p",
        text: "Visit us today and discover timeless gold jewellery crafted with perfection.",
      },
      {
        type: "p",
        text: '"',
      },
    ],
  },
  {
    slug: "kerala-jewellers---trusted-gold-jewellery-destination-in-chennai",
    title: "Kerala Jewellers — Trusted Gold Jewellery Destination in Chennai",
    thumbnail: "/assets/images/69e4788ef95c1fcead0258f7_rgndghngh.png",
    excerpt:
      "When it comes to timeless elegance, purity, and trust, Kerala Jewellers stands as a preferred destination for jewellery lovers in Chennai. With a beautiful range of traditional and modern ornaments, Kerala Jewellers offers jewellery crafted for every celebration, milestone, and special occasion.",
    date: "April 19, 2026",
    body: [
      {
        type: "p",
        text: "When it comes to timeless elegance, purity, and trust, Kerala Jewellers stands as a preferred destination for jewellery lovers in Chennai. With a beautiful range of traditional and modern ornaments, Kerala Jewellers offers jewellery crafted for every celebration, milestone, and special occasion.",
      },
      {
        type: "h2",
        text: "Wide Range of Gold Jewellery Collections",
      },
      {
        type: "p",
        text: "At Kerala Jewellers, customers can explore an exquisite selection of:",
      },
      {
        type: "ul",
        items: [
          "Gold Necklaces",
          "Bridal Jewellery Sets",
          "Earrings & Jhumkas",
          "Bangles & Bracelets",
          "Chains & Pendants",
          "Rings for Men & Women",
          "Temple Jewellery",
          "Rose Gold Collections",
          "Lightweight Daily Wear Jewellery",
        ],
      },
      {
        type: "p",
        text: "Each piece is designed with attention to detail, combining heritage craftsmanship with modern style.",
      },
      {
        type: "h2",
        text: "Trusted Purity and Quality",
      },
      {
        type: "p",
        text: 'Buying jewellery is not just a purchase"it is an investment. Kerala Jewellers is known for offering trusted gold purity, quality workmanship, and customer satisfaction. Every design reflects elegance and lasting value.',
      },
      {
        type: "h2",
        text: "Perfect Jewellery for Every Occasion",
      },
      {
        type: "p",
        text: "Whether you are shopping for:",
      },
      {
        type: "ul",
        items: [
          "Weddings",
          "Engagements",
          "Akshaya Tritiya",
          "Diwali",
          "Birthday Gifts",
          "Anniversary Gifts",
          "Festive Celebrations",
        ],
      },
      {
        type: "p",
        text: "Kerala Jewellers has collections suited for every moment.",
      },
      {
        type: "h2",
        text: "Convenient Locations in Chennai",
      },
      {
        type: "p",
        text: "Visit Kerala Jewellers at our Chennai branches:",
      },
      {
        type: "ul",
        items: ["Porur", "Purasaiwalkam", "Pondy Bazar"],
      },
      {
        type: "p",
        text: "Our stores welcome you with warm service and a comfortable shopping experience.",
      },
      {
        type: "h2",
        text: "Why Choose Kerala Jewellers?",
      },
      {
        type: "ul",
        items: [
          "Trusted Jewellery Store in Chennai",
          "Elegant Traditional & Modern Designs",
          "Bridal and Festive Collections",
          "Quality Craftsmanship",
          "Customer-Friendly Service",
          "Multiple Convenient Branches",
        ],
      },
      {
        type: "h2",
        text: "Visit Kerala Jewellers Today",
      },
      {
        type: "p",
        text: "If you are looking for the best gold jewellery shop in Chennai, Kerala Jewellers is your destination for beauty, trust, and timeless designs. Visit our stores today and discover jewellery made to celebrate life's finest moments.",
      },
      {
        type: "p",
        text: '"',
      },
    ],
  },
  {
    slug: "kshaya-tritiya-gold-buying-guide-2026---best-jewellery-offers-in-porur-chennai",
    title:
      "kshaya Tritiya Gold Buying Guide 2026 — Best Jewellery Offers in Porur, Chennai",
    thumbnail: "/assets/images/69e32fa4d2963d91340807f8_carousel-01.jpg",
    excerpt:
      "Akshaya Tritiya is one of the most powerful days in the Indian calendar for starting something new—especially buying gold. It is believed that any investment made on this day grows continuously and brings lasting prosperity.",
    date: "April 18, 2026",
    body: [
      {
        type: "h2",
        text: " What Makes Akshaya Tritiya So Important?",
      },
      {
        type: "p",
        text: 'Akshaya Tritiya is one of the most powerful days in the Indian calendar for starting something new"especially buying gold. It is believed that any investment made on this day grows continuously and brings lasting prosperity.',
      },
      {
        type: "p",
        text: "That's why thousands of families choose this occasion to purchase gold jewellery, coins, and bridal collections.",
      },
      {
        type: "p",
        text: "If you are searching for the best Akshaya Tritiya gold offers in Porur, this guide will help you make the right decision.",
      },
      {
        type: "h2",
        text: "What Should You Buy This Akshaya Tritiya?",
      },
      {
        type: "p",
        text: "Choosing the right jewellery matters. Here are the most popular options:",
      },
      {
        type: "p",
        text: "Perfect for upcoming weddings. Investing now helps you avoid price fluctuations later.",
      },
      {
        type: "p",
        text: "A simple and meaningful way to start a tradition or investment.",
      },
      {
        type: "p",
        text: "Lightweight and stylish jewellery that you can use every day.",
      },
      {
        type: "h2",
        text: "Why Choose a Local Jewellery Shop in Porur?",
      },
      {
        type: "p",
        text: "When buying gold, trust matters more than anything. A reliable local showroom gives you:",
      },
      {
        type: "ul",
        items: [
          "Genuine and certified gold",
          "Transparent pricing",
          "Personalized service",
          "Easy access for future purchases",
        ],
      },
      {
        type: "p",
        text: "Kerala Jewellers in Porur, Chennai is known for combining tradition with modern designs, making it a preferred choice for many families.",
      },
      {
        type: "h2",
        text: "Akshaya Tritiya Offers You Shouldn't Miss",
      },
      {
        type: "p",
        text: "Festive offers make this the perfect time to buy. At Kerala Jewellers, you can enjoy:",
      },
      {
        type: "ul",
        items: [
          "Reduced or zero making charges on selected jewellery",
          "Special festive discounts on gold collections",
          "Exclusive bridal offers for wedding shoppers",
        ],
      },
      {
        type: "p",
        text: "These limited-time offers help you get more value for your purchase.",
      },
      {
        type: "h2",
        text: "Tips to Buy Gold Smartly This Festival",
      },
      {
        type: "p",
        text: "Before you visit a jewellery store, keep these tips in mind:",
      },
      {
        type: "ul",
        items: [
          "Check the current gold rate",
          "Decide your budget in advance",
          "Choose BIS hallmarked jewellery",
          "Explore multiple designs before buying",
        ],
      },
      {
        type: "p",
        text: "Planning ahead ensures you make a smart and satisfying purchase.",
      },
      {
        type: "h2",
        text: "Discover Stunning Jewellery Collections in Porur",
      },
      {
        type: "p",
        text: "From traditional temple jewellery to modern minimalist designs, Kerala Jewellers offers a wide range of collections suitable for every occasion.",
      },
      {
        type: "p",
        text: "Whether you're buying for a wedding, investment, or gifting, Akshaya Tritiya is the ideal time to explore premium gold jewellery in Chennai.",
      },
      {
        type: "p",
        text: '"',
      },
    ],
  },
  {
    slug: "looking-for-the-best-jewellery-shop-in-purasawalkam-heres-why-shoppers-choose",
    title:
      "Looking for the Best Jewellery Shop in Purasawalkam? Here’s Why Shoppers Choose",
    thumbnail: "/assets/images/69df5e8c23a90c1879ed4573_kjp%20advestiment.png",
    excerpt:
      "has long been one of the most loved shopping destinations in Chennai. From clothing and accessories to family purchases and festive shopping, thousands of people visit the area every week. When it comes to jewellery shopping, customers want one thing above all else—trust.",
    date: "April 20, 2026",
    body: [
      {
        type: "p",
        text: 'has long been one of the most loved shopping destinations in Chennai. From clothing and accessories to family purchases and festive shopping, thousands of people visit the area every week. When it comes to jewellery shopping, customers want one thing above all else"trust.',
      },
      {
        type: "p",
        text: "That is why many families searching for gold jewellery in Purasawalkam turn to Kerala Jewellers.",
      },
      {
        type: "h2",
        text: "The Problem: Too Many Choices, Too Little Trust",
      },
      {
        type: "p",
        text: "Shopping in a busy market area can feel overwhelming. With so many stores around, customers often ask:",
      },
      {
        type: "ul",
        items: [
          "Which jeweller is trustworthy?",
          "Where can I find modern and traditional designs?",
          "Which shop offers jewellery for weddings and gifts?",
          "Where will I get a smooth and comfortable buying experience?",
        ],
      },
      {
        type: "p",
        text: "Choosing the right store saves time, stress, and money.",
      },
      {
        type: "h2",
        text: "The Solution: Trusted Jewellery Shopping Near Purasawalkam",
      },
      {
        type: "p",
        text: "Kerala Jewellers is known among shoppers looking for elegant collections, trusted service, and jewellery for every occasion. Whether you are buying for a wedding, festival, gift, or personal use, finding the right collection becomes easier.",
      },
      {
        type: "h2",
        text: "Jewellery Collections for Every Need",
      },
      {
        type: "p",
        text: "Customers near Purasawalkam can explore:",
      },
      {
        type: "ul",
        items: [
          "Gold necklaces and chains",
          "Bridal jewellery sets",
          "Bangles and bracelets",
          "Earrings and studs",
          "Rings and couple gifts",
          "Traditional South Indian jewellery",
          "Lightweight modern designs",
        ],
      },
      {
        type: "h2",
        text: "Why Families Prefer Kerala Jewellers",
      },
      {
        type: "p",
        text: "Jewellery is often purchased during life's biggest moments\"engagements, weddings, anniversaries, and celebrations. That is why families value a jeweller that understands both style and trust.",
      },
      {
        type: "p",
        text: "Kerala Jewellers continues to be a preferred choice because of:",
      },
      {
        type: "ul",
        items: [
          "Reliable reputation",
          "Elegant collections",
          "Bridal shopping support",
          "Quality-focused service",
          "Convenient access for Purasawalkam shoppers",
        ],
      },
      {
        type: "h2",
        text: "Bridal Jewellery in Purasawalkam Area",
      },
      {
        type: "p",
        text: "If your wedding shopping has started, finding the right jewellery is one of the biggest decisions. Brides often want jewellery that feels grand, timeless, and photo-ready. Families shopping near Purasawalkam can explore collections suited for these memorable occasions at Kerala Jewellers.",
      },
      {
        type: "p",
        text: '"',
      },
    ],
  },
  {
    slug: "struggling-to-find-trusted-gold-jewellery-in-chennai-heres-the-solution",
    title:
      "Struggling to Find Trusted Gold Jewellery in Chennai? Here’s the Solution",
    thumbnail:
      "/assets/images/69e5de9a55c4196eb7948b2b_WhatsApp%20Image%202026-04-18%20at%203.50.49%20PM.jpeg",
    excerpt:
      "Buying gold jewellery should feel exciting, but for many customers it often becomes stressful. Questions like Is the gold pure? Is the price fair? Will the design match what I want? Can I trust this store? are common concerns when choosing a jeweller.",
    date: "April 20, 2026",
    body: [
      {
        type: "p",
        text: "Buying gold jewellery should feel exciting, but for many customers it often becomes stressful. Questions like Is the gold pure? Is the price fair? Will the design match what I want? Can I trust this store? are common concerns when choosing a jeweller.",
      },
      {
        type: "p",
        text: "If you have faced these problems, you are not alone. The good news is that choosing the right jewellery store can solve all of them. That is why many families turn to Kerala Jewellers in Chennai.",
      },
      {
        type: "h2",
        text: "Problem 1: Worry About Purity and Trust",
      },
      {
        type: "p",
        text: "Gold jewellery is a valuable purchase, so trust matters most. Customers want assurance that what they buy is genuine and worth the investment.",
      },
      {
        type: "p",
        text: "Kerala Jewellers is known as a trusted name where customers can shop with confidence and peace of mind.",
      },
      {
        type: "h2",
        text: "Problem 2: Limited Designs Everywhere",
      },
      {
        type: "p",
        text: "Many people visit multiple stores and still fail to find a design they truly love. Some stores only offer outdated styles or very limited collections.",
      },
      {
        type: "p",
        text: "From traditional South Indian styles to modern elegant designs, Kerala Jewellers offers jewellery suited for weddings, gifts, festivals, and daily wear.",
      },
      {
        type: "h2",
        text: "Problem 3: Bridal Jewellery Shopping Stress",
      },
      {
        type: "p",
        text: "Wedding shopping can be overwhelming. Brides and families need matching sets, beautiful designs, and jewellery that looks grand for the big day.",
      },
      {
        type: "p",
        text: "Kerala Jewellers offers bridal collections designed to make wedding shopping smoother and more memorable.",
      },
      {
        type: "h2",
        text: "Problem 4: Confusing Pricing and Poor Service",
      },
      {
        type: "p",
        text: "Some customers feel uncomfortable when pricing is unclear or service feels rushed.",
      },
      {
        type: "p",
        text: "A customer-friendly shopping experience makes a huge difference. Helpful guidance and transparent service help buyers choose confidently.",
      },
      {
        type: "h2",
        text: "Why More Customers Choose Kerala Jewellers",
      },
      {
        type: "p",
        text: "Families in Chennai choose Kerala Jewellers because it helps solve the real problems jewellery buyers face:",
      },
      {
        type: "ul",
        items: [
          "Trust and confidence",
          "Beautiful collections",
          "Bridal shopping made easier",
          "Better customer experience",
          "Jewellery for every occasion",
        ],
      },
      {
        type: "h2",
        text: "Final Thoughts",
      },
      {
        type: "p",
        text: "If you are tired of visiting store after store and still not finding the right jewellery, it may be time to choose a trusted destination. Kerala Jewellers helps turn jewellery shopping from stressful to satisfying.",
      },
      {
        type: "p",
        text: '"',
      },
    ],
  },
  {
    slug: "where-to-buy-gold-jewellery-in-purasawalkam-a-trusted-choice-for-families",
    title:
      "Where to Buy Gold Jewellery in Purasawalkam? A Trusted Choice for Families",
    thumbnail: "/assets/images/69e5e04d6f475dc632638e44_jygcskjcn.png",
    excerpt:
      "is one of the busiest retail hubs in Chennai, known for family shopping, festive purchases, and traditional markets. When families visit the area, many also search for a reliable jewellery store where quality and trust come first.",
    date: "April 20, 2026",
    body: [
      {
        type: "p",
        text: "is one of the busiest retail hubs in Chennai, known for family shopping, festive purchases, and traditional markets. When families visit the area, many also search for a reliable jewellery store where quality and trust come first.",
      },
      {
        type: "p",
        text: "For customers looking for elegant collections and dependable service, Kerala Jewellers remains a preferred destination.",
      },
      {
        type: "h2",
        text: "Why Jewellery Buyers in Purasawalkam Need a Trusted Store",
      },
      {
        type: "p",
        text: 'Buying jewellery is different from regular shopping. Customers are not just purchasing an accessory"they are investing in value, tradition, and memorable life moments. That is why shoppers in Purasawalkam often look for:',
      },
      {
        type: "ul",
        items: [
          "Trusted gold jewellery stores",
          "Bridal collections for weddings",
          "Stylish daily wear jewellery",
          "Transparent and comfortable shopping experience",
          "Designs for gifting and celebrations",
        ],
      },
      {
        type: "h2",
        text: "Discover Collections for Every Occasion",
      },
      {
        type: "p",
        text: "Kerala Jewellers offers jewellery suited for many needs, whether it is a grand event or a simple personal purchase.",
      },
      {
        type: "p",
        text: "Popular choices include:",
      },
      {
        type: "ul",
        items: [
          "Gold chains and necklaces",
          "Bangles and bracelets",
          "Earrings and studs",
          "Rings and engagement jewellery",
          "Bridal jewellery sets",
          "Traditional and lightweight modern designs",
        ],
      },
      {
        type: "h2",
        text: "Wedding Jewellery Near Purasawalkam",
      },
      {
        type: "p",
        text: "Wedding shopping can be exciting but stressful. Brides and families want jewellery that feels elegant, timeless, and suitable for ceremonies and photos. Customers searching near Purasawalkam often prefer trusted jewellers who understand these expectations.",
      },
      {
        type: "p",
        text: "Kerala Jewellers offers collections created for these once-in-a-lifetime celebrations.",
      },
      {
        type: "h2",
        text: "Why Shoppers Choose Kerala Jewellers",
      },
      {
        type: "p",
        text: "Families continue to choose Kerala Jewellers because of:",
      },
      {
        type: "ul",
        items: [
          "Trusted reputation in jewellery shopping",
          "Beautiful traditional and modern designs",
          "Collections for weddings and festivals",
          "Friendly customer guidance",
          "Convenient option for Purasawalkam shoppers",
        ],
      },
      {
        type: "p",
        text: '"',
      },
    ],
  },
  {
    slug: "why-kerala-jewellers-is-a-trusted-name-for-gold-jewellery-in",
    title: "Why Kerala Jewellers is a Trusted Name for Gold Jewellery in",
    thumbnail:
      "/assets/images/69e5de9a55c4196eb7948b2b_WhatsApp%20Image%202026-04-18%20at%203.50.49%20PM.jpeg",
    excerpt:
      "When it comes to buying gold jewellery, trust is everything. Customers look for purity, elegant craftsmanship, transparent pricing, and designs that match both tradition and modern style. That is why Kerala Jewellers has become a preferred destination for families and jewellery lovers in Chennai.",
    date: "April 20, 2026",
    body: [
      {
        type: "p",
        text: "When it comes to buying gold jewellery, trust is everything. Customers look for purity, elegant craftsmanship, transparent pricing, and designs that match both tradition and modern style. That is why Kerala Jewellers has become a preferred destination for families and jewellery lovers in Chennai.",
      },
      {
        type: "h2",
        text: "A Legacy of Trust and Quality",
      },
      {
        type: "p",
        text: 'Jewellery is more than an accessory"it is an investment, a memory, and a symbol of celebration. Whether it is a wedding, engagement, birthday, or festive occasion, buyers want jewellery that carries both beauty and long-term value. Kerala Jewellers is known for offering quality gold jewellery that customers can purchase with confidence.',
      },
      {
        type: "h2",
        text: "Wide Range of Elegant Collections",
      },
      {
        type: "p",
        text: "Every customer has a unique taste. Some prefer classic South Indian temple jewellery, while others look for sleek modern designs for daily wear. At Kerala Jewellers, customers can explore a variety of collections including:",
      },
      {
        type: "ul",
        items: [
          "Gold necklaces",
          "Bangles and bracelets",
          "Earrings and studs",
          "Bridal jewellery sets",
          "Rings and engagement collections",
          "Diamond jewellery designs",
          "Traditional and contemporary ornaments",
        ],
      },
      {
        type: "h2",
        text: "Perfect Choice for Weddings and Special Occasions",
      },
      {
        type: "p",
        text: "Weddings are one of the most important milestones in life, and jewellery plays a central role in every ceremony. Families searching for bridal jewellery in Chennai often look for trusted jewellers with beautiful collections and dependable service. Kerala Jewellers offers jewellery suited for brides, grooms, and family gifting needs.",
      },
      {
        type: "h2",
        text: "Customer Experience that Matters",
      },
      {
        type: "p",
        text: "Buying jewellery should feel special and comfortable. Friendly guidance, clear pricing, and a pleasant shopping experience make a big difference. Customers appreciate jewellers who help them choose the right piece for their budget and style.",
      },
      {
        type: "h2",
        text: "Why Customers Choose Kerala Jewellers",
      },
      {
        type: "p",
        text: "People continue to choose Kerala Jewellers because of:",
      },
      {
        type: "ul",
        items: [
          "Trusted reputation",
          "Stylish and traditional collections",
          "Quality craftsmanship",
          "Jewellery for all occasions",
          "Customer-focused service",
        ],
      },
      {
        type: "h2",
        text: "Visit Kerala Jewellers Today",
      },
      {
        type: "p",
        text: "If you are searching for gold jewellery, bridal collections, or elegant gifts in Chennai, Kerala Jewellers is a name worth exploring. Discover timeless jewellery designed to celebrate life's most precious",
      },
      {
        type: "p",
        text: '"',
      },
    ],
  },
];
