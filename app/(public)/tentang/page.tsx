"use client";

import Link from "next/link";
import ScrollReveal from "@/components/ScrollReveal";
import AudioExplanation from "@/components/AudioExplanation";
import { BookOpen, HeartHandshake, Lock, Scale, Target, Users } from "lucide-react";

const NILAI = [
  { icon: Scale, judul: "Adil", desc: "Perhitungan mengikuti kaidah hukum yang berlaku tanpa memihak pihak manapun." },
  { icon: Target, judul: "Akurat", desc: "Algoritma memperhatikan hijab mahjub, 'aul, radd, dan batas legitieme portie." },
  { icon: Lock, judul: "Privat", desc: "Seluruh perhitungan diproses di perangkat Anda dan tidak dikirim ke server." },
  { icon: HeartHandshake, judul: "Damai", desc: "Mendorong musyawarah keluarga agar pembagian warisan tidak menimbulkan sengketa." },
];

const DASAR = [
  "Al-Qur'an Surat An-Nisa ayat 7, 11, 12, dan 176",
  "Kompilasi Hukum Islam (KHI) Buku II tentang Hukum Kewarisan",
  "Kitab Undang-Undang Hukum Perdata (BW) Buku II tentang Pewarisan",
  "Yurisprudensi Mahkamah Agung terkait hukum waris adat",
  "Hukum Adat Jawa: asas sepikul segendongan dan kepatutan",
];

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-[#0b0f19] text-[#0f172a] dark:text-slate-100 font-sans antialiased">
      
      {/* PAGE HERO */}
      <section className="hero-aurora border-b border-slate-200 dark:border-slate-800">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <ScrollReveal className="max-w-3xl space-y-3">
            <span className="inline-block rounded-full border border-[#0b6245]/30 dark:border-emerald-500/30 bg-[#0b6245]/10 dark:bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#0b6245] dark:text-emerald-400">
              Tentang Kami
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-slate-900 dark:text-white">Menghadirkan Kepastian dalam Pembagian Warisan</h1>
            <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400">
              E-MAWARIST lahir dari kebutuhan masyarakat akan alat bantu yang transparan untuk memahami hak waris setiap anggota keluarga sebelum melangkah ke proses hukum formal.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 space-y-12">
        
        {/* AUDIO EXPLANATION */}
        <ScrollReveal>
          <AudioExplanation
            title="Tentang Platform E-MAWARIST Indonesia"
            badge="Panduan Audio E-MAWARIST"
            text="Selamat datang di E-MAWARIST. Halaman ini menjelaskan misi kami dalam membantu keluarga Indonesia memahami pembagian harta warisan secara jujur, jelas, dan damai sebelum melangkah ke proses hukum formal di pengadilan maupun notaris."
          />
        </ScrollReveal>

        <div className="grid gap-8 lg:grid-cols-2">
          <ScrollReveal>
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131b2b] p-8 space-y-3 shadow-2xs h-full">
              <span className="grid size-11 place-items-center rounded-2xl bg-[#0b6245]/10 dark:bg-emerald-500/15 text-[#0b6245] dark:text-emerald-400">
                <BookOpen className="size-5" />
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Misi Kami</h2>
              <p className="leading-relaxed text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                Menyediakan edukasi dan simulasi waris yang mudah diakses oleh siapa saja, sehingga keluarga
                dapat merencanakan pembagian harta dengan pengetahuan yang benar, mengurangi potensi sengketa,
                dan menjaga kerukunan antar ahli waris.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131b2b] p-8 space-y-3 shadow-2xs h-full">
              <span className="grid size-11 place-items-center rounded-2xl bg-[#ca9a28]/15 dark:bg-amber-500/15 text-[#ca9a28] dark:text-amber-400">
                <Users className="size-5" />
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Untuk Siapa?</h2>
              <ul className="space-y-2 text-slate-600 dark:text-slate-400 text-sm sm:text-base">
                {[
                  "Keluarga yang sedang merencanakan pembagian warisan",
                  "Mahasiswa dan pengajar hukum keluarga & faraidh",
                  "Penyuluh agama, notaris, dan praktisi hukum",
                  "Lembaga bantuan hukum dan penyuluhan masyarakat",
                ].map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#0b6245] dark:bg-emerald-400" /> {t}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Nilai yang Kami Pegang</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {NILAI.map((n, idx) => {
              const Icon = n.icon;
              return (
                <div key={n.judul} className="lift rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131b2b] p-6 shadow-2xs h-full">
                  <Icon className="size-6 text-[#0b6245] dark:text-emerald-400" />
                  <h3 className="mt-4 font-bold text-slate-900 dark:text-white">{n.judul}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{n.desc}</p>
                </div>
              );
            })}
          </div>
        </ScrollReveal>

        <ScrollReveal className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#131b2b] p-8 shadow-2xs space-y-4">
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">Dasar Hukum & Rujukan</h2>
          <ul className="grid gap-3 text-slate-600 dark:text-slate-400 sm:grid-cols-2">
            {DASAR.map((d) => (
              <li key={d} className="flex gap-2 text-sm">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#ca9a28] dark:bg-amber-400" /> {d}
              </li>
            ))}
          </ul>
          <p className="mt-6 rounded-2xl border border-[#ca9a28]/30 dark:border-amber-500/30 bg-[#ca9a28]/10 dark:bg-amber-500/10 p-4 text-sm text-amber-950 dark:text-amber-200">
            <strong>Disclaimer:</strong> hasil perhitungan E-MAWARIST bersifat simulasi edukatif dan bukan
            merupakan penetapan hukum. Untuk kekuatan hukum tetap, ajukan penetapan waris di Pengadilan Agama
            atau Pengadilan Negeri, atau buat akta pembagian waris di hadapan notaris.
          </p>
        </ScrollReveal>

        <ScrollReveal className="pt-4 text-center">
          <Link
            href="/kalkulator"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#0b6245] hover:bg-[#084b34] text-white text-sm font-semibold rounded-full shadow-lg transition-all no-underline"
          >
            Mulai Simulasi Waris
          </Link>
        </ScrollReveal>
      </section>

    </div>
  );
}
