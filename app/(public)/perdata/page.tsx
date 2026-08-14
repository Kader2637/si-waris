"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ScrollReveal from "@/components/ScrollReveal";
import AudioExplanation from "@/components/AudioExplanation";
import { ArrowLeft, ArrowRight, Download, RotateCcw, Lock, Building2 } from "lucide-react";
import { calculatePerdata } from "@/lib/perdataLogic";

const GOLONGAN = [
  {
    n: "I",
    judul: "Anak & Pasangan",
    desc: "Suami/istri yang hidup terlama beserta anak-anak dan keturunannya. Masing-masing menerima bagian yang sama besar.",
  },
  {
    n: "II",
    judul: "Orang Tua & Saudara",
    desc: "Ayah, ibu, saudara kandung, dan keturunan saudara. Orang tua dijamin minimal 1/4 bagian masing-masing.",
  },
  {
    n: "III",
    judul: "Leluhur (Kakek-Nenek)",
    desc: "Harta dibelah dua (kloving): separuh untuk garis ayah, separuh untuk garis ibu.",
  },
  {
    n: "IV",
    judul: "Keluarga Sedarah",
    desc: "Sanak keluarga dalam garis menyamping sampai derajat keenam. Bila tidak ada, harta jatuh kepada Negara.",
  },
];

const HUBUNGAN_OPTIONS = [
  "Suami", "Istri",
  "Anak Laki-laki", "Anak Perempuan",
  "Ayah", "Ibu",
  "Saudara Laki-laki Sekandung", "Saudara Perempuan Sekandung",
];

const formatIDR = (val: number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val || 0);
};

