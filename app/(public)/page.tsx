"use client";

import Link from "next/link";
import { useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";
import HeroSection from "@/components/HeroSection";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  FileDown,
  GitBranch,
  Landmark,
  Moon,
  PieChart,
  ShieldCheck,
  Sparkles,
  Users,
  ChevronDown,
} from "lucide-react";

const SISTEM = [
  {
    href: "/syariah",
    icon: Moon,
    nama: "Hukum Syariah",
    sub: "Faraidh — Al-Qur'an & KHI",
    desc: "Pembagian berdasarkan Dzawil Furud, Ashabah, dan kaidah Hijab Mahjub dengan porsi pecahan yang pasti.",
    poin: ["Porsi 1/2, 1/4, 1/8, 2/3, 1/3, 1/6", "Perhitungan 'Aul & Radd", "Sesuai Kompilasi Hukum Islam"],
  },
  {
    href: "/perdata",
    icon: Landmark,
    nama: "Hukum Perdata",
    sub: "KUHPerdata / BW",
    desc: "Sistem 4 golongan ahli waris dengan bagian yang sama besar antara laki-laki dan perempuan.",
    poin: ["Golongan I s/d IV", "Legitieme Portie", "Kloving garis ayah & ibu"],
  },
  {
    href: "/adat-jawa",
    icon: Users,
    nama: "Hukum Adat Jawa",
    sub: "Sepikul Segendongan",
    desc: "Pembagian berbasis kepatutan dan musyawarah keluarga dengan rasio 2:1 atau sama rata.",
    poin: ["Sepikul segendongan (2:1)", "Musyawarah mufakat", "Pemisahan harta gono-gini"],
  },
];

const FITUR = [
  { icon: Calculator, judul: "Simulasi Real-time", desc: "Hasil berubah seketika saat data harta dan ahli waris disesuaikan." },
  { icon: PieChart, judul: "Visualisasi Diagram", desc: "Diagram lingkaran interaktif memperjelas porsi tiap ahli waris." },
  { icon: FileDown, judul: "Export Laporan PDF", desc: "Unduh laporan rapi siap cetak untuk dokumentasi keluarga." },
  { icon: GitBranch, judul: "Pohon Silsilah", desc: "Bangun struktur keluarga untuk memetakan hubungan ahli waris." },
];

