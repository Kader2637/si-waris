"use client";

import { useMemo, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ScrollReveal from "@/components/ScrollReveal";
import AudioExplanation from "@/components/AudioExplanation";
import { ArrowLeft, ArrowRight, Download, RotateCcw } from "lucide-react";
import { calculateFaraid } from "@/lib/faraidLogic";
import { calculateAdatJawa } from "@/lib/jawaLogic";
import { calculatePerdata } from "@/lib/perdataLogic";

const HUBUNGAN_OPTIONS = [
  "Suami", "Istri",
  "Anak Laki-laki", "Anak Perempuan",
  "Cucu Laki-laki", "Cucu Perempuan",
  "Ayah", "Ibu", "Kakek", "Nenek",
  "Saudara Laki-laki Sekandung", "Saudara Perempuan Sekandung",
  "Saudara Laki-laki Seibu", "Saudara Perempuan Seibu",
];

const formatIDR = (val: number) => {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(val || 0);
};

export default function PublicKalkulatorPage() {
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [namaPewaris, setNamaPewaris] = useState("");
  const [gender, setGender] = useState("Laki-laki");
  const [totalHarta, setTotalHarta] = useState("");
  const [hutang, setHutang] = useState("");
  const [wasiat, setWasiat] = useState("");

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
    doc.text(`Platform E-Mawarist — ${dateStr}`, 105, 26, { align: "center" });
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
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold ${step === s.idx
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
                  <label className="text-xs font-medium text-slate-800 block mb-1.5">Jenis Kelamin Pewaris</label>
                  <select
                    className="w-full h-11 rounded-xl border border-[oklch(0.9_0.012_250)] px-4 text-sm font-medium focus:ring-2 focus:ring-[oklch(0.4_0.093_158/0.2)] focus:border-[oklch(0.4_0.093_158)]"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
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
