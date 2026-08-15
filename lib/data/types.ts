export interface SeoFields {
  title?: string;
  description?: string;
  ogImage?: string;
}

export interface Product {
  slug: string;
  name: string;
  code: string;
  metal: "gold" | "silver" | "diamond";
  category: string;
  weight: string;
  purity: string;
  description: string;
  image: string;
  imageAlt?: string;
  seo?: SeoFields;
}

export type BlogBlock =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] };

export interface BlogPost {
  slug: string;
  title: string;
  thumbnail: string;
  excerpt: string;
  date?: string;
  body?: BlogBlock[];
  seo?: SeoFields;
}

export type LegalBlock =
  { type: "p"; text: string } | { type: "ul"; items: string[] };

export interface LegalSection {
  title: string;
  blocks: LegalBlock[];
}

export interface LegalPage {
  slug: string;
  title: string;
  sections: LegalSection[];
  seo?: SeoFields;
}
