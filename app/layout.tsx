import type { Metadata } from "next";
import "@/styles/tokens.css";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Kerala Jewellers",
  description:
    "Kerala Jewellers offers exquisite gold, silver, and diamond jewellery crafted with precision. Shop traditional and modern designs.",
  metadataBase: new URL("https://keralajewellers.in"),
  openGraph: {
    siteName: "Kerala Jewellers",
    type: "website",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
