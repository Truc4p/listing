import type { Metadata } from "next";
import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import { LocalBusinessJsonLd } from "@/components/seo/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  style: ["normal", "italic"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://ha-apartment.com"),
  title: {
    default: "AN Apartment | Rooms & Apartments for Rent in Da Nang",
    template: "%s | AN Apartment",
  },
  description:
    "AN Apartment offers high-quality rooms and apartments for rent in Son Tra, Da Nang. Clean, safe, comfortable, and affordable.",
  keywords: [
    "room for rent",
    "apartment for rent",
    "rental room",
    "Son Tra",
    "Da Nang",
    "AN Apartment",
  ],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ha-apartment.com",
    siteName: "AN Apartment",
    title: "AN Apartment | Rooms & Apartments for Rent in Da Nang",
    description:
      "Quality rooms and apartments for rent in Son Tra, Da Nang.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "AN Apartment",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AN Apartment | Rooms & Apartments for Rent",
    description: "Rooms and apartments for rent in Da Nang",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  alternates: {
    canonical: "https://ha-apartment.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <head>
        <LocalBusinessJsonLd />
      </head>
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
