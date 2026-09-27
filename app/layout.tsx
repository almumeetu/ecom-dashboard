import type { Metadata } from "next";
import localFont from "next/font/local";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const bembo = localFont({
  src: [
    {
      path: "./fonts/Bembo-Std-Font/BemboStd.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Bembo-Std-Font/BemboStd-Bold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Bembo-Std-Font/BemboStd-SemiboldItalic.otf",
      weight: "600",
      style: "italic",
    },
  ],
  variable: "--font-bembo",
});

const snell = localFont({
  src: [
    {
      path: "./fonts/Snell-Roundhand/Snell Roundhand Script.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Snell-Roundhand/Snell Roundhand Bold Script.otf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-snell",
});

const gotham = localFont({
  src: [
    {
      path: "./fonts/Gotham/Gotham-Thin.otf",
      weight: "100",
      style: "normal",
    },
    {
      path: "./fonts/Gotham/Gotham-Medium.otf",
      weight: "500",
      style: "normal",
    },
  ],
  variable: "--font-gotham",
});

export const metadata: Metadata = {
  title: "Trust Point | সরাসরি বাগান থেকে আপনার বাড়ি — খাঁটি আম ও অর্গানিক পণ্য",
  description: "ট্রাস্ট পয়েন্ট (Trust Point) — সরাসরি বাগান থেকে আপনার বাড়ি, মাঝে কোনো আড়ত বা মধ্যস্বত্বভোগী নেই। শতভাগ ফরমালিনমুক্ত ও খাঁটি সতেজতার গ্যারান্টি। প্রতিষ্ঠাতা: Mohammad Abdullah, মহাদেবপুর, নওগাঁ, রাজশাহী।",
  icons: {
    icon: "/images/logo.svg",
    shortcut: "/images/logo.svg",
    apple: "/images/logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`h-full antialiased scroll-smooth ${plusJakartaSans.variable} ${bembo.variable} ${snell.variable} ${gotham.variable}`}>
      <body className="min-h-full flex flex-col font-sans text-neutral-900 antialiased selection:bg-stone-800 selection:text-white">
        {children}
      </body>
    </html>
  );
}
