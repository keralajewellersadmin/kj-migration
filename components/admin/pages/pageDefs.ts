import type { ArrayField } from "./ArrayFieldEditor";

export type FieldType = "text" | "textarea" | "json" | "array";

export type FieldDef = {
  path: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  description?: string;
  section?: string;
  arrayFields?: ArrayField[];
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
          { name: "ctaText", label: "Button Text", type: "text", placeholder: "e.g. View Collection" },
          { name: "ctaHref", label: "Button Link", type: "text", placeholder: "e.g. /collections/gold" },
          { name: "variant", label: "Style", type: "text", placeholder: "gold, silver, diamond, or platinum" },
        ],
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
          { name: "alt", label: "Image Description", type: "text", placeholder: "Describe the image for accessibility" },
          { name: "ctaText", label: "Button Text", type: "text", placeholder: "e.g. Shop Now" },
          { name: "href", label: "Button Link", type: "text", placeholder: "e.g. /collections/wedding" },
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
      { path: "aboutPage.tasteMeetsTradition.text", label: "Content", type: "textarea", section: "Taste MeetsTradition", placeholder: "Describe how taste meets tradition…" },
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
        ],
      },
      { path: "aboutPage.ventures.heading", label: "Heading", type: "text", section: "Our Ventures", placeholder: "e.g. Our Ventures" },
      { path: "aboutPage.ventures.subheading", label: "Subheading", type: "text", section: "Our Ventures", placeholder: "e.g. Our Dedicated Wedding Hall" },
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
    note: "Phone numbers, email, address and working hours are managed under Site Settings → Footer & Contact Details.",
    fields: [
      { path: "contactPage.heroTitle", label: "Page Title", type: "text", section: "Hero", placeholder: "e.g. Get In Touch" },
      { path: "contactPage.heroSubtitle", label: "Page Subtitle", type: "textarea", section: "Hero", placeholder: "A short message shown below the title" },
      { path: "contactPage.cardTitle", label: "Card Title", type: "text", section: "Contact Card", placeholder: "e.g. Send Us a Message" },
      { path: "contactPage.cardDescription", label: "Card Description", type: "textarea", section: "Contact Card", placeholder: "Description shown inside the contact card" },
      { path: "contactPage.cardQuote", label: "Quote", type: "text", section: "Contact Card", placeholder: "e.g. We'd love to hear from you" },
      { path: "contactPage.branchesTitle", label: "Section Title", type: "text", section: "Branches", placeholder: "e.g. Our Branches" },
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
      { path: "blogPage.promoImage", label: "Image (Media ID)", type: "text", section: "Promotional Banner", placeholder: "Numeric ID from the Media collection", description: "Find the ID in Content → Media. This image appears on the promotional banner." },
      { path: "blogPage.headerTitle", label: "Page Heading", type: "text", section: "Page Header", placeholder: "e.g. Our Blog" },
      { path: "blogPage.headerSubtitle", label: "Page Subheading", type: "textarea", section: "Page Header", placeholder: "A short tagline below the heading" },
      { path: "blogPage.emptyText", label: "Empty State Message", type: "textarea", section: "Empty State", placeholder: "Message shown when there are no blog posts", description: "This message appears when the blog has no published posts." },
    ],
  },
];

export function getPageDef(slug: string): PageDef | undefined {
  return PAGE_DEFS.find((p) => p.slug === slug);
}
