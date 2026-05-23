import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.mawarist.web.id"),
  title: "E-MAWARITS — Sistem Informasi Waris Multi-Hukum (Islam, Adat Jawa & Perdata)",
  description: "Kalkulasi distribusi waris secara akurat, transparan, dan terpercaya berdasarkan 3 sistem hukum nasional: Hukum Islam (Faraid), Hukum Adat Jawa (Sepikul Segendongan), dan Hukum Perdata (BW).",
  keywords: [
    "waris", "mawarits", "e-mawarits", "faraid", "kalkulator waris",
    "waris islam", "adat jawa", "waris perdata", "hukum waris",
    "distribusi waris", "si-waris", "sepikul segendongan", "khi"
  ],
  authors: [{ name: "E-MAWARITS Team" }],
  openGraph: {
    title: "E-MAWARITS — Sistem Informasi Waris Multi-Hukum",
    description: "Sistem kalkulasi waris terpadu nasional berdasarkan Hukum Islam (Faraid), Hukum Adat Jawa, dan Hukum Perdata (BW). Cepat, transparan, dan akurat.",
    url: "https://www.mawarist.web.id",
    siteName: "E-MAWARITS",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "E-MAWARITS — Sistem Informasi Waris Multi-Hukum (Islam, Adat Jawa, Perdata)",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "E-MAWARITS — Sistem Informasi Waris Multi-Hukum",
    description: "Kalkulasi distribusi waris terpadu berdasarkan Hukum Islam, Adat Jawa, dan Hukum Perdata.",
    images: ["/og-image.png"],
  },
};

import { Toaster } from "react-hot-toast";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        {children}
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}
