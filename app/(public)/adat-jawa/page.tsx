"use client";

import { useMemo, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ScrollReveal from "@/components/ScrollReveal";
import AudioExplanation from "@/components/AudioExplanation";
import { ArrowLeft, ArrowRight, Download, RotateCcw } from "lucide-react";
import { calculateAdatJawa } from "@/lib/jawaLogic";

const METODE = [
  {
    value: "SEPIKUL_SEGENDONGAN" as const,
    judul: "Sepikul Segendongan (2:1)",
    desc: "Anak laki-laki memikul dua bagian, anak perempuan menggendong satu bagian.",
  },
  {
    value: "KUM_KUM_KUPAT" as const,
    judul: "Musyawarah Mufakat (Sama Rata)",
    desc: "Seluruh anak menerima bagian sama besar sesuai kesepakatan keluarga.",
  },
];

const HUBUNGAN_OPTIONS = [
  "Suami", "Istri",
  "Anak Laki-laki", "Anak Perempuan",
];

const formatIDR = (val: number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val || 0);
};

export default function AdatJawaPage() {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [namaPewaris, setNamaPewaris] = useState("");
  const [totalHarta, setTotalHarta] = useState("");
  const [hutang, setHutang] = useState("");
  const [wasiat, setWasiat] = useState("");
  const [metodeAdat, setMetodeAdat] = useState<"SEPIKUL_SEGENDONGAN" | "KUM_KUM_KUPAT">("SEPIKUL_SEGENDONGAN");
  const [potongGonoGini, setPotongGonoGini] = useState(true);

  const [ahliWaris, setAhliWaris] = useState<{ nama: string; hubungan: string }[]>([]);

  const parseNum = (val: string) => parseInt(val.replace(/\D/g, "")) || 0;

  const addHeir = () => setAhliWaris([...ahliWaris, { nama: "", hubungan: "Anak Laki-laki" }]);
  const removeHeir = (idx: number) => setAhliWaris(ahliWaris.filter((_, i) => i !== idx));
  const updateHeir = (idx: number, field: string, value: string) => {
    const arr = [...ahliWaris];
    arr[idx] = { ...arr[idx], [field]: value };
    setAhliWaris(arr);
  };

  const hartaKotorVal = parseNum(totalHarta);
  const hutangVal = parseNum(hutang);
  const wasiatVal = parseNum(wasiat);

  const hasil = useMemo(() => {
    const jenazah = { hartaKotor: hartaKotorVal, utang: hutangVal, wasiat: wasiatVal, potongGonoGini };
    const list = ahliWaris.map((h, i) => ({ id: `h_${i}`, nama: h.nama || h.hubungan, hubungan: h.hubungan, statusHidup: true }));
    const res = calculateAdatJawa(jenazah, list, metodeAdat);
    const net = Math.max(0, hartaKotorVal - hutangVal - wasiatVal);
    return {
      hartaBersih: net,
      statusAulRadd: metodeAdat === "SEPIKUL_SEGENDONGAN" ? "Sepikul Segendongan (2:1)" : "Kum-Kum Kupat (Musyawarah)",
      ahliWarisGetted: ((res as any).results || res).map((r: any) => ({
        ahliWarisId: r.ahliWarisId,
        nama: r.nama,
        hubungan: r.hubungan,
        status: r.status,
        alasan: r.alasan,
        jatahPersen: r.jatahPersen,
        jatahNominal: r.jatahNominal,
      })),
    };
  }, [hartaKotorVal, hutangVal, wasiatVal, potongGonoGini, metodeAdat, ahliWaris]);

  const exportPDF = () => {
    const doc = new jsPDF();
    const dateStr = new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' });

    doc.setFontSize(18);
    doc.text("LAPORAN PEMBAGIAN WARIS ADAT JAWA", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Platform E-MAWARIST — ${dateStr}`, 105, 26, { align: "center" });
    doc.line(20, 30, 190, 30);

    doc.setFontSize(11);
    doc.text(`Nama Pewaris: ${namaPewaris || "Almarhum / Almarhumah"}`, 20, 40);
    doc.text(`Metode Adat: ${metodeAdat === "SEPIKUL_SEGENDONGAN" ? "Sepikul Segendongan (2:1)" : "Kum-Kum Kupat"}`, 20, 46);
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
      headStyles: { fillColor: [217, 119, 6], textColor: [255, 255, 255] },
      styles: { fontSize: 8 }
    });

    doc.save(`laporan-waris-adat-jawa-${namaPewaris || "simulasi"}.pdf`);
  };

  return (
    <div className="min-h-screen bg-[oklch(0.985_0.004_247)] text-[oklch(0.21_0.03_258)] font-sans antialiased">
      
      {/* PAGE HERO WITH EXACT WARIS-WISE STYLE */}
      <section className="hero-aurora border-b border-[oklch(0.9_0.012_250)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <ScrollReveal className="max-w-3xl space-y-3">
            <span className="inline-block rounded-full border border-[oklch(0.4_0.093_158/0.3)] bg-[oklch(0.4_0.093_158/0.1)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[oklch(0.4_0.093_158)]">
              Hukum Adat Jawa
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-slate-900">Kalkulator Waris Adat Jawa</h1>
            <p className="text-lg leading-relaxed text-[oklch(0.53_0.03_255)]">
              Hukum adat Jawa mengedepankan asas kepatutan, kerukunan, dan musyawarah keluarga. Pembagian dapat mengikuti prinsip sepikul segendongan maupun kesepakatan bersama.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 space-y-8">
        
        {/* AUDIO EXPLANATION WIDGET */}
        <ScrollReveal>
          <AudioExplanation
            title="Sistem Pembagian Waris Adat Jawa (Sepikul Segendongan & Gono-Gini)"
            badge="Voice Assistant Adat Jawa"
            text="Hukum Waris Adat Jawa mengutamakan musyawarah mufakat dan kerukunan keluarga. Sebelum warisan dibagikan, dilakukan pemotongan harta bersama atau gono-gini sebesar 50 persen untuk pasangan. Pembagian kepada anak dapat menggunakan rasio Sepikul Segendongan yaitu 2 berbanding 1 atau dibagi sama rata secara damai."
          />
        </ScrollReveal>

        {/* PRINSIP GRID */}
        <div className="grid gap-6 md:grid-cols-2">
          <ScrollReveal>
            <div className="lift rounded-3xl border border-[oklch(0.9_0.012_250)] bg-white p-7 shadow-2xs space-y-2 h-full">
              <h2 className="text-xl font-bold text-slate-900 font-sans">Prinsip "Sepikul Segendongan"</h2>
              <p className="text-sm leading-relaxed text-[oklch(0.53_0.03_255)]">
                Istilah ini berasal dari kebiasaan memikul (sepikul) dua keranjang oleh laki-laki dan
                menggendong (segendongan) satu keranjang oleh perempuan. Karena itu perbandingan bagian anak
                laki-laki dan anak perempuan adalah 2:1.
              </p>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <div className="lift rounded-3xl border border-[oklch(0.9_0.012_250)] bg-white p-7 shadow-2xs space-y-2 h-full">
              <h2 className="text-xl font-bold text-slate-900 font-sans">Asas Kepatutan & Musyawarah</h2>
              <p className="text-sm leading-relaxed text-[oklch(0.53_0.03_255)]">
                Pembagian waris adat diutamakan melalui musyawarah keluarga demi menjaga kerukunan. Janda atau
                duda berhak atas pemisahan harta bersama (gono-gini) terlebih dahulu.
              </p>
            </div>
          </ScrollReveal>
        </div>

        {/* WIZARD CONTAINER */}
        <ScrollReveal className="rounded-3xl border border-[oklch(0.9_0.012_250)] bg-white p-6 sm:p-8 shadow-2xs space-y-8">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-6">
            <div className="flex items-center gap-2">
              {[
                { idx: 0, label: "1. Data Harta" },
                { idx: 1, label: "2. Ahli Waris & Metode" },
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
                setTotalHarta("");
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
                  placeholder="Contoh: Bpk. Mangkunegara"
                  value={namaPewaris}
                  onChange={(e) => setNamaPewaris(e.target.value)}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="text-xs font-medium text-slate-800 block mb-1.5">Total Harta Peninggalan</label>
                  <input
                    type="text"
                    className="w-full h-11 rounded-xl border border-[oklch(0.9_0.012_250)] px-4 text-sm font-mono font-bold focus:ring-2 focus:ring-[oklch(0.4_0.093_158/0.2)] focus:border-[oklch(0.4_0.093_158)]"
                    placeholder="Rp 0"
                    value={totalHarta ? Number(totalHarta.replace(/\D/g, "")).toLocaleString("id-ID") : ""}
                    onChange={(e) => setTotalHarta(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-800 block mb-1.5">Hutang Pewaris</label>
                  <input
                    type="text"
                    className="w-full h-11 rounded-xl border border-[oklch(0.9_0.012_250)] px-4 text-sm font-mono focus:ring-2 focus:ring-[oklch(0.4_0.093_158/0.2)] focus:border-[oklch(0.4_0.093_158)]"
                    placeholder="Rp 0"
                    value={hutang ? Number(hutang.replace(/\D/g, "")).toLocaleString("id-ID") : ""}
                    onChange={(e) => setHutang(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-800 block mb-1.5">Wasiat</label>
                  <input
                    type="text"
                    className="w-full h-11 rounded-xl border border-[oklch(0.9_0.012_250)] px-4 text-sm font-mono focus:ring-2 focus:ring-[oklch(0.4_0.093_158/0.2)] focus:border-[oklch(0.4_0.093_158)]"
                    placeholder="Rp 0"
                    value={wasiat ? Number(wasiat.replace(/\D/g, "")).toLocaleString("id-ID") : ""}
                    onChange={(e) => setWasiat(e.target.value)}
                  />
                </div>
              </div>

              <div className="rounded-2xl bg-[oklch(0.4_0.093_158/0.1)] border border-[oklch(0.4_0.093_158/0.2)] p-5">
                <p className="text-xs font-medium uppercase tracking-wider text-[oklch(0.53_0.03_255)]">Harta Bersih Siap Dibagi</p>
                <p className="text-2xl font-extrabold text-[oklch(0.4_0.093_158)] font-mono mt-1">
                  {formatIDR(Math.max(0, hartaKotorVal - hutangVal - wasiatVal))}
                </p>
              </div>
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="mb-3 text-xs font-mono font-bold uppercase tracking-wider text-[oklch(0.53_0.03_255)]">
                  Metode Pembagian
                </h3>
                <div className="grid gap-3 md:grid-cols-2">
                  {METODE.map((m) => (
                    <label
                      key={m.value}
                      onClick={() => setMetodeAdat(m.value)}
                      className={`flex cursor-pointer flex-col gap-2 rounded-2xl border p-4 transition-all shadow-2xs ${
                        metodeAdat === m.value
                          ? "border-[oklch(0.4_0.093_158)] bg-[oklch(0.4_0.093_158/0.05)] ring-2 ring-[oklch(0.4_0.093_158/0.2)]"
                          : "border-slate-200 bg-white hover:border-emerald-300"
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <input 
                          type="radio" 
                          name="metode" 
                          checked={metodeAdat === m.value} 
                          onChange={() => setMetodeAdat(m.value)} 
                          className="accent-[oklch(0.4_0.093_158)]"
                        />
                        <span className="text-sm font-bold text-slate-900">{m.judul}</span>
                      </span>
                      <span className="text-xs leading-relaxed text-[oklch(0.53_0.03_255)]">
                        {m.desc}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2.5 p-4 rounded-2xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={potongGonoGini} 
                    onChange={(e) => setPotongGonoGini(e.target.checked)} 
                    className="rounded text-[oklch(0.4_0.093_158)] focus:ring-[oklch(0.4_0.093_158)] cursor-pointer"
                  />
                  <span>Potong Gono-Gini (50% untuk Suami/Istri sebelum sisa harta dibagi kepada anak)</span>
                </label>
              </div>

              <div className="space-y-4">
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
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="p-4 rounded-2xl border border-[oklch(0.9_0.012_250)] bg-white">
                  <p className="text-xs font-medium uppercase tracking-wider text-[oklch(0.53_0.03_255)]">Dasar Hukum</p>
                  <p className="text-lg font-extrabold text-slate-900 mt-1">Hukum Adat Jawa</p>
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
                onClick={() => setStep((s) => (s + 1) as any)}
                className="px-6 py-3 bg-[oklch(0.4_0.093_158)] hover:bg-[oklch(0.35_0.09_158)] text-white text-xs font-semibold rounded-full flex items-center gap-1.5 shadow-md cursor-pointer"
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