const FAQ = [
  {
    q: "Apa saja yang dikurangi sebelum harta dibagi?",
    a: "Harta peninggalan dikurangi biaya pengurusan jenazah, pelunasan hutang pewaris, dan wasiat (maksimal 1/3 harta) sebelum dibagikan kepada ahli waris.",
  },
  {
    q: "Apa itu Hijab Mahjub dalam hukum Syariah?",
    a: "Hijab Mahjub adalah keadaan di mana seorang ahli waris terhalang haknya oleh ahli waris lain yang lebih dekat. Contohnya kakek terhalang oleh ayah, dan saudara terhalang oleh anak laki-laki.",
  },
  {
    q: "Apa perbedaan mendasar hukum Perdata dengan Syariah?",
    a: "Dalam KUHPerdata anak laki-laki dan perempuan menerima bagian yang sama besar serta pasangan hidup terlama disamakan dengan seorang anak, sedangkan Syariah menggunakan porsi tetap dengan rasio 2:1.",
  },
  {
    q: "Apakah hasil perhitungan ini sah secara hukum?",
    a: "Hasil E-Mawarist bersifat simulasi edukatif. Untuk kepastian hukum, hasil perlu dikuatkan melalui penetapan Pengadilan Agama, Pengadilan Negeri, atau akta notaris.",
  },
  {
    q: "Apa itu Legitieme Portie?",
    a: "Legitieme Portie adalah bagian mutlak yang dijamin undang-undang bagi ahli waris garis lurus, sehingga tidak dapat dihapus oleh wasiat atau hibah pewaris.",
  },
];

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (idx: number) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19] text-[#0f172a] dark:text-[#f8fafc] font-sans antialiased">

      {/* HERO SECTION */}
      <HeroSection />

      {/* 3 SISTEM HUKUM WARIS SECTION */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <ScrollReveal className="max-w-2xl">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-[#0f172a]">
            Tiga Sistem Hukum Waris
          </h2>
          <p className="mt-3 text-[#64748b] text-sm sm:text-base leading-relaxed font-normal">
            Indonesia menganut pluralisme hukum waris. Pilih sistem yang sesuai dengan keyakinan dan kesepakatan keluarga Anda.
          </p>
        </ScrollReveal>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {SISTEM.map((s, idx) => {
            const Icon = s.icon;
            return (
              <ScrollReveal key={s.href} delay={idx * 100}>
                <Link
                  href={s.href}
                  className="lift group rounded-3xl border border-slate-200/80 bg-white p-7 shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all no-underline flex flex-col justify-between h-full"
                >
                  <div>
                    <span className="grid size-12 place-items-center rounded-2xl bg-[#0b6245]/10 text-[#0b6245] transition-colors group-hover:bg-[#0b6245] group-hover:text-white">
                      <Icon className="size-6" />
                    </span>
                    <h3 className="mt-5 text-xl font-bold text-[#0f172a]">{s.nama}</h3>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#ca9a28] mt-1 font-mono">{s.sub}</p>
                    <p className="mt-3 text-sm leading-relaxed text-[#64748b] font-normal">{s.desc}</p>

                    <ul className="mt-4 space-y-1.5 text-sm font-normal">
                      {s.poin.map((p) => (
                        <li key={p} className="flex gap-2 text-[#64748b]">
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#ca9a28]" /> {p}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0b6245]">
                    Buka kalkulator <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* FITUR UNGGULAN */}
      <section className="border-y border-slate-200/80 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <ScrollReveal>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-[#0f172a]">
              Fitur Unggulan
            </h2>
          </ScrollReveal>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FITUR.map((f, idx) => {
              const Icon = f.icon;
              return (
                <ScrollReveal key={f.judul} delay={idx * 80}>
                  <div className="lift rounded-3xl border border-slate-200/80 bg-slate-50/70 p-6 shadow-2xs h-full">
                    <span className="grid size-11 place-items-center rounded-2xl bg-[#ca9a28]/15 text-[#ca9a28]">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="mt-4 font-bold text-[#0f172a] text-base">{f.judul}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#64748b] font-normal">{f.desc}</p>
                  </div>
                </ScrollReveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* EDUKASI & FAQ */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <ScrollReveal>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-[#0f172a]">
              Edukasi & FAQ
            </h2>
            <p className="mt-3 text-[#64748b] text-base leading-relaxed font-normal">
              Pertanyaan yang paling sering diajukan seputar aturan pembagian waris di Indonesia.
            </p>
            <Link
              href="/tentang"
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-[#ca9a28] hover:bg-[#a87e1c] text-white text-sm font-semibold rounded-full shadow-md transition-all no-underline"
            >
              Tentang E-Mawarist
            </Link>
          </ScrollReveal>

          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <ScrollReveal key={i} delay={i * 50}>
                <div className="rounded-2xl border border-slate-200/80 bg-white overflow-hidden shadow-2xs">
                  <button
                    className="w-full p-5 text-left text-base font-semibold text-[#0f172a] flex justify-between items-center gap-4 hover:bg-slate-50 transition-colors cursor-pointer"
                    onClick={() => toggleFaq(i)}
                  >
                    <span>{f.q}</span>
                    <ChevronDown className={`size-4 text-slate-400 transition-transform ${openFaq === i ? "rotate-180 text-[#0b6245]" : ""}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 text-sm leading-relaxed text-[#64748b] border-t border-slate-100 pt-3 font-normal">
                      {f.a}
                    </div>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* BOTTOM CTA BANNER */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6">
        <ScrollReveal>
          <div className="hero-aurora rounded-3xl border border-slate-200/80 p-10 text-center sm:p-16 space-y-4 shadow-xl">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-[#0f172a]">
              Siap menghitung pembagian waris keluarga Anda?
            </h2>
            <p className="mx-auto max-w-xl text-[#64748b] text-sm sm:text-base font-normal">
              Bandingkan hasil ketiga sistem hukum secara bersandingan dalam satu layar.
            </p>
            <div className="pt-4">
              <Link
                href="/kalkulator"
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#0b6245] hover:bg-[#084b34] text-white text-sm font-semibold rounded-full shadow-lg transition-all no-underline"
              >
                <Calculator className="size-4" /> Buka Kalkulator Terpadu
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

    </div>
  );
}