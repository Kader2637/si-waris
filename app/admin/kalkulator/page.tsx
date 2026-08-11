"use client";

import { useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { calculateFaraid } from "@/lib/faraidLogic";
import { calculateAdatJawa } from "@/lib/jawaLogic";
import { calculatePerdata } from "@/lib/perdataLogic";
import { Calculator, Edit3, Plus, Trash2, FileDown, Sliders, Users, PieChart } from "lucide-react";

const HUBUNGAN_OPTIONS = [
  "Suami", "Istri",
  "Anak Laki-laki", "Anak Perempuan",
  "Cucu Laki-laki", "Cucu Perempuan",
  "Ayah", "Ibu", "Kakek", "Nenek",
  "Saudara Laki-laki Sekandung", "Saudara Perempuan Sekandung",
  "Saudara Laki-laki Seibu", "Saudara Perempuan Seibu",
];

const formatIDR = (val: string) => {
  const n = val.replace(/\D/g, "");
  return n ? new Intl.NumberFormat("id-ID").format(parseInt(n)) : "";
};

const parseNum = (v: string) => parseInt(v.replace(/\D/g, "")) || 0;

export default function AdminKalkulatorPage() {
  const [namaJenazah, setNamaJenazah] = useState("");
  const [harta, setHarta] = useState("");
  const [utang, setUtang] = useState("");
  const [wasiat, setWasiat] = useState("");
  const [gender, setGender] = useState("Laki-laki");
  const [ahliWaris, setAhliWaris] = useState<{ nama: string; hubungan: string }[]>([]);
  const [hasil, setHasil] = useState<any>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [hukum, setHukum] = useState<string>("Islam");
  const [metodeAdat, setMetodeAdat] = useState<"SEPIKUL_SEGENDONGAN" | "KUM_KUM_KUPAT">("SEPIKUL_SEGENDONGAN");
  const [potongGonoGini, setPotongGonoGini] = useState(false);

  const addHeir = () => setAhliWaris([...ahliWaris, { nama: "", hubungan: "Anak Laki-laki" }]);
  const removeHeir = (i: number) => setAhliWaris(ahliWaris.filter((_, idx) => idx !== i));
  const updateHeir = (i: number, field: string, value: string) => {
    const arr = [...ahliWaris];
    arr[i] = { ...arr[i], [field]: value };
    setAhliWaris(arr);
  };

  const handleHitung = () => {
    const jenazah = { id: "temp", gender, hartaKotor: parseNum(harta), utang: parseNum(utang), wasiat: parseNum(wasiat), potongGonoGini };
    const warisList = ahliWaris.map((h, i) => ({ id: `heir-${i}`, nama: h.nama || h.hubungan, hubungan: h.hubungan, statusHidup: true }));

    if (hukum === "Jawa") {
      const result = calculateAdatJawa(jenazah, warisList, metodeAdat);
      setHasil({
        ...result,
        ahliWarisGetted: result.results,
        kpk: null,
        statusAulRadd: metodeAdat === "SEPIKUL_SEGENDONGAN" ? "Sepikul Segendongan" : "Kum-Kum Kupat"
      });
    } else if (hukum === "Perdata") {
      const result = calculatePerdata(jenazah, warisList);
      setHasil({
        ...result,
        ahliWarisGetted: result.ahliWarisGetted,
        kpk: null,
        statusAulRadd: "KUHPerdata (BW)"
      });
    } else {
      setHasil(calculateFaraid(jenazah as any, warisList as any));
    }
    setStep(2);
  };

  const downloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(20);
    doc.text("LAPORAN PEMBAGIAN WARIS ADMIN", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.text("E-Mawarist Engine Simulation", 105, 27, { align: "center" });
    doc.line(20, 32, 190, 32);

    doc.setFontSize(11);
    doc.text(`Nama Pewaris: ${namaJenazah || "-"}`, 20, 42);
    doc.text(`Jenis Kelamin: ${gender}`, 20, 48);
    doc.text(`Dasar Hukum: ${hukum === "Islam" ? "Syariat Islam (Faraid)" : hukum === "Perdata" ? "Hukum Perdata (BW)" : "Adat Jawa"}`, 20, 54);

    doc.text(`Harta Bersih: Rp ${hasil.hartaBersih.toLocaleString("id-ID")}`, 120, 42);

    autoTable(doc, {
      startY: 65,
      head: [['NO', 'AHLI WARIS', 'STATUS', 'PORSI', 'NOMINAL (IDR)', 'ALASAN HUKUM']],
      body: hasil.ahliWarisGetted.map((h: any, i: number) => [
        i + 1,
        `${h.nama || "-"}\n(${h.hubungan})`,
        h.status,
        h.jatahPersen,
        `Rp ${h.jatahNominal.toLocaleString("id-ID")}`,
        h.alasan
      ]),
      headStyles: { fillColor: [11, 98, 69], textColor: [255, 255, 255] },
      styles: { fontSize: 8 }
    });

    doc.save(`kalkulasi-admin-${namaJenazah || "kasus"}.pdf`);
  };

  const hartaBersih = parseNum(harta) - parseNum(utang) - parseNum(wasiat);

  return (
    <div className="space-y-6 text-[#0f172a] font-sans">

      {/* Header Title */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Kalkulator Cepat Admin</h1>
          <p className="text-slate-500 text-xs mt-1">Pengujian kalkulasi waris cepat tanpa perlu menyimpan data ke database.</p>
        </div>
        {step === 2 && (
          <button
            className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-all cursor-pointer"
            onClick={() => setStep(1)}
          >
            <Edit3 className="size-4" /> Edit Parameter
          </button>
        )}
      </div>

      {step === 1 ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <Sliders className="size-5 text-[#0b6245]" /> Parameter Perhitungan Cepat
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-600">Pilih Sistem Hukum</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${hukum === "Islam" ? "bg-[#0b6245] text-white border-[#0b6245]" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    onClick={() => setHukum("Islam")}
                  >
                    Faraid Islam
                  </button>
                  <button
                    type="button"
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${hukum === "Jawa" ? "bg-[#ca9a28] text-white border-[#ca9a28]" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    onClick={() => setHukum("Jawa")}
                  >
                    Hukum Adat Jawa
                  </button>
                  <button
                    type="button"
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${hukum === "Perdata" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    onClick={() => setHukum("Perdata")}
                  >
                    Hukum Perdata (BW)
                  </button>
                </div>
              </div>

              {hukum === "Jawa" && (
                <div className="p-4 bg-amber-50 rounded-xl border border-amber-200/80 space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-amber-900">Metode Adat Jawa</label>
                    <select
                      className="w-full bg-white border border-amber-300 rounded-lg px-3 py-1.5 text-xs text-slate-800 focus:outline-none"
                      value={metodeAdat}
                      onChange={(e) => setMetodeAdat(e.target.value as any)}
                    >
                      <option value="SEPIKUL_SEGENDONGAN">Sepikul Segendongan (2:1)</option>
                      <option value="KUM_KUM_KUPAT">Dum-Duman (1:1 Sama Rata)</option>
                    </select>
                  </div>
                  <label className="flex items-center gap-2 text-xs font-medium text-amber-900 cursor-pointer">
                    <input
                      type="checkbox"
                      className="rounded text-[#0b6245]"
                      checked={potongGonoGini}
                      onChange={(e) => setPotongGonoGini(e.target.checked)}
                    />
                    Potong Gono-Gini 50% untuk Pasangan
                  </label>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Nama Pewaris (Opsional)</label>
                  <input
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                    placeholder="Contoh: Almarhum Budi"
                    value={namaJenazah}
                    onChange={(e) => setNamaJenazah(e.target.value)}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Jenis Kelamin</label>
                  <select
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Harta Kotor (Rp)</label>
                  <input
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-[#0b6245] placeholder-slate-400 focus:outline-none"
                    value={harta}
                    onChange={(e) => setHarta(formatIDR(e.target.value))}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Utang (Rp)</label>
                  <input
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                    value={utang}
                    onChange={(e) => setUtang(formatIDR(e.target.value))}
                    placeholder="0"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-slate-600">Wasiat (Rp)</label>
                  <input
                    type="text"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                    value={wasiat}
                    onChange={(e) => setWasiat(formatIDR(e.target.value))}
                    placeholder="0"
                  />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                  <Users className="size-5 text-[#0b6245]" /> Silsilah Ahli Waris ({ahliWaris.length})
                </div>
                <button
                  type="button"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#e6f4ee] text-[#0b6245] text-xs font-semibold rounded-xl hover:bg-[#0b6245] hover:text-white transition-colors cursor-pointer"
                  onClick={addHeir}
                >
                  <Plus className="size-3.5" /> Tambah Ahli Waris
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-100">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 text-slate-500 font-semibold text-[11px]">
                    <tr>
                      <th className="px-3 py-3 text-center">No</th>
                      <th className="px-3 py-3">Nama</th>
                      <th className="px-3 py-3">Hubungan Keluarga</th>
                      <th className="px-3 py-3 text-center">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {ahliWaris.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-4 py-8 text-center text-slate-400">
                          Belum ada ahli waris. Klik Tambah Ahli Waris.
                        </td>
                      </tr>
                    ) : (
                      ahliWaris.map((h, i) => (
                        <tr key={i}>
                          <td className="px-3 py-3 text-center font-mono font-semibold text-slate-400">{i + 1}</td>
                          <td className="px-3 py-3">
                            <input
                              type="text"
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
                              placeholder="Nama..."
                              value={h.nama}
                              onChange={(e) => updateHeir(i, "nama", e.target.value)}
                            />
                          </td>
                          <td className="px-3 py-3">
                            <select
                              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
                              value={h.hubungan}
                              onChange={(e) => updateHeir(i, "hubungan", e.target.value)}
                            >
                              {HUBUNGAN_OPTIONS.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                            </select>
                          </td>
                          <td className="px-3 py-3 text-center">
                            <button
                              type="button"
                              className="size-7 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white flex items-center justify-center transition-colors mx-auto cursor-pointer"
                              onClick={() => removeHeir(i)}
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <PieChart className="size-5 text-[#0b6245]" /> Ringkasan Parameter
              </div>

              <div className="p-4 bg-[#e6f4ee] rounded-xl border border-emerald-200/60 space-y-1">
                <div className="text-xs text-slate-500 font-medium">Estimasi Harta Bersih:</div>
                <strong className="text-xl font-extrabold text-[#0b6245]">
                  Rp {Math.max(0, hartaBersih).toLocaleString("id-ID")}
                </strong>
              </div>

              <button
                type="button"
                className="w-full py-3 px-4 bg-[#0b6245] hover:bg-[#084b34] text-white text-xs font-semibold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50 inline-flex items-center justify-center gap-2"
                disabled={!harta || ahliWaris.length === 0}
                onClick={handleHitung}
              >
                <Calculator className="size-4" /> Hitung Hasil Now
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#e6f4ee] text-[#0b6245]">
                STATUS: {hasil.statusAulRadd}
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-1">Hasil Kalkulasi Cepat</h2>
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold rounded-xl shadow-xs transition-colors cursor-pointer"
              onClick={downloadPDF}
            >
              <FileDown className="size-4" /> Cetak PDF
            </button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-100">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 font-semibold text-[11px]">
                <tr>
                  <th className="px-4 py-3">No</th>
                  <th className="px-4 py-3">Ahli Waris</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Porsi</th>
                  <th className="px-4 py-3">Nominal Rupiah</th>
                  <th className="px-4 py-3">Alasan Hukum / KHI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {hasil.ahliWarisGetted.map((h: any, i: number) => (
                  <tr key={i} className={h.status === "Terhijab" ? "bg-rose-50/40 text-slate-500" : "hover:bg-slate-50/80"}>
                    <td className="px-4 py-3.5 font-bold">{i + 1}</td>
                    <td className="px-4 py-3.5 font-semibold text-slate-900">{h.nama || "-"} ({h.hubungan})</td>
                    <td className="px-4 py-3.5">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${h.status === "Mewarisi" ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                        }`}>
                        {h.status}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="px-2 py-0.5 rounded-md border border-slate-200 bg-white font-mono text-[11px] font-bold">
                        {h.jatahPersen}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 font-bold text-[#0b6245]">
                      Rp {h.jatahNominal.toLocaleString("id-ID")}
                    </td>
                    <td className="px-4 py-3.5 text-slate-500">{h.alasan}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
