import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "NovaMart | Bangladesh's Premier Multi-Category E-Commerce Store",
  description: "NovaMart — Bangladesh's premier online store for authentic skin care, digital electronics, luxury perfumes, fashion apparel, baby products, and home lifestyle essentials.",
  icons: {
    icon: "/images/logo/novamart-logo-main.png",
    shortcut: "/images/logo/novamart-logo-main.png",
    apple: "/images/logo/novamart-logo-main.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300..600;1,9..40,300..600&family=Plus+Jakarta+Sans:ital,wght@0,300..600;1,300..600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col font-sans text-neutral-900 antialiased selection:bg-indigo-600 selection:text-white">
        {children}
      </body>
    </html>
  );
}

