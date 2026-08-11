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
    <div className="min-h-screen bg-[oklch(0.985_0.004_247)] text-[oklch(0.21_0.03_258)] font-sans antialiased">

      {/* PAGE HERO */}
      <section className="hero-aurora border-b border-[oklch(0.9_0.012_250)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <ScrollReveal className="max-w-3xl space-y-3">
            <span className="inline-block rounded-full border border-[oklch(0.4_0.093_158/0.3)] bg-[oklch(0.4_0.093_158/0.1)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[oklch(0.4_0.093_158)]">
              Tentang Kami
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-slate-900">Menghadirkan Kepastian dalam Pembagian Warisan</h1>
            <p className="text-lg leading-relaxed text-[oklch(0.53_0.03_255)]">
              E-Mawarist lahir dari kebutuhan masyarakat akan alat bantu yang transparan untuk memahami hak waris setiap anggota keluarga sebelum melangkah ke proses hukum formal.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 space-y-12">

        {/* AUDIO EXPLANATION */}
        <ScrollReveal>
          <AudioExplanation
            title="Tentang Platform E-Mawarist Indonesia"
            badge="Voice Assistant E-Mawarist"
            text="E-Mawarist adalah platform sistem informasi dan kalkulator pembagian warisan terpadu di Indonesia. Misi kami adalah menghadirkan edukasi yang transparan, akurat, dan netral untuk membantu keluarga merencanakan pembagian harta waris secara damai dan adil."
          />
        </ScrollReveal>

        <div className="grid gap-8 lg:grid-cols-2">
          <ScrollReveal>
            <div className="rounded-3xl border border-[oklch(0.9_0.012_250)] bg-white p-8 space-y-3 shadow-2xs h-full">
              <span className="grid size-11 place-items-center rounded-2xl bg-[oklch(0.4_0.093_158/0.1)] text-[oklch(0.4_0.093_158)]">
                <BookOpen className="size-5" />
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">Misi Kami</h2>
              <p className="leading-relaxed text-[oklch(0.53_0.03_255)] text-sm sm:text-base">
                Menyediakan edukasi dan simulasi waris yang mudah diakses oleh siapa saja, sehingga keluarga
                dapat merencanakan pembagian harta dengan pengetahuan yang benar, mengurangi potensi sengketa,
                dan menjaga kerukunan antar ahli waris.
              </p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={100}>
            <div className="rounded-3xl border border-[oklch(0.9_0.012_250)] bg-white p-8 space-y-3 shadow-2xs h-full">
              <span className="grid size-11 place-items-center rounded-2xl bg-[oklch(0.76_0.12_87/0.15)] text-[oklch(0.76_0.12_87)]">
                <Users className="size-5" />
              </span>
              <h2 className="text-2xl font-extrabold text-slate-900">Untuk Siapa?</h2>
              <ul className="space-y-2 text-[oklch(0.53_0.03_255)] text-sm sm:text-base">
                {[
                  "Keluarga yang sedang merencanakan pembagian warisan",
                  "Mahasiswa dan pengajar hukum keluarga & faraidh",
                  "Penyuluh agama, notaris, dan praktisi hukum",
                  "Lembaga bantuan hukum dan penyuluhan masyarakat",
                ].map((t) => (
                  <li key={t} className="flex gap-2">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[oklch(0.4_0.093_158)]" /> {t}
                  </li>
                ))}
              </ul>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal>
          <h2 className="text-2xl font-extrabold text-slate-900">Nilai yang Kami Pegang</h2>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {NILAI.map((n, idx) => {
              const Icon = n.icon;
              return (
                <div key={n.judul} className="lift rounded-3xl border border-[oklch(0.9_0.012_250)] bg-white p-6 shadow-2xs h-full">
                  <Icon className="size-6 text-[oklch(0.4_0.093_158)]" />
                  <h3 className="mt-4 font-bold text-slate-900">{n.judul}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[oklch(0.53_0.03_255)]">{n.desc}</p>
                </div>
              );
            })}
          </div>
        </ScrollReveal>

        <ScrollReveal className="rounded-3xl border border-[oklch(0.9_0.012_250)] bg-white p-8 shadow-2xs space-y-4">
          <h2 className="text-2xl font-extrabold text-slate-900">Dasar Hukum & Rujukan</h2>
          <ul className="grid gap-3 text-[oklch(0.53_0.03_255)] sm:grid-cols-2">
            {DASAR.map((d) => (
              <li key={d} className="flex gap-2 text-sm">
                <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[oklch(0.76_0.12_87)]" /> {d}
              </li>
            ))}
          </ul>
          <p className="mt-6 rounded-2xl border border-[oklch(0.76_0.12_87/0.3)] bg-[oklch(0.76_0.12_87/0.1)] p-4 text-sm text-[oklch(0.25_0.05_80)]">
            <strong>Disclaimer:</strong> hasil perhitungan E-Mawarist bersifat simulasi edukatif dan bukan
            merupakan penetapan hukum. Untuk kekuatan hukum tetap, ajukan penetapan waris di Pengadilan Agama
            atau Pengadilan Negeri, atau buat akta pembagian waris di hadapan notaris.
          </p>
        </ScrollReveal>

        <ScrollReveal className="pt-4 text-center">
          <Link
            href="/kalkulator"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[oklch(0.4_0.093_158)] hover:bg-[oklch(0.35_0.09_158)] text-white text-sm font-semibold rounded-full shadow-lg transition-all no-underline"
          >
            Mulai Simulasi Waris
          </Link>
        </ScrollReveal>
      </section>

    </div>
  );
}
