import { Montserrat, Mulish } from "next/font/google";
import "@/styles/tokens.css";
import "@/app/globals.css";

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

export default function EnquiryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${montserrat.variable} ${mulish.variable}`}>
      <head>
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
