import type { ArrayField } from "./ArrayFieldEditor";

export type FieldType = "text" | "textarea" | "json" | "array" | "image" | "checkbox";

export type FieldDef = {
  path: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  description?: string;
  section?: string;
  arrayFields?: ArrayField[];
  aspectRatio?: number;
  recommendedWidth?: number;
  recommendedHeight?: number;
};

export type PageDef = {
  slug: string;
  title: string;
  description: string;
  icon: string;
  source: "global" | "legal-page";
  legalSlug?: string;
  note?: string;
  fields: FieldDef[];
};

export const PAGE_DEFS: PageDef[] = [
  {
    slug: "home",
    title: "Home",
    description: "Manage the homepage hero, categories, featured products, highlights and banners.",
    icon: "home",
    source: "global",
    fields: [
      {
        path: "sliderPaused",
        label: "Pause Hero Slider",
        type: "checkbox",
        section: "Hero Slides",
        description: "When enabled, the homepage hero shows a single pinned slide instead of rotating. Mark one slide below as 'Pin this slide'.",
      },
      {
        path: "heroSlides",
        label: "Hero Slides",
        type: "array",
        section: "Hero Slides",
        description: "Rotating banners at the top of the homepage. Each slide shows a heading, description and call-to-action button.",
        arrayFields: [
          { name: "heading", label: "Heading", type: "text", placeholder: "e.g. Exquisite Gold Collections" },
          { name: "description", label: "Description", type: "textarea", placeholder: "Short tagline shown below the heading" },
          { name: "ctaText", label: "Button Text", type: "text", placeholder: "e.g. Explore Now" },
          { name: "ctaHref", label: "Button Link", type: "text", placeholder: "e.g. /collections/gold" },
          { name: "image", label: "Background Image", type: "image", aspectRatio: 1920/700, recommendedWidth: 1920, recommendedHeight: 700 },
          { name: "isPinned", label: "Pin this slide (shown when slider is paused)", type: "checkbox" },
        ],
      },
      {
        path: "categories",
        label: "Category Cards",
        type: "array",
        section: "Category Cards",
        description: "Cards shown below the hero that link to each product category.",
        arrayFields: [
          { name: "title", label: "Title", type: "text", placeholder: "e.g. Gold Jewellery" },
          { name: "description", label: "Short Description", type: "textarea", placeholder: "One-line description for the card" },
          { name: "image", label: "Background Image", type: "image", aspectRatio: 2/1, recommendedWidth: 1200, recommendedHeight: 600 },
          { name: "ctaText", label: "Button Text", type: "text", placeholder: "e.g. View Collection" },
          { name: "ctaHref", label: "Button Link", type: "text", placeholder: "e.g. /collections/gold" },
          { name: "variant", label: "Style", type: "text", placeholder: "gold, silver, diamond, or platinum" },
        ],
      },
      {
        path: "homepageSections.bestsellersTitle",
        label: "Bestsellers Title",
        type: "text",
        section: "Bestsellers Section",
        placeholder: "e.g. Our Bestsellers",
      },
      {
        path: "homepageSections.bestsellersSubtitle",
        label: "Bestsellers Subtitle",
        type: "textarea",
        section: "Bestsellers Section",
        placeholder: "Subtitle describing the bestseller products",
      },
      {
        path: "bestsellerProducts",
        label: "Bestseller Products (Slugs)",
        type: "text",
        section: "Bestsellers Section",
        description: "Comma-separated product slugs to show as bestsellers on the homepage. Products must exist in the Products collection. Example: gold-choker,gold-bangles,diamond-ring",
        placeholder: "e.g. gold-choker,gold-bangles,diamond-ring",
      },
      {
        path: "features",
        label: "Feature Highlights",
        type: "array",
        section: "Feature Highlights",
        description: "Circular highlight cards shown in the middle of the homepage (e.g. \"Crafted with Love\", \"Certified Purity\").",
        arrayFields: [
          { name: "title", label: "Title", type: "text", placeholder: "e.g. Certified Purity" },
          { name: "description", label: "Description", type: "textarea", placeholder: "Brief description of this highlight" },
          { name: "image", label: "Image", type: "image", aspectRatio: 1, recommendedWidth: 400, recommendedHeight: 400 },
          { name: "alt", label: "Image Description", type: "text", placeholder: "Describe the image for accessibility" },
        ],
      },
      {
        path: "banners",
        label: "Promotional Banners",
        type: "array",
        section: "Promotional Banners",
        description: "Full-width image banners shown near the bottom of the homepage.",
        arrayFields: [
          { name: "title", label: "Title", type: "text", placeholder: "e.g. Wedding Season Sale" },
          { name: "image", label: "Banner Image", type: "image", aspectRatio: 4/5, recommendedWidth: 800, recommendedHeight: 1000 },
          { name: "alt", label: "Image Description", type: "text", placeholder: "Describe the image for accessibility" },
          { name: "ctaText", label: "Button Text", type: "text", placeholder: "e.g. Shop Now" },
          { name: "href", label: "Button Link", type: "text", placeholder: "e.g. /collections/wedding" },
        ],
      },
      {
        path: "heritage",
        label: "Heritage Section",
        type: "array",
        section: "Heritage Section",
        description: "Heritage design section on the homepage.",
        arrayFields: [
          { name: "heading", label: "Heading", type: "text", placeholder: "e.g. Intricate & Intimate" },
          { name: "description", label: "Description", type: "textarea", placeholder: "Detailed description of heritage work" },
          { name: "image", label: "Heritage Image", type: "image", aspectRatio: 3/2, recommendedWidth: 600, recommendedHeight: 400 },
        ],
      },
    ],
  },
  {
    slug: "gold",
    title: "Gold Products Page",
    description: "Edit the hero section of the Gold jewellery collection page.",
    icon: "gold",
    source: "global",
    fields: [
      { path: "productsPage.goldHero.title", label: "Page Title", type: "text", section: "Hero", placeholder: "e.g. Gold Jewellery Collection" },
      { path: "productsPage.goldHero.subtitle", label: "Page Subtitle", type: "textarea", section: "Hero", placeholder: "A short tagline shown below the title" },
      { path: "productsPage.goldHero.image", label: "Hero Banner Image", type: "image", section: "Hero", aspectRatio: 1920/700, recommendedWidth: 1920, recommendedHeight: 700 },
    ],
  },
  {
    slug: "silver",
    title: "Silver Products Page",
    description: "Edit the hero section of the Silver jewellery collection page.",
    icon: "silver",
    source: "global",
    fields: [
      { path: "productsPage.silverHero.title", label: "Page Title", type: "text", section: "Hero", placeholder: "e.g. Silver Jewellery Collection" },
      { path: "productsPage.silverHero.subtitle", label: "Page Subtitle", type: "textarea", section: "Hero", placeholder: "A short tagline shown below the title" },
      { path: "productsPage.silverHero.image", label: "Hero Banner Image", type: "image", section: "Hero", aspectRatio: 1920/700, recommendedWidth: 1920, recommendedHeight: 700 },
    ],
  },
  {
    slug: "diamond",
    title: "Diamond Products Page",
    description: "Edit the hero section of the Diamond jewellery collection page.",
    icon: "diamond",
    source: "global",
    fields: [
      { path: "productsPage.diamondHero.title", label: "Page Title", type: "text", section: "Hero", placeholder: "e.g. Diamond Jewellery Collection" },
      { path: "productsPage.diamondHero.subtitle", label: "Page Subtitle", type: "textarea", section: "Hero", placeholder: "A short tagline shown below the title" },
      { path: "productsPage.diamondHero.image", label: "Hero Banner Image", type: "image", section: "Hero", aspectRatio: 1920/700, recommendedWidth: 1920, recommendedHeight: 700 },
    ],
  },
  {
    slug: "platinum",
    title: "Platinum Products Page",
    description: "Edit the hero section of the Platinum jewellery collection page.",
    icon: "platinum",
    source: "global",
    fields: [
      { path: "productsPage.platinumHero.title", label: "Page Title", type: "text", section: "Hero", placeholder: "e.g. Platinum Jewellery Collection" },
      { path: "productsPage.platinumHero.subtitle", label: "Page Subtitle", type: "textarea", section: "Hero", placeholder: "A short tagline shown below the title" },
      { path: "productsPage.platinumHero.image", label: "Hero Banner Image", type: "image", section: "Hero", aspectRatio: 1920/700, recommendedWidth: 1920, recommendedHeight: 700 },
    ],
  },
  {
    slug: "about",
    title: "About Page",
    description: "Edit the content of the About Us page — hero, story, timeline and ventures.",
    icon: "about",
    source: "global",
    fields: [
      { path: "aboutPage.goldenOccasions.heading", label: "Heading", type: "text", section: "Hero Section", placeholder: "e.g. Golden Occasions & Gleaming Beginnings" },
      { path: "aboutPage.goldenOccasions.image", label: "Hero Image", type: "image", section: "Hero Section", aspectRatio: 2/1, recommendedWidth: 1200, recommendedHeight: 600 },
      { path: "aboutPage.goldenOccasions.alt", label: "Image Description", type: "text", section: "Hero Section", placeholder: "Describe the hero image for accessibility" },
      {
        path: "aboutPage.goldenOccasions.paragraphs",
        label: "Paragraphs",
        type: "array",
        section: "Hero Section",
        description: "Introductory paragraphs shown on the About page hero.",
        arrayFields: [
          { name: "text", label: "Paragraph", type: "textarea", placeholder: "Write a paragraph here…" },
        ],
      },
      { path: "aboutPage.tasteMeetsTradition.heading", label: "Heading", type: "text", section: "Taste Meets Tradition", placeholder: "e.g. Taste Meets Tradition" },
      { path: "aboutPage.tasteMeetsTradition.text", label: "Content", type: "textarea", section: "Taste Meets Tradition", placeholder: "Describe how taste meets tradition…" },
      { path: "aboutPage.origins.heading", label: "Heading", type: "text", section: "Our Origins", placeholder: "e.g. The Origins" },
      { path: "aboutPage.origins.intro", label: "Introduction", type: "textarea", section: "Our Origins", placeholder: "Tell the story of how Kerala Jewellers began…" },
      {
        path: "aboutPage.timeline",
        label: "Timeline Entries",
        type: "array",
        section: "Company Timeline",
        description: "Key milestones shown on the horizontal timeline.",
        arrayFields: [
          { name: "year", label: "Year", type: "text", placeholder: "e.g. 1995" },
          { name: "title", label: "Title", type: "text", placeholder: "e.g. First Store Opened" },
          { name: "text", label: "Description", type: "textarea", placeholder: "What happened in this year?" },
          { name: "image", label: "Milestone Image", type: "image", aspectRatio: 1, recommendedWidth: 400, recommendedHeight: 400 },
        ],
      },
      { path: "aboutPage.ventures.heading", label: "Heading", type: "text", section: "Our Ventures", placeholder: "e.g. Our Ventures" },
      { path: "aboutPage.ventures.subheading", label: "Subheading", type: "text", section: "Our Ventures", placeholder: "e.g. Our Dedicated Wedding Hall" },
      { path: "aboutPage.ventures.image", label: "Ventures Image", type: "image", section: "Our Ventures", aspectRatio: 2/1, recommendedWidth: 1200, recommendedHeight: 600 },
      { path: "aboutPage.ventures.alt", label: "Image Description", type: "text", section: "Our Ventures", placeholder: "Describe the ventures image for accessibility" },
      {
        path: "aboutPage.ventures.bullets",
        label: "Key Points",
        type: "array",
        section: "Our Ventures",
        description: "Bullet points listing features of the ventures.",
        arrayFields: [
          { name: "text", label: "Point", type: "textarea", placeholder: "e.g. 10,000 sq ft air-conditioned hall" },
        ],
      },
      { path: "aboutPage.ventures.cta1Text", label: "First Button Text", type: "text", section: "Our Ventures", placeholder: "e.g. Know More About Us" },
      { path: "aboutPage.ventures.cta1Href", label: "First Button Link", type: "text", section: "Our Ventures", placeholder: "e.g. https://www.ayswariyamahal.com/" },
      { path: "aboutPage.ventures.cta2Text", label: "Second Button Text", type: "text", section: "Our Ventures", placeholder: "e.g. Find Us" },
      { path: "aboutPage.ventures.cta2Href", label: "Second Button Link", type: "text", section: "Our Ventures", placeholder: "e.g. https://maps.app.goo.gl/..." },
    ],
  },
  {
    slug: "contact",
    title: "Contact Page",
    description: "Edit the hero, contact card and branches section of the Contact page.",
    icon: "contact",
    source: "global",
    fields: [
      { path: "contactPage.heroTitle", label: "Page Title", type: "text", section: "Hero", placeholder: "e.g. Get In Touch" },
      { path: "contactPage.heroSubtitle", label: "Page Subtitle", type: "textarea", section: "Hero", placeholder: "A short message shown below the title" },
      { path: "contactPage.cardTitle", label: "Card Title", type: "text", section: "Contact Card", placeholder: "e.g. Send Us a Message" },
      { path: "contactPage.cardDescription", label: "Card Description", type: "textarea", section: "Contact Card", placeholder: "Description shown inside the contact card" },
      { path: "contactPage.cardQuote", label: "Quote", type: "text", section: "Contact Card", placeholder: "e.g. We'd love to hear from you" },
      { path: "contactPage.branchesTitle", label: "Section Title", type: "text", section: "Branches Title", placeholder: "e.g. Our Branches" },
      {
        path: "branches",
        label: "Branch Outlets",
        type: "array",
        section: "Branch Details",
        description: "Outlets shown with maps and details on the contact page.",
        arrayFields: [
          { name: "name", label: "Branch Name", type: "text", placeholder: "e.g. Pondy Bazaar" },
          { name: "address", label: "Branch Address", type: "textarea" },
          { name: "phone", label: "Display Phone", type: "text", placeholder: "e.g. 98400 88324" },
          { name: "phoneFull", label: "Dialable Phone Number (Digits only)", type: "text", placeholder: "e.g. 9840088324" },
          { name: "email", label: "Branch Email", type: "text" },
          { name: "hours", label: "Store Timings", type: "text", placeholder: "e.g. Mon–Sat: 10 AM – 8 PM" },
          { name: "mapQ", label: "Google Maps Query Name", type: "text", placeholder: "e.g. Kerala+Jewellers+T.Nagar" },
          { name: "mapEmbedUrl", label: "Custom Map Embed URL (Optional)", type: "text" },
        ],
      },
      { path: "phone", label: "Global Contact Phone", type: "text", section: "Global Site Contacts" },
      { path: "whatsapp", label: "Global WhatsApp Number", type: "text", section: "Global Site Contacts" },
      { path: "email", label: "Global Contact Email", type: "text", section: "Global Site Contacts" },
      { path: "storeTiming", label: "Global Store Timing", type: "text", section: "Global Site Contacts" },
    ],
  },
  {
    slug: "blog",
    title: "Blog Page",
    description: "Edit the promo banner, page header and empty-state text of the Blog listing page.",
    icon: "blog",
    source: "global",
    fields: [
      { path: "blogPage.promoHeading", label: "Promo Heading", type: "text", section: "Promotional Banner", placeholder: "e.g. Latest from Our Blog" },
      { path: "blogPage.promoDescription", label: "Promo Description", type: "textarea", section: "Promotional Banner", placeholder: "Short description for the promotional banner" },
      { path: "blogPage.promoCtaText", label: "Button Text", type: "text", section: "Promotional Banner", placeholder: "e.g. Read More" },
      { path: "blogPage.promoImage", label: "Image", type: "image", section: "Promotional Banner", aspectRatio: 2/1, recommendedWidth: 1200, recommendedHeight: 600 },
      { path: "blogPage.headerTitle", label: "Page Heading", type: "text", section: "Page Header", placeholder: "e.g. Our Blog" },
      { path: "blogPage.headerSubtitle", label: "Page Subheading", type: "textarea", section: "Page Header", placeholder: "A short tagline below the heading" },
      { path: "blogPage.emptyText", label: "Empty State Message", type: "textarea", section: "Empty State", placeholder: "Message shown when there are no blog posts", description: "This message appears when the blog has no published posts." },
    ],
  },
  {
    slug: "thanga-mazhai",
    title: "Thanga Mazhai Scheme",
    description: "Edit the banner image and details of the Thanga Mazhai savings scheme page.",
    icon: "scheme",
    source: "global",
    fields: [
      { path: "thangaMazhai.banner", label: "Banner Image", type: "image", section: "Page Banner", aspectRatio: 1920/700, recommendedWidth: 1920, recommendedHeight: 700 },
      { path: "thangaMazhai.title", label: "Page Title", type: "text", section: "Scheme Heading", placeholder: "e.g. Thanga Mazhai Scheme" },
      { path: "thangaMazhai.heading", label: "Scheme Header Text", type: "text", section: "Scheme Heading", placeholder: "Large bold uppercase heading text" },
      { path: "thangaMazhai.description", label: "Scheme Description", type: "textarea", section: "Scheme Heading" },
      {
        path: "thangaMazhai.benefits",
        label: "Scheme Benefits (Points)",
        type: "array",
        section: "Benefits",
        arrayFields: [{ name: "text", label: "Benefit Point", type: "textarea" }],
      },
      {
        path: "thangaMazhai.whyChoose",
        label: "Why Choose Points",
        type: "array",
        section: "Why Choose",
        arrayFields: [{ name: "text", label: "Why Choose Reason", type: "textarea" }],
      },
    ],
  },
  {
    slug: "swarnavarsha",
    title: "Swarnavarsha Scheme",
    description: "Edit the title and clauses list of the Swarnavarsha terms scheme page.",
    icon: "scheme",
    source: "global",
    fields: [
      { path: "swarnavarsha.title", label: "Page Title", type: "text", section: "General Settings" },
      { path: "swarnavarsha.tcHeading", label: "Terms Heading", type: "text", section: "General Settings" },
      {
        path: "swarnavarsha.bullets",
        label: "Terms & Conditions List",
        type: "array",
        section: "Terms List",
        arrayFields: [{ name: "text", label: "Terms Point", type: "textarea" }],
      },
    ],
  },
];

export function getPageDef(slug: string): PageDef | undefined {
  return PAGE_DEFS.find((p) => p.slug === slug);
}
