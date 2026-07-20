import type { Metadata } from "next";
import { Poppins, Open_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.mawarist.web.id"),
  title: "SI-WARIS — Sistem Informasi Waris Multi-Hukum (Islam, Adat Jawa & Perdata)",
  description: "Kalkulasi distribusi waris secara akurat, transparan, dan terpercaya berdasarkan 3 sistem hukum nasional: Hukum Islam (Faraid), Hukum Adat Jawa, dan Hukum Perdata (BW).",
  keywords: [
    "waris", "mawarits", "e-mawarits", "faraid", "kalkulator waris",
    "waris islam", "adat jawa", "waris perdata", "hukum waris",
    "distribusi waris", "si-waris", "sepikul segendongan", "khi"
  ],
  authors: [{ name: "SI-WARIS Team" }],
  openGraph: {
    title: "SI-WARIS — Sistem Informasi Waris Multi-Hukum",
    description: "Sistem kalkulasi waris terpadu nasional berdasarkan Hukum Islam (Faraid), Hukum Adat Jawa, dan Hukum Perdata (BW). Cepat, transparan, dan akurat.",
    url: "https://www.mawarist.web.id",
    siteName: "SI-WARIS",
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
    <html lang="id" className={`${poppins.variable} ${openSans.variable}`}>
      <body className="min-vh-100 d-flex flex-column">
        {children}
        <Toaster position="top-center" reverseOrder={false} />
      </body>
    </html>
  );
}
