import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
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

export const metadata: Metadata = {
  metadataBase: new URL("https://canhothanhha.vn"),
  title: {
    default: "Căn Hộ Thanh Hà | Cho thuê phòng & căn hộ tại TP.HCM",
    template: "%s | Căn Hộ Thanh Hà",
  },
  description:
    "Căn Hộ Thanh Hà cung cấp phòng trọ và căn hộ cho thuê chất lượng cao tại Quận 1, TP. Hồ Chí Minh. Không gian sạch sẽ, an toàn, tiện nghi, giá hợp lý.",
  keywords: [
    "cho thuê phòng",
    "căn hộ cho thuê",
    "phòng trọ",
    "Quận 1",
    "TP.HCM",
    "Thanh Hà",
  ],
  openGraph: {
    type: "website",
    locale: "vi_VN",
    url: "https://canhothanhha.vn",
    siteName: "Căn Hộ Thanh Hà",
    title: "Căn Hộ Thanh Hà | Cho thuê phòng & căn hộ tại TP.HCM",
    description:
      "Phòng trọ và căn hộ cho thuê chất lượng tại Quận 1, TP. Hồ Chí Minh.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Căn Hộ Thanh Hà",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Căn Hộ Thanh Hà | Cho thuê phòng & căn hộ",
    description: "Phòng trọ và căn hộ cho thuê tại TP.HCM",
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
    canonical: "https://canhothanhha.vn",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <LocalBusinessJsonLd />
      </head>
      <body className="min-h-full flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster richColors position="top-right" />
      </body>
    </html>
  );
}
