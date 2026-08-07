"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getArsipList } from "@/app/actions/waris";
import { Search, FolderSymlink, FileText } from "lucide-react";

export default function ArsipPage() {
  const [arsip, setArsip] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterHukum, setFilterHukum] = useState("Semua");

  useEffect(() => {
    const fetchArsip = async () => {
      const data = await getArsipList();
      setArsip(data);
      setLoading(false);
    };
    fetchArsip();
  }, []);

  const filteredArsip = arsip.filter(item => {
    const matchSearch = search === "" || 
      item.nama?.toLowerCase().includes(search.toLowerCase()) || 
      item.nik?.toLowerCase().includes(search.toLowerCase());
    const matchHukum = filterHukum === "Semua" || item.hukum === filterHukum;
    return matchSearch && matchHukum;
  });

  return (
    <div className="space-y-6 text-[#0f172a] font-sans">
      
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Arsip Digital Perhitungan</h1>
          <p className="text-slate-500 text-xs mt-1">Riwayat laporan waris yang telah difinalisasi di database.</p>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-80 flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3.5 py-2 focus-within:ring-2 focus-within:ring-[#0b6245]/20 focus-within:border-[#0b6245] transition-all">
          <Search className="size-4 text-slate-400 me-2.5 shrink-0" />
          <input
            type="text"
            className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
            placeholder="Cari nama atau NIK..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-50 p-1 border border-slate-200 rounded-xl w-full md:w-auto overflow-x-auto">
          {["Semua", "Islam", "Jawa", "Perdata"].map(h => (
            <button
              key={h}
              className={`px-3.5 py-1.5 text-xs font-medium rounded-lg transition-all whitespace-nowrap ${
                filterHukum === h 
                  ? "bg-[#0b6245] text-white shadow-xs font-semibold" 
                  : "text-slate-600 hover:text-slate-900 hover:bg-white"
              }`}
              onClick={() => setFilterHukum(h)}
            >
              {h === "Jawa" ? "Adat Jawa" : h}
            </button>
          ))}
        </div>
      </div>

      {/* Cards Grid */}
      <div className="scroll-reveal grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center py-12 text-slate-400 text-xs font-medium font-mono">
            <span className="inline-block size-5 border-2 border-[#0b6245] border-t-transparent rounded-full animate-spin me-2" />
            Memuat arsip digital...
          </div>
        ) : filteredArsip.length > 0 ? (
          filteredArsip.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4">
              <div>
                <div className="flex justify-between items-center mb-3">
                  <span className="px-2.5 py-1 bg-[#e6f4ee] text-[#0b6245] text-[11px] font-semibold rounded-full">
                    {item.hukum}
                  </span>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-mono rounded-md">
                    {item.hukum === "Jawa" ? (item.logKalkulasi?.metodeAdat?.replace(/_/g, ' ') || 'Menunggu') : (item.logKalkulasi?.statusAulRadd || 'Normal')}
                  </span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mb-1">{item.nama}</h3>
                <p className="text-xs text-slate-400 font-mono">NIK: {item.nik || "-"}</p>
              </div>

              <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200/60 text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-slate-500">Harta Bersih:</span>
                  <strong className="text-[#0b6245] font-semibold">Rp {item.logKalkulasi?.totalHartaBersih?.toLocaleString('id-ID')}</strong>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Ahli Waris:</span>
                  <strong className="text-slate-800">{item.ahliWaris?.length || 0} Orang</strong>
                </div>
              </div>

              <Link 
                href={`/admin/keluarga/${item.id}`} 
                className="w-full inline-flex items-center justify-center gap-2 py-2 px-4 bg-[#0b6245] hover:bg-[#084b34] text-white text-xs font-semibold rounded-xl transition-all no-underline shadow-xs"
              >
                <FileText className="size-4" /> Buka Laporan Lengkap
              </Link>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-white rounded-2xl border border-slate-200 text-slate-400 text-xs">
            Belum ada arsip perhitungan yang tersimpan.
          </div>
        )}
      </div>

    </div>
  );
}