export default function PerdataPage() {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [namaPewaris, setNamaPewaris] = useState("");
  const [hartaKonversi, setHartaKonversi] = useState(0);
  const [hartaTunai, setHartaTunai] = useState("");
  const [hutang, setHutang] = useState("");
  const [wasiat, setWasiat] = useState("");

  useEffect(() => {
    const saved = sessionStorage.getItem("emawarist_total_harta_kotor");
    if (saved && parseInt(saved) > 0) {
      setHartaKonversi(parseInt(saved));
    }
  }, []);

  const [ahliWaris, setAhliWaris] = useState<{ nama: string; hubungan: string }[]>([]);

  const parseNum = (val: string) => parseInt(val.replace(/\D/g, "")) || 0;

  const addHeir = () => setAhliWaris([...ahliWaris, { nama: "", hubungan: "Anak Laki-laki" }]);
  const removeHeir = (idx: number) => setAhliWaris(ahliWaris.filter((_, i) => i !== idx));
  const updateHeir = (idx: number, field: string, value: string) => {
    const arr = [...ahliWaris];
    arr[idx] = { ...arr[idx], [field]: value };
    setAhliWaris(arr);
  };

  const hartaKonversiVal = hartaKonversi;
  const hartaTunaiVal = parseNum(hartaTunai);
  const hartaKotorVal = hartaKonversiVal + hartaTunaiVal;
  const hutangVal = parseNum(hutang);
  const wasiatVal = parseNum(wasiat);

  const hasil = useMemo(() => {
    const jenazah = { hartaKotor: hartaKotorVal, utang: hutangVal, wasiat: wasiatVal };
    const list = ahliWaris.map((h, i) => ({ id: `h_${i}`, nama: h.nama || h.hubungan, hubungan: h.hubungan, statusHidup: true }));
    return calculatePerdata(jenazah, list);
  }, [hartaKotorVal, hutangVal, wasiatVal, ahliWaris]);

  const exportPDF = () => {
    const doc = new jsPDF();
    const dateStr = new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' });

    doc.setFontSize(18);
    doc.text("LAPORAN PEMBAGIAN WARIS KUHPERDATA (BW)", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Platform E-MAWARIST — ${dateStr}`, 105, 26, { align: "center" });
    doc.line(20, 30, 190, 30);

    doc.setFontSize(11);
    doc.text(`Nama Pewaris: ${namaPewaris || "Almarhum / Almarhumah"}`, 20, 40);
    doc.text(`Harta Bersih: ${formatIDR(hasil.hartaBersih)}`, 120, 40);

    const activeList = hasil.ahliWarisGetted.filter((h: any) => h.status === "Mewarisi");

    autoTable(doc, {
      startY: 55,
      head: [['NO', 'AHLI WARIS', 'STATUS', 'PORSI', 'NOMINAL (IDR)', 'ALASAN HUKUM']],
      body: activeList.map((h: any, i: number) => [
        i + 1,
        `${h.nama || "-"}\n(${h.hubungan})`,
        h.status,
        h.jatahPersen,
        formatIDR(h.jatahNominal),
        h.alasan
      ]),
      headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255] },
      styles: { fontSize: 8 }
    });

    doc.save(`laporan-waris-perdata-${namaPewaris || "simulasi"}.pdf`);
  };

  return (
    <div className="min-h-screen bg-[oklch(0.985_0.004_247)] text-[oklch(0.21_0.03_258)] font-sans antialiased">
      
      {/* PAGE HERO WITH EXACT WARIS-WISE STYLE */}
      <section className="hero-aurora border-b border-[oklch(0.9_0.012_250)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <ScrollReveal className="max-w-3xl space-y-3">
            <span className="inline-block rounded-full border border-[oklch(0.4_0.093_158/0.3)] bg-[oklch(0.4_0.093_158/0.1)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[oklch(0.4_0.093_158)]">
              Hukum Perdata
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-slate-900">Kalkulator Waris KUHPerdata (BW)</h1>
            <p className="text-lg leading-relaxed text-[oklch(0.53_0.03_255)]">
              Pewarisan ab intestato menurut Kitab Undang-Undang Hukum Perdata dengan sistem empat golongan ahli waris — golongan yang lebih tinggi menutup golongan berikutnya.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 space-y-8">
        
        {/* AUDIO EXPLANATION WIDGET */}
        <ScrollReveal>
          <AudioExplanation
            title="Sistem Pembagian Waris Hukum Perdata (BW KUHPerdata)"
            badge="Voice Assistant Perdata"
            text="Hukum Waris Perdata diatur dalam Kitab Undang-Undang Hukum Perdata atau BW. Sistem ini membagi ahli waris ke dalam empat golongan utama di mana golongan yang lebih tinggi menutup hak golongan di bawahnya, tanpa membedakan jatah bagian antara laki-laki dan perempuan."
          />
        </ScrollReveal>

        {/* GOLONGAN GRID */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GOLONGAN.map((g, idx) => (
            <ScrollReveal key={g.n} delay={idx * 80}>
              <div className="lift rounded-3xl border border-[oklch(0.9_0.012_250)] bg-white p-6 shadow-2xs h-full">
                <span className="grid size-10 place-items-center rounded-xl bg-[oklch(0.4_0.093_158/0.1)] font-extrabold text-[oklch(0.4_0.093_158)] text-base">
                  {g.n}
                </span>
                <h3 className="mt-4 font-bold text-slate-900 text-base">{g.judul}</h3>
                <p className="mt-2 text-sm leading-relaxed text-[oklch(0.53_0.03_255)]">{g.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* LEGITIEME PORTIE BANNER */}
        <ScrollReveal className="rounded-3xl border border-[oklch(0.76_0.12_87/0.3)] bg-[oklch(0.76_0.12_87/0.1)] p-6 space-y-2">
          <h3 className="font-bold text-base text-slate-900">Legitieme Portie (Bagian Mutlak)</h3>
          <p className="text-sm leading-relaxed text-[oklch(0.53_0.03_255)]">
            Ahli waris garis lurus (legitimaris) memiliki bagian yang dijamin undang-undang dan tidak dapat
            dikurangi oleh hibah maupun wasiat: <strong>1/2</strong> dari bagian ab intestato bila hanya ada
            satu anak, <strong>2/3</strong> bila ada dua anak, dan <strong>3/4</strong> bila ada tiga anak atau
            lebih.
          </p>
        </ScrollReveal>

        {/* WIZARD CONTAINER */}
        <ScrollReveal className="rounded-3xl border border-[oklch(0.9_0.012_250)] bg-white p-6 sm:p-8 shadow-2xs space-y-8">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-6">
            <div className="flex items-center gap-2">
              {[
                { idx: 0, label: "1. Data Harta" },
                { idx: 1, label: "2. Ahli Waris" },
                { idx: 2, label: "3. Hasil Simulasi" },
              ].map((s) => (
                <span
                  key={s.idx}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold ${
                    step === s.idx
                      ? "bg-[oklch(0.4_0.093_158)] text-white"
                      : step > s.idx
                      ? "bg-[oklch(0.4_0.093_158/0.1)] text-[oklch(0.4_0.093_158)]"
                      : "bg-slate-100 text-slate-400"
                  }`}
                >
                  {s.label}
                </span>
              ))}
            </div>

            <button
              type="button"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 cursor-pointer"
              onClick={() => {
                setHartaTunai("");
                setHutang("");
                setWasiat("");
                setNamaPewaris("");
                setAhliWaris([]);
                setStep(0);
              }}
            >
              <RotateCcw className="size-3.5" /> Reset
            </button>
          </div>

          {/* STEP 0 */}
          {step === 0 && (
            <div className="space-y-6">
              <div>
                <label className="text-xs font-medium text-slate-800 block mb-1.5">Nama Pewaris / Almarhum</label>
                <input
                  type="text"
                  className="w-full h-11 rounded-xl border border-[oklch(0.9_0.012_250)] px-4 text-sm font-medium focus:ring-2 focus:ring-[oklch(0.4_0.093_158/0.2)] focus:border-[oklch(0.4_0.093_158)]"
                  placeholder="Contoh: Bpk. Herman"
                  value={namaPewaris}
                  onChange={(e) => setNamaPewaris(e.target.value)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* 1. Harta Hasil Konversi (Readonly) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                      1. Harta Hasil Konversi (Readonly)
                    </label>
                    <Link
                      href="/konversi-harta"
                      className="text-[10px] font-bold text-[#0b6245] dark:text-emerald-400 hover:underline flex items-center gap-1 no-underline"
                    >
                      <Building2 className="size-3" /> Edit Konversi Harta
                    </Link>
                  </div>
                  <input
                    type="text"
                    readOnly
                    disabled
                    className="w-full h-11 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 px-4 text-sm font-mono font-bold text-slate-700 dark:text-slate-300 cursor-not-allowed outline-none"
                    value={formatIDR(hartaKonversiVal)}
                  />
                  <span className="inline-flex items-center gap-1 mt-1 text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-200 dark:border-emerald-800">
                    <Lock className="size-3" /> Terimpor dari Konversi Harta (Terkunci)
                  </span>
                </div>

                {/* 2. Harta Tunai / Tabungan Kas Mandiri (Editable) */}
                <div>
                  <label className="text-xs font-bold text-slate-800 dark:text-slate-200 block mb-1.5">
                    2. Harta Tunai / Tabungan Kas Mandiri (Rp)
                  </label>
                  <input
                    type="text"
                    className="w-full h-11 rounded-xl border border-slate-300 dark:border-slate-700 px-4 text-sm font-mono font-bold focus:ring-2 focus:ring-[#0b6245] outline-none"
                    placeholder="Masukkan nominal tunai/kas"
                    value={hartaTunai ? Number(hartaTunai.replace(/\D/g, "")).toLocaleString("id-ID") : ""}
                    onChange={(e) => setHartaTunai(e.target.value)}
                  />
                  <span className="text-[10px] text-slate-400 block mt-1">
                    Nominal tunai / uang kas tambahan yang belum ada di konversi
                  </span>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 block mb-1.5">Hutang Pewaris (Rp)</label>
                  <input
                    type="text"
                    className="w-full h-11 rounded-xl border border-slate-300 dark:border-slate-700 px-4 text-sm font-mono focus:ring-2 focus:ring-[#0b6245] outline-none"
                    placeholder="Rp 0"
                    value={hutang ? Number(hutang.replace(/\D/g, "")).toLocaleString("id-ID") : ""}
                    onChange={(e) => setHutang(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 block mb-1.5">Wasiat Pewaris (Rp)</label>
                  <input
                    type="text"
                    className="w-full h-11 rounded-xl border border-slate-300 dark:border-slate-700 px-4 text-sm font-mono focus:ring-2 focus:ring-[#0b6245] outline-none"
                    placeholder="Rp 0"
                    value={wasiat ? Number(wasiat.replace(/\D/g, "")).toLocaleString("id-ID") : ""}
                    onChange={(e) => setWasiat(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-4 space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500 font-mono">Total Harta Kotor (Tirkah)</p>
                  <p className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
                    {formatIDR(hartaKotorVal)}
                  </p>
                  <p className="text-[10px] text-slate-400">Konversi ({formatIDR(hartaKonversiVal)}) + Tunai ({formatIDR(hartaTunaiVal)})</p>
                </div>

                <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-4 space-y-1">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#0b6245] dark:text-emerald-400 font-mono">Harta Bersih Siap Dibagi</p>
                  <p className="text-xl font-extrabold text-[#0b6245] dark:text-emerald-400 font-mono">
                    {formatIDR(Math.max(0, hartaKotorVal - hutangVal - wasiatVal))}
                  </p>
                  <p className="text-[10px] text-slate-500">Setelah dikurangi Hutang ({formatIDR(hutangVal)}) & Wasiat ({formatIDR(wasiatVal)})</p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900">Pilih Ahli Waris</h3>
                <button
                  type="button"
                  onClick={addHeir}
                  className="px-4 py-2 bg-[oklch(0.4_0.093_158)] hover:bg-[oklch(0.35_0.09_158)] text-white text-xs font-semibold rounded-full shadow-2xs transition-all cursor-pointer"
                >
                  + Tambah Ahli Waris
                </button>
              </div>

              {ahliWaris.length === 0 ? (
                <div className="p-8 text-center border-2 border-dashed border-slate-200 rounded-2xl text-xs text-slate-400">
                  Belum ada ahli waris ditambahkan.
                </div>
              ) : (
                <div className="space-y-3">
                  {ahliWaris.map((h, i) => (
                    <div key={i} className="flex flex-wrap items-center gap-3 p-4 rounded-2xl border border-slate-200 bg-slate-50">
                      <div className="flex-1 min-w-[180px]">
                        <input
                          type="text"
                          className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium"
                          placeholder="Nama Ahli Waris (Opsional)"
                          value={h.nama}
                          onChange={(e) => updateHeir(i, "nama", e.target.value)}
                        />
                      </div>

                      <div className="w-64">
                        <select
                          className="w-full h-10 rounded-xl border border-slate-200 bg-white px-3 text-xs font-medium"
                          value={h.hubungan}
                          onChange={(e) => updateHeir(i, "hubungan", e.target.value)}
                        >
                          {HUBUNGAN_OPTIONS.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeHeir(i)}
                        className="px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl border border-rose-200 cursor-pointer"
                      >
                        Hapus
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 rounded-2xl border border-[oklch(0.9_0.012_250)] bg-white">
                  <p className="text-xs font-medium uppercase tracking-wider text-[oklch(0.53_0.03_255)]">Dasar Hukum</p>
                  <p className="text-lg font-extrabold text-slate-900 mt-1">KUHPerdata / BW (4 Golongan)</p>
                </div>
                <div className="p-4 rounded-2xl border border-[oklch(0.4_0.093_158/0.3)] bg-[oklch(0.4_0.093_158/0.1)]">
                  <p className="text-xs font-medium uppercase tracking-wider text-[oklch(0.53_0.03_255)]">Harta Bersih</p>
                  <p className="text-lg font-extrabold text-[oklch(0.4_0.093_158)] font-mono mt-1">{formatIDR(hasil.hartaBersih)}</p>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-[oklch(0.9_0.012_250)] bg-white shadow-2xs">
                <table className="w-full text-left text-sm text-slate-600">
                  <thead className="bg-slate-50 text-[oklch(0.53_0.03_255)] font-semibold uppercase text-xs border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3">Ahli Waris</th>
                      <th className="px-4 py-3">Status</th>
                      <th className="px-4 py-3">Porsi</th>
                      <th className="px-4 py-3 text-right">Nominal Rupiah</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {hasil.ahliWarisGetted.map((b: any, i: number) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="px-4 py-3.5">
                          <strong className="text-slate-900 block font-semibold">{b.nama}</strong>
                          <span className="text-xs text-[oklch(0.53_0.03_255)] block">{b.alasan}</span>
                        </td>
                        <td className="px-4 py-3.5">
                          <span className={`inline-flex px-2 py-0.5 rounded text-xs font-bold ${b.status === "Mewarisi" ? "bg-[oklch(0.4_0.093_158/0.1)] text-[oklch(0.4_0.093_158)]" : "bg-amber-100 text-amber-800"}`}>
                            {b.status}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 font-mono font-bold text-[oklch(0.4_0.093_158)]">{b.jatahPersen}</td>
                        <td className="px-4 py-3.5 text-right font-mono font-bold text-slate-900">{formatIDR(b.jatahNominal)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <button
                type="button"
                onClick={exportPDF}
                className="inline-flex items-center gap-2 px-6 py-3 bg-[oklch(0.76_0.12_87)] hover:bg-[oklch(0.7_0.12_87)] text-slate-950 text-sm font-semibold rounded-full shadow-md transition-all cursor-pointer"
              >
                <Download className="size-4" /> Unduh Laporan PDF
              </button>
            </div>
          )}

          {/* ACTION NAVIGATION */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100">
            <button
              type="button"
              disabled={step === 0}
              onClick={() => setStep((s) => (s - 1) as any)}
              className="px-4 py-2 text-xs font-semibold border border-slate-200 hover:bg-slate-100 rounded-lg disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="size-4" /> Sebelumnya
            </button>

            {step < 2 && (
              <button
                type="button"
                disabled={(step === 0 && (!namaPewaris.trim() || hartaKotorVal <= 0)) || (step === 1 && ahliWaris.length === 0)}
                onClick={() => {
                  if (step === 0 && (!namaPewaris.trim() || hartaKotorVal <= 0)) {
                    alert("Silakan lengkapi Nama Pewaris dan Total Harta Peninggalan terlebih dahulu!");
                    return;
                  }
                  if (step === 1 && ahliWaris.length === 0) {
                    alert("Silakan tambahkan minimal 1 Ahli Waris terlebih dahulu!");
                    return;
                  }
                  setStep((s) => (s + 1) as any);
                }}
                className={`px-6 py-3 text-xs font-semibold rounded-full flex items-center gap-1.5 shadow-md transition-all ${
                  (step === 0 && namaPewaris.trim() && hartaKotorVal > 0) || (step === 1 && ahliWaris.length > 0)
                    ? "bg-[#0b6245] hover:bg-[#084b34] text-white cursor-pointer scale-102 hover:scale-105"
                    : "bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-400 cursor-not-allowed opacity-60"
                }`}
              >
                Lanjut <ArrowRight className="size-4" />
              </button>
            )}
          </div>

        </ScrollReveal>

      </section>

    </div>
  );
}
