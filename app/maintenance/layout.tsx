import type { Metadata } from "next";
import "@/styles/tokens.css";
import "@/app/globals.css";

export const metadata: Metadata = {
  title: "Under Maintenance — Kerala Jewellers",
  description:
    "Kerala Jewellers is currently under maintenance. We're crafting an even more exquisite experience — please check back shortly.",
  robots: { index: false, follow: false },
};

export default function MaintenanceLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="theme-color" content="#991f23" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font, @next/next/google-font-display */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700&family=Mulish:wght@300;400;500;600;700&display=block"
        />
        <link rel="shortcut icon" href="/assets/logo/favicon.png" type="image/png" />
        <link rel="icon" href="/assets/logo/favicon.png" type="image/png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
