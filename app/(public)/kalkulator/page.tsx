"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ScrollReveal from "@/components/ScrollReveal";
import AudioExplanation from "@/components/AudioExplanation";
import Select2 from "@/components/Select2";
import { ArrowLeft, ArrowRight, Download, RotateCcw, Calculator, Lock, Building2 } from "lucide-react";
import { calculateFaraid } from "@/lib/faraidLogic";
import { calculateAdatJawa } from "@/lib/jawaLogic";
import { calculatePerdata } from "@/lib/perdataLogic";

import { HUBUNGAN_OPTIONS } from "@/lib/constants";

const formatIDR = (val: number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val || 0);
};

export default function PublicKalkulatorPage() {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [namaPewaris, setNamaPewaris] = useState("");
  const [gender, setGender] = useState("Laki-laki");
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

  const syariahResult = useMemo(() => {
    const jenazah = { id: "temp", gender, hartaKotor: hartaKotorVal, utang: hutangVal, wasiat: wasiatVal };
    const list = ahliWaris.map((h, i) => ({ id: `h_${i}`, nama: h.nama || h.hubungan, hubungan: h.hubungan, statusHidup: true }));
    return calculateFaraid(jenazah as any, list as any);
  }, [hartaKotorVal, hutangVal, wasiatVal, gender, ahliWaris]);

  const perdataResult = useMemo(() => {
    const jenazah = { hartaKotor: hartaKotorVal, utang: hutangVal, wasiat: wasiatVal };
    const list = ahliWaris.map((h, i) => ({ id: `h_${i}`, nama: h.nama || h.hubungan, hubungan: h.hubungan, statusHidup: true }));
    return calculatePerdata(jenazah, list);
  }, [hartaKotorVal, hutangVal, wasiatVal, ahliWaris]);

  const adatResult = useMemo(() => {
    const jenazah = { hartaKotor: hartaKotorVal, utang: hutangVal, wasiat: wasiatVal, potongGonoGini: true };
    const list = ahliWaris.map((h, i) => ({ id: `h_${i}`, nama: h.nama || h.hubungan, hubungan: h.hubungan, statusHidup: true }));
    const res = calculateAdatJawa(jenazah, list, "SEPIKUL_SEGENDONGAN");
    const net = Math.max(0, hartaKotorVal - hutangVal - wasiatVal);
    return {
      hartaBersih: net,
      statusAulRadd: "Adat Jawa (Sepikul Segendongan)",
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
  }, [hartaKotorVal, hutangVal, wasiatVal, ahliWaris]);

  const exportPDF = (sistem: string, resData: any) => {
    const doc = new jsPDF();
    const dateStr = new Date().toLocaleDateString("id-ID", { day: 'numeric', month: 'long', year: 'numeric' });

    doc.setFontSize(18);
    doc.text(`LAPORAN PEMBAGIAN WARIS — ${sistem.toUpperCase()}`, 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Platform E-MAWARIST — ${dateStr}`, 105, 26, { align: "center" });
    doc.line(20, 30, 190, 30);

    doc.setFontSize(11);
    doc.text(`Nama Pewaris: ${namaPewaris || "Almarhum / Almarhumah"}`, 20, 40);
    doc.text(`Harta Bersih: ${formatIDR(resData.hartaBersih)}`, 120, 40);

    const activeList = resData.ahliWarisGetted.filter((h: any) => h.status === "Mewarisi");

    autoTable(doc, {
      startY: 55,
      head: [['NO', 'AHLI WARIS', 'STATUS', 'PORSI', 'NOMINAL (IDR)', 'KETERANGAN HUKUM']],
      body: activeList.map((h: any, i: number) => [
        i + 1,
        `${h.nama || "-"}\n(${h.hubungan})`,
        h.status,
        h.jatahPersen,
        formatIDR(h.jatahNominal),
        h.alasan
      ]),
      headStyles: { fillColor: [15, 81, 50], textColor: [255, 255, 255] },
      styles: { fontSize: 8 }
    });

    doc.save(`laporan-waris-${sistem.toLowerCase()}-${namaPewaris || "simulasi"}.pdf`);
  };

  return (
    <div className="min-h-screen bg-[oklch(0.985_0.004_247)] text-[oklch(0.21_0.03_258)] font-sans antialiased">
      
      {/* PAGE HERO */}
      <section className="hero-aurora border-b border-[oklch(0.9_0.012_250)]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-20">
          <ScrollReveal className="max-w-3xl space-y-3">
            <span className="inline-block rounded-full border border-[oklch(0.4_0.093_158/0.3)] bg-[oklch(0.4_0.093_158/0.1)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[oklch(0.4_0.093_158)]">
              Kalkulator Terpadu
            </span>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-slate-900">Bandingkan Tiga Sistem Hukum Sekaligus</h1>
            <p className="text-lg leading-relaxed text-[oklch(0.53_0.03_255)]">
              Masukkan data harta dan susunan keluarga satu kali, lalu lihat perbedaan hasil pembagian menurut Hukum Syariah, KUHPerdata, dan Adat Jawa secara bersandingan.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 space-y-8">
        
        {/* AUDIO EXPLANATION */}
        <ScrollReveal>
          <AudioExplanation
            title="Kalkulator Terpadu Komparasi 3 Sistem Hukum"
            badge="Voice Assistant Simulator"
            text="Fitur Kalkulator Terpadu memungkinkan Anda membandingkan hasil pembagian harta waris secara serentak antara hukum Syariah Faraidh, Kitab Undang-Undang Hukum Perdata, dan Hukum Adat Jawa dalam satu tampilan layar secara obyektif."
          />
        </ScrollReveal>

        {/* WIZARD CONTAINER */}
        <ScrollReveal className="rounded-3xl border border-[oklch(0.9_0.012_250)] bg-white p-6 sm:p-8 shadow-2xs space-y-8">
          
          <div className="flex items-center justify-between border-b border-slate-100 pb-6">
            <div className="flex items-center gap-2">
              {[
                { idx: 0, label: "1. Data Harta" },
                { idx: 1, label: "2. Ahli Waris" },
                { idx: 2, label: "3. Komparasi 3 Sistem" },
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
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-medium text-slate-800 block mb-1.5">Nama Pewaris / Almarhum</label>
                  <input
                    type="text"
                    className="w-full h-11 rounded-xl border border-[oklch(0.9_0.012_250)] px-4 text-sm font-medium focus:ring-2 focus:ring-[oklch(0.4_0.093_158/0.2)] focus:border-[oklch(0.4_0.093_158)]"
                    placeholder="Contoh: Bpk. H. Ahmad"
                    value={namaPewaris}
                    onChange={(e) => setNamaPewaris(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium text-slate-800 dark:text-slate-200 block mb-1.5">Jenis Kelamin Pewaris</label>
                  <Select2
                    options={[
                      { value: "Laki-laki", label: "Laki-laki" },
                      { value: "Perempuan", label: "Perempuan" },
                    ]}
                    value={gender}
                    onChange={setGender}
                    placeholder="Pilih Jenis Kelamin..."
                  />
                </div>
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
                  <label className="text-xs font-semibold text-slate-800 dark:text-slate-200 block mb-1.5">Wasiat Pewaris (Rp, Maks. 1/3)</label>
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
                <h3 className="text-sm font-bold text-slate-900">Pilih & Tambah Ahli Waris</h3>
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
                        <Select2
                          options={HUBUNGAN_OPTIONS}
                          value={h.hubungan}
                          onChange={(val) => updateHeir(i, "hubungan", val)}
                          placeholder="Pilih Hubungan..."
                          searchPlaceholder="Cari hubungan..."
                        />
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

          {/* STEP 2: KOMPARASI 3 SISTEM */}
          {step === 2 && (
            <div className="space-y-8">
              <div className="grid gap-6 lg:grid-cols-3">
                {[
                  { title: "1. Hukum Syariah (Faraidh)", color: "emerald", res: syariahResult, sistem: "syariah" },
                  { title: "2. Hukum Perdata (BW)", color: "blue", res: perdataResult, sistem: "perdata" },
                  { title: "3. Hukum Adat Jawa", color: "amber", res: adatResult, sistem: "adat-jawa" },
                ].map((s) => (
                  <div key={s.sistem} className="rounded-3xl border border-[oklch(0.9_0.012_250)] bg-white p-6 shadow-2xs flex flex-col justify-between space-y-4">
                    <div className="space-y-4">
                      <div className="border-b border-slate-100 pb-3">
                        <h4 className="text-base font-bold text-slate-900">{s.title}</h4>
                        <p className="text-xs font-mono font-semibold text-[oklch(0.4_0.093_158)] mt-0.5">
                          Harta Bersih: {formatIDR(s.res.hartaBersih)}
                        </p>
                      </div>

                      <div className="space-y-3">
                        {s.res.ahliWarisGetted.map((h: any, idx: number) => (
                          <div key={idx} className="p-3.5 rounded-2xl border border-slate-100 bg-slate-50 space-y-1">
                            <div className="flex items-center justify-between text-xs font-semibold">
                              <span className="text-slate-900">{h.nama}</span>
                              <span className="font-mono text-[oklch(0.4_0.093_158)] font-bold">{h.jatahPersen}</span>
                            </div>
                            <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                              <span>{h.status}</span>
                              <span className="font-bold text-slate-900">{formatIDR(h.jatahNominal)}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => exportPDF(s.sistem, s.res)}
                      className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold rounded-full flex items-center justify-center gap-2 transition-colors cursor-pointer"
                    >
                      <Download className="size-3.5" /> Unduh Laporan PDF
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ACTION NAVIGATION */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              disabled={step === 0}
              onClick={() => setStep((s) => (s - 1) as any)}
              className="px-4 py-2 text-xs font-semibold border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg disabled:opacity-40 flex items-center gap-1.5 cursor-pointer"
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
