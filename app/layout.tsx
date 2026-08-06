import type { Metadata } from "next";
import { Montserrat, Mulish } from "next/font/google";
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

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-ui-loaded",
});

const mulish = Mulish({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
  variable: "--font-body-loaded",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${montserrat.variable} ${mulish.variable}`}>
      <head>
        <meta name="theme-color" content="#991f23" />
        <link rel="preconnect" href="https://res.cloudinary.com" />
        <link
          rel="preload"
          href="/assets/fonts/com4tdrify.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
        <link
          rel="shortcut icon"
          href="/assets/logo/favicon.png"
          type="image/png"
        />
        <link rel="icon" href="/assets/logo/favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/assets/logo/apple-touch-icon.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
