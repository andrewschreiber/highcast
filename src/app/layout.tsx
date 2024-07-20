import "@/app/globals.css";

import type { Metadata } from "next";

import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { cn } from "@/lib/utils";
import Script from 'next/script'


export const metadata: Metadata = {
  title: "Highcast",
  description: "Activate Raycast commands from Highlight",
};

interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html
      suppressHydrationWarning
      className={cn(
        "select-none overscroll-none scroll-smooth",
        GeistSans.variable,
        GeistMono.variable,
      )}
      lang="en"
    >
      <head>
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-DKY5RF2R8B"
        />

        <Script id="google-analytics">
          {`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-DKY5RF2R8B');
        `}
        </Script>
      </head>

      <body>
        <main className="font-sans antialiased">{children}</main>
      </body>
    </html>
  );
}
