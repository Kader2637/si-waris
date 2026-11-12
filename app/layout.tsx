import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import ThemeSync from "@/components/ThemeSync";

const plusJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.mawarist.web.id"),
  title: "E-MAWARIST — Sistem Informasi Waris Multi-Hukum (Islam, Adat Jawa & Perdata)",
  description: "Kalkulasi distribusi waris secara akurat, transparan, dan terpercaya berdasarkan 3 sistem hukum nasional: Hukum Islam (Faraid), Hukum Adat Jawa, dan Hukum Perdata (BW).",
  keywords: [
    "waris", "mawarits", "e-mawarist", "faraid", "perhitungan waris",
    "waris islam", "adat jawa", "waris perdata", "hukum waris",
    "distribusi waris", "e-mawarist", "sepikul segendongan", "khi"
  ],
  authors: [{ name: "E-MAWARIST Team" }],
  openGraph: {
    title: "E-MAWARIST — Sistem Informasi Waris Multi-Hukum",
    description: "Sistem kalkulasi waris terpadu nasional berdasarkan Hukum Islam (Faraid), Hukum Adat Jawa, dan Hukum Perdata (BW). Cepat, transparan, dan akurat.",
    url: "https://www.mawarist.web.id",
    siteName: "E-MAWARIST",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning className={`${plusJakarta.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col font-sans antialiased bg-[#f8fafc] dark:bg-[#0b0f19] text-[#0f172a] dark:text-slate-100">
        <ThemeSync />
        {children}
        <Toaster
          position="top-center"
          reverseOrder={false}
          toastOptions={{
            className: "!bg-white !text-slate-900 dark:!bg-[#131b2b] dark:!text-slate-100 dark:!border dark:!border-slate-700",
          }}
        />
      </body>
    </html>
  );
}
