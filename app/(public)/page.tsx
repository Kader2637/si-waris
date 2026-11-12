"use client";

import Link from "next/link";
import { useState } from "react";
import ScrollReveal from "@/components/ScrollReveal";
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
    a: "Hasil E-MAWARIST bersifat simulasi edukatif. Untuk kepastian hukum, hasil perlu dikuatkan melalui penetapan Pengadilan Agama, Pengadilan Negeri, atau akta notaris.",
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
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19] text-[#0f172a] dark:text-slate-100 font-sans antialiased">
      
      {/* HERO SECTION */}
      <section className="hero-aurora relative overflow-hidden border-b border-slate-200/70 dark:border-slate-800/80 pt-10 pb-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.15fr_1fr] lg:items-center">
            
            {/* LEFT COLUMN */}
            <ScrollReveal className="space-y-6">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#ca9a28]/35 dark:border-amber-500/30 bg-[#ca9a28]/10 dark:bg-amber-500/15 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-[#8e6b18] dark:text-amber-300 shadow-2xs">
                <Sparkles className="size-3.5 text-[#ca9a28] dark:text-amber-400" /> Sistem Informasi Waris Terpadu
              </span>
              
              <h1 className="text-4xl sm:text-6xl font-extrabold leading-[1.05] tracking-tight text-[#0f172a] dark:text-white">
                Hitung Pembagian<br />
                Waris Secara <span className="text-[#0b6245] dark:text-emerald-400">Adil,</span><br />
                <span className="text-[#0b6245] dark:text-emerald-400">Akurat,</span> dan <span className="text-[#ca9a28] dark:text-amber-400">Sesuai</span><br />
                <span className="text-[#ca9a28] dark:text-amber-400">Hukum</span>
              </h1>
              
              <p className="max-w-xl text-base sm:text-lg leading-relaxed text-[#475569] dark:text-slate-300 font-normal">
                E-MAWARIST membantu Anda mensimulasikan pembagian harta warisan berdasarkan tiga sistem hukum yang berlaku di Indonesia — Syariah (Faraidh), KUHPerdata, dan Adat Jawa — lengkap dengan visualisasi dan laporan resmi.
              </p>
              
              <div className="pt-2 flex flex-wrap gap-3">
                <Link 
                  href="/kalkulator" 
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#0b6245] hover:bg-[#084b34] text-white text-sm font-semibold rounded-full shadow-lg shadow-emerald-900/20 transition-all no-underline"
                >
                  Mulai Simulasi Waris <ArrowRight className="size-4" />
                </Link>
                <Link 
                  href="/syariah" 
                  className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-white dark:bg-slate-800/90 border border-slate-300/80 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm font-semibold rounded-full shadow-2xs transition-all no-underline"
                >
                  <BookOpen className="size-4 text-slate-500 dark:text-slate-400" /> Pelajari Faraidh
                </Link>
              </div>

              <dl className="pt-4 grid grid-cols-3 gap-3.5 max-w-md">
                {[
                  ["3", "Sistem Hukum"],
                  ["13+", "Kategori Ahli Waris"],
                  ["100%", "Gratis & Privat"],
                ].map(([val, label]) => (
                  <div key={label} className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white/80 dark:bg-[#131b2b]/90 p-4 shadow-2xs">
                    <dt className="text-2xl font-black text-[#0b6245] dark:text-emerald-400">{val}</dt>
                    <dd className="text-xs text-[#64748b] dark:text-slate-400 mt-0.5 font-normal">{label}</dd>
                  </div>
                ))}
              </dl>
            </ScrollReveal>

            {/* RIGHT COLUMN */}
            <ScrollReveal delay={150} className="glass rounded-3xl p-7 sm:p-8 space-y-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#64748b] dark:text-slate-400 font-mono">
                  CONTOH HASIL SIMULASI
                </p>
                <p className="mt-1 text-xs sm:text-sm font-normal text-[#475569] dark:text-slate-300">
                  Harta bersih Rp 1.200.000.000 — Suami, Ibu, 2 Anak Perempuan
                </p>
              </div>

              <ul className="space-y-3">
                <li className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 p-4 space-y-2">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-semibold text-[#0f172a] dark:text-slate-100">Suami</span>
                    <span className="rounded-md bg-[#0b6245]/10 dark:bg-emerald-500/15 px-2 py-0.5 font-mono text-xs text-[#0b6245] dark:text-emerald-400 font-bold">
                      1/4
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800">
                    <div className="h-full rounded-full bg-[#0b6245] dark:bg-emerald-500" style={{ width: "25%" }} />
                  </div>
                  <p className="text-xs sm:text-sm font-bold tabular-nums font-mono text-[#0f172a] dark:text-slate-100">Rp 300.000.000</p>
                </li>

                <li className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 p-4 space-y-2">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-semibold text-[#0f172a] dark:text-slate-100">Ibu</span>
                    <span className="rounded-md bg-[#0b6245]/10 dark:bg-emerald-500/15 px-2 py-0.5 font-mono text-xs text-[#0b6245] dark:text-emerald-400 font-bold">
                      1/6
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800">
                    <div className="h-full rounded-full bg-[#0b6245] dark:bg-emerald-500" style={{ width: "16.7%" }} />
                  </div>
                  <p className="text-xs sm:text-sm font-bold tabular-nums font-mono text-[#0f172a] dark:text-slate-100">Rp 200.000.000</p>
                </li>

                <li className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-900/70 p-4 space-y-2">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-semibold text-[#0f172a] dark:text-slate-100">Anak Perempuan (2)</span>
                    <span className="rounded-md bg-[#0b6245]/10 dark:bg-emerald-500/15 px-2 py-0.5 font-mono text-xs text-[#0b6245] dark:text-emerald-400 font-bold">
                      2/3
                    </span>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800">
                    <div className="h-full rounded-full bg-[#0b6245] dark:bg-emerald-500" style={{ width: "58.3%" }} />
                  </div>
                  <p className="text-xs sm:text-sm font-bold tabular-nums font-mono text-[#0f172a] dark:text-slate-100">Rp 700.000.000</p>
                </li>
              </ul>

              <p className="pt-2 border-t border-slate-100/80 dark:border-slate-800 flex items-center gap-2 text-xs text-[#64748b] dark:text-slate-400 font-normal">
                <ShieldCheck className="size-4 text-[#0b6245] dark:text-emerald-400 shrink-0" /> Perhitungan diproses di perangkat Anda.
              </p>
            </ScrollReveal>

          </div>
        </div>
      </section>

      {/* 3 SISTEM HUKUM WARIS SECTION */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <ScrollReveal className="max-w-2xl">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-[#0f172a] dark:text-white">
            Tiga Sistem Hukum Waris
          </h2>
          <p className="mt-3 text-[#64748b] dark:text-slate-400 text-sm sm:text-base leading-relaxed font-normal">
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
                  className="lift group rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131b2b] p-7 shadow-2xs hover:shadow-xl hover:-translate-y-1 transition-all no-underline flex flex-col justify-between h-full"
                >
                  <div>
                    <span className="grid size-12 place-items-center rounded-2xl bg-[#0b6245]/10 dark:bg-emerald-500/15 text-[#0b6245] dark:text-emerald-400 transition-colors group-hover:bg-[#0b6245] group-hover:text-white">
                      <Icon className="size-6" />
                    </span>
                    <h3 className="mt-5 text-xl font-bold text-[#0f172a] dark:text-white">{s.nama}</h3>
                    <p className="text-xs font-semibold uppercase tracking-wider text-[#ca9a28] dark:text-amber-400 mt-1 font-mono">{s.sub}</p>
                    <p className="mt-3 text-sm leading-relaxed text-[#64748b] dark:text-slate-400 font-normal">{s.desc}</p>
                    
                    <ul className="mt-4 space-y-1.5 text-sm font-normal">
                      {s.poin.map((p) => (
                        <li key={p} className="flex gap-2 text-[#64748b] dark:text-slate-400">
                          <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-[#ca9a28] dark:bg-amber-400" /> {p}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[#0b6245] dark:text-emerald-400">
                    Buka perhitungan <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </ScrollReveal>
            );
          })}
        </div>
      </section>

      {/* FITUR UNGGULAN */}
      <section className="border-y border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#0f1624]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
          <ScrollReveal>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-[#0f172a] dark:text-white">
              Fitur Unggulan
            </h2>
          </ScrollReveal>
          
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FITUR.map((f, idx) => {
              const Icon = f.icon;
              return (
                <ScrollReveal key={f.judul} delay={idx * 80}>
                  <div className="lift rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-slate-50/70 dark:bg-[#131b2b] p-6 shadow-2xs h-full">
                    <span className="grid size-11 place-items-center rounded-2xl bg-[#ca9a28]/15 dark:bg-amber-500/15 text-[#ca9a28] dark:text-amber-400">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="mt-4 font-bold text-[#0f172a] dark:text-white text-base">{f.judul}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#64748b] dark:text-slate-400 font-normal">{f.desc}</p>
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
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-[#0f172a] dark:text-white">
              Edukasi & FAQ
            </h2>
            <p className="mt-3 text-[#64748b] dark:text-slate-400 text-base leading-relaxed font-normal">
              Pertanyaan yang paling sering diajukan seputar aturan pembagian waris di Indonesia.
            </p>
            <Link 
              href="/tentang" 
              className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 bg-[#ca9a28] hover:bg-[#a87e1c] text-white text-sm font-semibold rounded-full shadow-md transition-all no-underline"
            >
              Tentang E-MAWARIST
            </Link>
          </ScrollReveal>

          <div className="space-y-3">
            {FAQ.map((f, i) => (
              <ScrollReveal key={i} delay={i * 50}>
                <div className="rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-[#131b2b] overflow-hidden shadow-2xs">
                  <button
                    className="w-full p-5 text-left text-base font-semibold text-[#0f172a] dark:text-slate-100 flex justify-between items-center gap-4 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                    onClick={() => toggleFaq(i)}
                  >
                    <span>{f.q}</span>
                    <ChevronDown className={`size-4 text-slate-400 transition-transform ${openFaq === i ? "rotate-180 text-[#0b6245] dark:text-emerald-400" : ""}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 text-sm leading-relaxed text-[#64748b] dark:text-slate-300 border-t border-slate-100 dark:border-slate-800 pt-3 font-normal">
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
          <div className="hero-aurora rounded-3xl border border-slate-200/80 dark:border-slate-800 p-10 text-center sm:p-16 space-y-4 shadow-xl">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-[#0f172a] dark:text-white">
              Siap menghitung pembagian waris keluarga Anda?
            </h2>
            <p className="mx-auto max-w-xl text-[#64748b] dark:text-slate-300 text-sm sm:text-base font-normal">
              Bandingkan hasil ketiga sistem hukum secara bersandingan dalam satu layar.
            </p>
            <div className="pt-4">
              <Link 
                href="/kalkulator" 
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#0b6245] hover:bg-[#084b34] text-white text-sm font-semibold rounded-full shadow-lg transition-all no-underline"
              >
                <Calculator className="size-4" /> Buka Perhitungan Terpadu
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </section>

    </div>
  );
}