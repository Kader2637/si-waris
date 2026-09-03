"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createKeluarga } from "@/app/actions/waris";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/ConfirmModal";
import Select2 from "@/components/Select2";
import { HUBUNGAN_OPTIONS, GENDER_OPTIONS, METODE_ADAT_OPTIONS, STATUS_HIDUP_OPTIONS } from "@/lib/constants";
import { ArrowLeft, UserPlus, Users, Wallet, Plus, Trash2 } from "lucide-react";

export default function TambahKeluargaPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [harta, setHarta] = useState("");
  const [utang, setUtang] = useState("");
  const [wasiat, setWasiat] = useState("");
  const [hukum, setHukum] = useState<string>("Islam");
  const [potongGonoGini, setPotongGonoGini] = useState(false);
  const [metodeAdat, setMetodeAdat] = useState("SEPIKUL_SEGENDONGAN");
  const [removeIndex, setRemoveIndex] = useState<number | null>(null);

  const [jenazah, setJenazah] = useState({
    nama: "",
    nik: "",
    gender: "Laki-laki",
    keterangan: "",
    tanggalWafat: new Date().toISOString().split('T')[0],
  });

  const [ahliWaris, setAhliWaris] = useState<any[]>([]);

  const formatIDR = (val: string) => {
    const number = val.replace(/\D/g, "");
    return number ? new Intl.NumberFormat("id-ID").format(parseInt(number)) : "";
  };

  const parseNumber = (formatted: string) => {
    return parseInt(formatted.replace(/\D/g, "")) || 0;
  };

  const handleAddAhliWaris = () => {
    setAhliWaris([...ahliWaris, { 
      id: Math.random().toString(36).substring(7),
      nama: "", 
      nik: "", 
      hubungan: "Anak Laki-laki", 
      statusHidup: true,
      parentId: "",
      file: null, 
      fileName: "" 
    }]);
  };

  const confirmRemoveHeir = () => {
    if (removeIndex === null) return;
    setAhliWaris(ahliWaris.filter((_, i) => i !== removeIndex));
    setRemoveIndex(null);
    toast.success("Anggota keluarga dihapus");
  };

  const updateAhliWaris = (idx: number, field: string, value: any) => {
    const newArr = [...ahliWaris];
    newArr[idx] = { ...newArr[idx], [field]: value };
    setAhliWaris(newArr);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!jenazah.nama) {
      toast.error("Nama almarhum wajib diisi");
      return;
    }
    if (ahliWaris.length === 0) {
      toast.error("Minimal harus ada 1 ahli waris");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("nama", jenazah.nama);
    formData.append("nik", jenazah.nik);
    formData.append("gender", jenazah.gender);
    formData.append("keterangan", jenazah.keterangan || "Ayah");
    formData.append("tanggalWafat", jenazah.tanggalWafat);
    formData.append("hartaKotor", parseNumber(harta).toString());
    formData.append("utang", parseNumber(utang).toString());
    formData.append("wasiat", parseNumber(wasiat).toString());
    formData.append("hukum", hukum);
    formData.append("potongGonoGini", potongGonoGini.toString());
    formData.append("metodeAdat", metodeAdat);

    const cleanedAhliWaris = ahliWaris.map(({ file, ...rest }) => rest);
    formData.append("ahliWarisJson", JSON.stringify(cleanedAhliWaris));

    ahliWaris.forEach((heir, idx) => {
      if (heir.file) {
        formData.append(`file_${idx}`, heir.file);
      }
    });

    const res = await createKeluarga(formData);
    if (res.success) {
      toast.success("Data keluarga berhasil disimpan!");
      router.push(`/admin/keluarga/${res.id}`);
    } else {
      toast.error(`Gagal: ${res.error}`);
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 text-[#0f172a] font-sans">
      <ConfirmModal 
        isOpen={removeIndex !== null}
        onClose={() => setRemoveIndex(null)}
        onConfirm={confirmRemoveHeir}
        title="Hapus Anggota?"
        message="Hapus anggota dari daftar perhitungan."
      />

      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Form Tambah Kasus Waris Baru</h1>
          <p className="text-slate-500 text-xs mt-1">Input identitas pewaris, parameter harta, dan silsilah keluarga.</p>
        </div>
        <Link 
          href="/admin/keluarga" 
          className="inline-flex items-center gap-1.5 px-4 py-2 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-all no-underline"
        >
          <ArrowLeft className="size-4" /> Kembali ke Tabel
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        <div className="lg:col-span-8 space-y-6">
          
          {/* Card 1: Identitas Pewaris */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <UserPlus className="size-5 text-[#0b6245]" /> Identitas Almarhum / Pewaris
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-600">Sistem Hukum Pembagian</label>
              <div className="grid grid-cols-3 gap-2">
                {["Islam", "Jawa", "Perdata"].map((h) => (
                  <button
                    key={h}
                    type="button"
                    className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all cursor-pointer ${
                      hukum === h
                        ? "bg-[#0b6245] text-white border-[#0b6245] shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                    }`}
                    onClick={() => setHukum(h)}
                  >
                    {h === "Islam" ? "Faraid Islam" : h === "Jawa" ? "Adat Jawa" : "Perdata"}
                  </button>
                ))}
              </div>
            </div>

            {hukum === "Jawa" && (
              <div className="p-4 bg-amber-50 rounded-xl border border-amber-200/80 space-y-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-amber-900 block mb-1">Metode Adat Jawa</label>
                  <Select2
                    options={METODE_ADAT_OPTIONS}
                    value={metodeAdat}
                    onChange={(val) => setMetodeAdat(val)}
                    placeholder="Pilih Metode Adat..."
                  />
                </div>
                <label className="flex items-center gap-2 text-xs font-medium text-amber-900 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="rounded text-[#0b6245]"
                    checked={potongGonoGini}
                    onChange={(e) => setPotongGonoGini(e.target.checked)}
                  />
                  Potong Harta Gono-Gini 50% untuk Pasangan
                </label>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Nama Lengkap Pewaris *</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0b6245]/20 focus:border-[#0b6245]"
                  placeholder="Nama almarhum..."
                  value={jenazah.nama}
                  onChange={(e) => setJenazah({...jenazah, nama: e.target.value})}
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">NIK (16 Digit)</label>
                <input 
                  type="text" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0b6245]/20 focus:border-[#0b6245]"
                  placeholder="3171..."
                  value={jenazah.nik}
                  onChange={(e) => setJenazah({...jenazah, nik: e.target.value})}
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 block mb-1">Jenis Kelamin</label>
                <Select2
                  options={GENDER_OPTIONS}
                  value={jenazah.gender}
                  onChange={(val) => setJenazah({...jenazah, gender: val})}
                  placeholder="Pilih Jenis Kelamin..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600">Tanggal Wafat</label>
                <input 
                  type="date" 
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 focus:outline-none"
                  value={jenazah.tanggalWafat}
                  onChange={(e) => setJenazah({...jenazah, tanggalWafat: e.target.value})}
                />
              </div>
            </div>
          </div>

          {/* Card 2: Ahli Waris Table */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
                <Users className="size-5 text-[#0b6245]" /> Silsilah Ahli Waris ({ahliWaris.length})
              </div>
              <button 
                type="button" 
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#e6f4ee] text-[#0b6245] text-xs font-semibold rounded-xl hover:bg-[#0b6245] hover:text-white transition-colors cursor-pointer"
                onClick={handleAddAhliWaris}
              >
                <Plus className="size-3.5" /> Tambah Anggota
              </button>
            </div>

            <div className="overflow-x-auto rounded-xl border border-slate-100">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-500 font-semibold text-[11px]">
                  <tr>
                    <th className="px-3 py-3 text-center">No</th>
                    <th className="px-3 py-3">Nama Ahli Waris</th>
                    <th className="px-3 py-3">Hubungan Keluarga</th>
                    <th className="px-3 py-3">Status</th>
                    <th className="px-3 py-3 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {ahliWaris.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-slate-400">
                        Belum ada anggota keluarga. Klik Tambah Anggota.
                      </td>
                    </tr>
                  ) : (
                    ahliWaris.map((heir, idx) => (
                      <tr key={heir.id}>
                        <td className="px-3 py-3 text-center font-mono font-semibold text-slate-400">{idx + 1}</td>
                        <td className="px-3 py-3">
                          <input 
                            type="text" 
                            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 focus:outline-none"
                            placeholder="Nama..."
                            value={heir.nama}
                            onChange={(e) => updateAhliWaris(idx, "nama", e.target.value)}
                          />
                        </td>
                        <td className="px-3 py-3 w-72 min-w-[240px]">
                          <Select2
                            options={HUBUNGAN_OPTIONS}
                            value={heir.hubungan}
                            onChange={(val) => updateAhliWaris(idx, "hubungan", val)}
                            placeholder="Pilih Hubungan..."
                            searchPlaceholder="Cari hubungan..."
                          />
                        </td>
                        <td className="px-3 py-3 w-48 min-w-[160px]">
                          <Select2
                            options={STATUS_HIDUP_OPTIONS}
                            value={heir.statusHidup ? "Hidup" : "Meninggal"}
                            onChange={(val) => updateAhliWaris(idx, "statusHidup", val === "Hidup")}
                            placeholder="Pilih Status..."
                          />
                        </td>
                        <td className="px-3 py-3 text-center">
                          <button 
                            type="button" 
                            className="size-7 rounded-lg bg-rose-50 hover:bg-rose-600 text-rose-600 hover:text-white flex items-center justify-center transition-colors mx-auto cursor-pointer"
                            onClick={() => setRemoveIndex(idx)}
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

        {/* Right Sidebar Parameter Harta */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-bold text-base">
              <Wallet className="size-5 text-[#0b6245]" /> Rincian Aset
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">Total Harta Kotor (Rp)</label>
              <input 
                type="text" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs font-bold text-[#0b6245] placeholder-slate-400 focus:outline-none"
                placeholder="0"
                value={harta}
                onChange={(e) => setHarta(formatIDR(e.target.value))}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">Total Utang & Tajhiz (Rp)</label>
              <input 
                type="text" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                placeholder="0"
                value={utang}
                onChange={(e) => setUtang(formatIDR(e.target.value))}
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600">Wasiat (Rp)</label>
              <input 
                type="text" 
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
                placeholder="0"
                value={wasiat}
                onChange={(e) => setWasiat(formatIDR(e.target.value))}
              />
            </div>

            <button 
              type="submit" 
              className="w-full py-3 px-4 bg-[#0b6245] hover:bg-[#084b34] text-white text-xs font-semibold rounded-xl shadow-md transition-all cursor-pointer disabled:opacity-50"
              disabled={loading || ahliWaris.length === 0}
            >
              {loading ? "Menyimpan..." : "Simpan & Kalkulasi Waris"}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
}
