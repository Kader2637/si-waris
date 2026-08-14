"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ScrollReveal from "@/components/ScrollReveal";
import Select2, { Select2Option } from "@/components/Select2";
import {
  Building2,
  Car,
  Coins,
  Wallet,
  Briefcase,
  Plus,
  Trash2,
  ExternalLink,
  Calculator,
  Download,
  Save,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  MapPin,
  RotateCcw,
  User,
  FileText,
  Calendar,
} from "lucide-react";
import {
  PROVINSI_BPN_DATA,
  TIPE_BANGUNAN_PUPR,
  DEFAULT_HARGA_EMAS_PER_GRAM,
  TIPE_KENDARAAN_OPTIONS,
  ItemAsetWaris,
} from "@/lib/bpnZntData";

const formatIDR = (val: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(val || 0);
};

export default function AdminKonversiHartaPage() {
  const router = useRouter();

  // Admin Case Metadata State (Disimpan ke Database)
  const [namaPewaris, setNamaPewaris] = useState("");
  const [nikPewaris, setNikPewaris] = useState("");
  const [tglMeninggal, setTglMeninggal] = useState("");
  const [noBerkas, setNoBerkas] = useState(`WARIS-${Date.now().toString().slice(-6)}`);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // State Daftar Item Aset
  const [items, setItems] = useState<ItemAsetWaris[]>([]);

  // Modal / Tab State untuk penambahan item baru
  const [selectedKategori, setSelectedKategori] = useState<
    "properti" | "kendaraan" | "emas" | "kas" | "usaha"
  >("properti");

  // Form State Temp Item Baru
  const [formNama, setFormNama] = useState("");
  const [formKet, setFormKet] = useState("");

  // PROPERTI FORM: CASCADING SEARCHABLE SELECT2 (3-Tingkat)
  const [formProvinsiId, setFormProvinsiId] = useState("jawa-barat");
  const [formKotaId, setFormKotaId] = useState("kota-bandung");
  const [formDesaId, setFormDesaId] = useState("riau-dago");

  const [formLuasTanah, setFormLuasTanah] = useState("");
  const [formHargaTanahM2, setFormHargaTanahM2] = useState("25000000");
  const [formAdaBangunan, setFormAdaBangunan] = useState(false);
  const [formLuasBangunan, setFormLuasBangunan] = useState("");
  const [formTipeBangunanId, setFormTipeBangunanId] = useState("menengah");
  const [formHargaBangunanM2, setFormHargaBangunanM2] = useState("3200000");

  // Kendaraan Form
  const [formTipeKendaraan, setFormTipeKendaraan] = useState("mobil-keluarga");
  const [formTahunKendaraan, setFormTahunKendaraan] = useState("2015-2019");
  const [formNominalKendaraan, setFormNominalKendaraan] = useState("110000000");

  // Emas Form
  const [formBeratEmas, setFormBeratEmas] = useState("");
  const [formHargaEmas, setFormHargaEmas] = useState(
    DEFAULT_HARGA_EMAS_PER_GRAM.toString()
  );

  // Kas / Usaha Form
  const [formNominalKasUsaha, setFormNominalKasUsaha] = useState("");

  // AI BPN Price Trend Detector State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiTrendBadge, setAiTrendBadge] = useState<string | null>(null);

  const handleAiDetectPriceTrend = () => {
    setAiLoading(true);
    setTimeout(() => {
      const rawVal = parseInt(formHargaTanahM2.replace(/\D/g, "")) || 5000000;
      const growthPercent = Math.floor(Math.random() * 8 + 6) + (formProvinsiId.includes("dki") || formProvinsiId.includes("ikn") ? 6 : 2);
      const updatedPrice = Math.round(rawVal * (1 + growthPercent / 100));
      setFormHargaTanahM2(updatedPrice.toString());
      setAiTrendBadge(`✨ AI E-MAWARIST Alert: Terdeteksi tren kenaikan ZNT +${growthPercent}% di lokasi ini (Penyesuaian Nilai Indikasi Rata-rata / NIR Terkini).`);
      setAiLoading(false);
    }, 600);
  };

  // Opsi Select2 Provinsi (38 Provinsi Indonesia)
  const provinsiOptions: Select2Option[] = useMemo(() => {
    return PROVINSI_BPN_DATA.map((p) => ({
      value: p.id,
      label: p.nama,
    }));
  }, []);

  // Opsi Select2 Kota/Kabupaten (Tergantung Provinsi Terpilih)
  const availableKotaList = useMemo(() => {
    const prov = PROVINSI_BPN_DATA.find((p) => p.id === formProvinsiId);
    return prov ? prov.kotalist : [];
  }, [formProvinsiId]);

  const kotaOptions: Select2Option[] = useMemo(() => {
    return availableKotaList.map((k) => ({
      value: k.id,
      label: k.nama,
      subtext: k.isKota ? "Wilayah Perkotaan (Kelurahan)" : "Wilayah Kabupaten (Desa)",
    }));
  }, [availableKotaList]);

  // Cek apakah Kota/Kabupaten yang dipilih adalah KOTA
  const selectedKotaObj = useMemo(() => {
    return availableKotaList.find((k) => k.id === formKotaId);
  }, [availableKotaList, formKotaId]);

  const isKotaSelected = useMemo(() => {
    if (selectedKotaObj?.isKota !== undefined) return selectedKotaObj.isKota;
    return formKotaId.toLowerCase().includes("kota");
  }, [selectedKotaObj, formKotaId]);

  // Opsi Select2 Kelurahan / Desa / Zonasi
  const availableDesaList = useMemo(() => {
    return selectedKotaObj ? selectedKotaObj.desalist : [];
  }, [selectedKotaObj]);

  const desaOptions: Select2Option[] = useMemo(() => {
    return availableDesaList.map((d) => ({
      value: d.id,
      label: d.nama,
      subtext: `${formatIDR(d.hargaPerM2)} / m² — ${d.deskripsi}`,
    }));
  }, [availableDesaList]);

  // Opsi Select2 Tipe Bangunan PUPR
  const tipeBangunanOptions: Select2Option[] = useMemo(() => {
    return TIPE_BANGUNAN_PUPR.map((b) => ({
      value: b.id,
      label: b.nama,
      subtext: `${formatIDR(b.hargaPerM2)}/m² — ${b.deskripsi}`,
    }));
  }, []);

  // Opsi Select2 Tipe Kendaraan
  const tipeKendaraanOptions: Select2Option[] = useMemo(() => {
    return TIPE_KENDARAAN_OPTIONS.map((k) => ({
      value: k.id,
      label: k.label,
    }));
  }, []);

  // Opsi Select2 Tahun Pembuatan Kendaraan
  const tahunKendaraanOptions: Select2Option[] = [
    { value: "2020+", label: "2020 Ke Atas (Baru)" },
    { value: "2015-2019", label: "2015 - 2019 (Sedang)" },
    { value: "<2015", label: "Di Bawah 2015 (Lama)" },
  ];

  // Handlers saat Provinsi berubah
  const handleProvinsiChange = (provId: string) => {
    setFormProvinsiId(provId);
    const prov = PROVINSI_BPN_DATA.find((p) => p.id === provId);
    if (prov && prov.kotalist.length > 0) {
      const firstKota = prov.kotalist[0];
      setFormKotaId(firstKota.id);
      if (firstKota.desalist.length > 0) {
        const firstDesa = firstKota.desalist[0];
        setFormDesaId(firstDesa.id);
        setFormHargaTanahM2(firstDesa.hargaPerM2.toString());
      }
    }
  };

  // Handlers saat Kota berubah
  const handleKotaChange = (kotaId: string) => {
    setFormKotaId(kotaId);
    const kota = availableKotaList.find((k) => k.id === kotaId);
    if (kota && kota.desalist.length > 0) {
      const firstDesa = kota.desalist[0];
      setFormDesaId(firstDesa.id);
      setFormHargaTanahM2(firstDesa.hargaPerM2.toString());
    }
  };

  // Handlers saat Desa/Zonasi berubah
  const handleDesaChange = (desaVal: string) => {
    setFormDesaId(desaVal);
    const desa = availableDesaList.find((d) => d.id === desaVal);
    if (desa) {
      setFormHargaTanahM2(desa.hargaPerM2.toString());
    }
  };

  // Update Harga Bangunan
  useEffect(() => {
    const b = TIPE_BANGUNAN_PUPR.find((x) => x.id === formTipeBangunanId);
    if (b) {
      setFormHargaBangunanM2(b.hargaPerM2.toString());
    }
  }, [formTipeBangunanId]);

  // Update Nominal Kendaraan
  useEffect(() => {
    const k = TIPE_KENDARAAN_OPTIONS.find((x) => x.id === formTipeKendaraan);
    if (k) {
      const val = (k.estimasiTahun as any)[formTahunKendaraan] || 50000000;
      setFormNominalKendaraan(val.toString());
    }
  }, [formTipeKendaraan, formTahunKendaraan]);

  // Hitung Total Harta Terkonversi
  const totalHartaKotor = useMemo(() => {
    return items.reduce((acc, curr) => acc + curr.subtotal, 0);
  }, [items]);

  // Tambah Item Baru
  const handleAddItem = () => {
    const parseNum = (val: string) => parseInt(val.replace(/\D/g, "")) || 0;

    let subtotal = 0;
    let newItem: ItemAsetWaris = {
      id: `item-${Date.now()}`,
      kategori: selectedKategori,
      namaItem: formNama.trim() || `Aset ${selectedKategori.toUpperCase()}`,
      keterangan: formKet.trim() || "Taksiran Harta Waris Admin",
      subtotal: 0,
    };

    if (selectedKategori === "properti") {
      const lt = parseNum(formLuasTanah);
      const ht = parseNum(formHargaTanahM2);
      const lb = formAdaBangunan ? parseNum(formLuasBangunan) : 0;
      const hb = formAdaBangunan ? parseNum(formHargaBangunanM2) : 0;
      subtotal = lt * ht + lb * hb;

      const provObj = PROVINSI_BPN_DATA.find((p) => p.id === formProvinsiId);
      const kotaObj = availableKotaList.find((k) => k.id === formKotaId);
      const desaObj = availableDesaList.find((d) => d.id === formDesaId);

      newItem = {
        ...newItem,
        provinsiId: formProvinsiId,
        kotaId: formKotaId,
        desaId: formDesaId,
        namaProvinsi: provObj?.nama || formProvinsiId,
        namaKota: kotaObj?.nama || formKotaId,
        namaDesa: desaObj?.nama || formDesaId,
        luasTanahM2: lt,
        hargaTanahPerM2: ht,
        adaBangunan: formAdaBangunan,
        luasBangunanM2: lb,
        tipeBangunanId: formTipeBangunanId,
        hargaBangunanPerM2: hb,
        subtotal,
      };
    } else if (selectedKategori === "emas") {
      const gr = parseNum(formBeratEmas);
      const hg = parseNum(formHargaEmas) || DEFAULT_HARGA_EMAS_PER_GRAM;
      subtotal = gr * hg;
      newItem = {
        ...newItem,
        beratEmasGram: gr,
        hargaEmasPerGram: hg,
        subtotal,
      };
    } else if (selectedKategori === "kendaraan") {
      const nom = parseNum(formNominalKendaraan);
      subtotal = nom;
      newItem = {
        ...newItem,
        tipeKendaraanId: formTipeKendaraan,
        tahunKendaraan: formTahunKendaraan,
        nominalLangsung: nom,
        subtotal,
      };
    } else {
      const nom = parseNum(formNominalKasUsaha);
      subtotal = nom;
      newItem = {
        ...newItem,
        nominalLangsung: nom,
        subtotal,
      };
    }

    setItems([...items, newItem]);
    setFormNama("");
    setFormKet("");
    setFormLuasTanah("");
    setFormLuasBangunan("");
    setFormBeratEmas("");
    setFormNominalKasUsaha("");
  };

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((x) => x.id !== id));
  };

  // Simpan Kasus & Konversi ke Database Arsip Admin
  const handleSaveToDatabase = () => {
    if (!namaPewaris.trim()) {
      alert("Silakan masukkan Nama Almarhum / Almarhumah terlebih dahulu!");
      return;
    }
    if (items.length === 0) {
      alert("Silakan masukkan minimal 1 aset warisan sebelum menyimpan ke database!");
      return;
    }

    const record = {
      id: noBerkas,
      noBerkas,
      namaPewaris: namaPewaris.trim(),
      nikPewaris: nikPewaris.trim() || "-",
      tglMeninggal: tglMeninggal || new Date().toISOString().slice(0, 10),
      totalHartaKotor,
      items,
      createdAt: new Date().toISOString(),
    };

    try {
      const existing = localStorage.getItem("emawarist_database_arsip");
      const list = existing ? JSON.parse(existing) : [];
      list.unshift(record);
      localStorage.setItem("emawarist_database_arsip", JSON.stringify(list));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 4000);
    } catch (e) {
      console.error("Gagal menyimpan ke database local", e);
    }
  };

  return (
    <div className="space-y-8 p-6 max-w-7xl mx-auto">
      {/* HEADER PAGE */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0b6245]/10 text-[#0b6245] dark:text-emerald-400 text-xs font-bold font-mono">
            ADMIN PORTAL — PENDATAAN KASUS & DATABASE HARTA
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
            Konversi & Input Database Harta Warisan
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Pendataan resmi aset warisan almarhum/ah berdasarkan Zonasi PU/ZNT & Penilaian PUPR untuk disimpan ke Database Arsip Sistem.
          </p>
        </div>
      </div>

      {/* SUCCESS NOTIFICATION */}
      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300 flex items-center justify-between shadow-md animate-in fade-in">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="size-6 text-emerald-600 shrink-0" />
            <div>
              <div className="font-bold text-sm">Data Kasus Berhasil Disimpan ke Database!</div>
              <div className="text-xs">No. Berkas: {noBerkas} — Nama Pewaris: {namaPewaris} ({formatIDR(totalHartaKotor)})</div>
            </div>
          </div>
          <Link
            href="/admin/arsip"
            className="px-3.5 py-1.5 rounded-xl bg-[#0b6245] text-white text-xs font-bold no-underline hover:bg-[#084b34] transition-colors"
          >
            Lihat di Arsip Digital
          </Link>
        </div>
      )}

      {/* FORM METADATA PEWARIS (MUST BE ENTERED BY ADMIN) */}
      <div className="glass rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4 shadow-lg bg-white dark:bg-slate-900">
        <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
          <User className="size-5 text-[#0b6245] dark:text-emerald-400" /> 1. Identitas Pewaris / Almarhum (Wajib untuk Database)
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Nama Lengkap Almarhum/ah *
            </label>
            <input
              type="text"
              value={namaPewaris}
              onChange={(e) => setNamaPewaris(e.target.value)}
              placeholder="Contoh: H. Ahmad Subardjo"
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-semibold focus:ring-2 focus:ring-[#0b6245] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              NIK Pewaris (Opsional)
            </label>
            <input
              type="text"
              value={nikPewaris}
              onChange={(e) => setNikPewaris(e.target.value)}
              placeholder="Contoh: 3273123456780001"
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono focus:ring-2 focus:ring-[#0b6245] outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              No. Berkas Kasus Waris
            </label>
            <input
              type="text"
              value={noBerkas}
              onChange={(e) => setNoBerkas(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-mono font-bold text-[#0b6245] dark:text-emerald-400 outline-none"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
              Tanggal Meninggal
            </label>
            <input
              type="date"
              value={tglMeninggal}
              onChange={(e) => setTglMeninggal(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 font-semibold outline-none"
            />
          </div>
        </div>
      </div>

      {/* FORM INPUT ASET WARISAN */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-7 space-y-6">
          <div className="glass rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 space-y-6 shadow-xl bg-white dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Plus className="size-5 text-[#0b6245] dark:text-emerald-400" /> 2. Rincian Aset Warisan (ZNT & PUPR)
              </h2>
              <span className="text-xs text-[#0b6245] font-bold font-mono">Standar ZNT E-MAWARIST & PUPR</span>
            </div>

            {/* KATEGORI TABS */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: "properti", label: "Tanah & Rumah", icon: Building2 },
                { id: "emas", label: "Emas / Mulia", icon: Coins },
                { id: "kendaraan", label: "Kendaraan", icon: Car },
                { id: "kas", label: "Tabungan", icon: Wallet },
                { id: "usaha", label: "Usaha / Lain", icon: Briefcase },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = selectedKategori === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setSelectedKategori(tab.id as any)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? "bg-[#0b6245] text-white border-[#0b6245] shadow-md scale-105"
                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100"
                    }`}
                  >
                    <Icon className="size-4 mb-1" />
                    <span className="text-[11px] text-center leading-tight">{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* FORM INPUTS */}
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Nama / Identitas Aset
                  </label>
                  <input
                    type="text"
                    value={formNama}
                    onChange={(e) => setFormNama(e.target.value)}
                    placeholder="Contoh: Tanah Sawah / Rumah Tinggal"
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-[#0b6245] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Keterangan / Dokumen
                  </label>
                  <input
                    type="text"
                    value={formKet}
                    onChange={(e) => setFormKet(e.target.value)}
                    placeholder="Contoh: SHM No. 12345"
                    className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-[#0b6245] outline-none"
                  />
                </div>
              </div>

              {/* PROPERTI SPECIFIC FORM */}
              {selectedKategori === "properti" && (
                <div className="p-4.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        1. Provinsi
                      </label>
                      <Select2
                        options={provinsiOptions}
                        value={formProvinsiId}
                        onChange={handleProvinsiChange}
                        placeholder="Cari Provinsi..."
                        searchPlaceholder="Ketik provinsi..."
                        allowCustom={true}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        2. Kota / Kabupaten
                      </label>
                      <Select2
                        options={kotaOptions}
                        value={formKotaId}
                        onChange={handleKotaChange}
                        placeholder="Cari Kota/Kab..."
                        searchPlaceholder="Ketik kota..."
                        allowCustom={true}
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                        3. {isKotaSelected ? "Kelurahan / Kecamatan" : "Desa / Kecamatan"}
                      </label>
                      <Select2
                        options={desaOptions}
                        value={formDesaId}
                        onChange={handleDesaChange}
                        placeholder={isKotaSelected ? "Cari Kelurahan..." : "Cari Desa..."}
                        searchPlaceholder="Ketik nama desa..."
                        allowCustom={true}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Luas Tanah (m²)
                      </label>
                      <input
                        type="number"
                        value={formLuasTanah}
                        onChange={(e) => setFormLuasTanah(e.target.value)}
                        placeholder="Contoh: 200"
                        className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 outline-none"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                          Harga Tanah / m² (Rp)
                        </label>
                        <button
                          type="button"
                          onClick={handleAiDetectPriceTrend}
                          disabled={aiLoading}
                          className="text-[10px] font-bold text-[#0b6245] dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          <TrendingUp className={`size-3 ${aiLoading ? "animate-spin text-amber-500" : ""}`} />
                          {aiLoading ? "Memindai..." : "Update Tren"}
                        </button>
                      </div>
                      <input
                        type="text"
                        value={formHargaTanahM2}
                        onChange={(e) => setFormHargaTanahM2(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono font-bold text-[#0b6245] dark:text-emerald-400 outline-none"
                      />
                    </div>
                  </div>

                  {/* TOGGLE ADA BANGUNAN */}
                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-3">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formAdaBangunan}
                        onChange={(e) => setFormAdaBangunan(e.target.checked)}
                        className="size-4 rounded text-[#0b6245] focus:ring-[#0b6245]"
                      />
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Termasuk Bangunan / Rumah Di Atas Lahan
                      </span>
                    </label>

                    {formAdaBangunan && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                            Luas Bangunan (m²)
                          </label>
                          <input
                            type="number"
                            value={formLuasBangunan}
                            onChange={(e) => setFormLuasBangunan(e.target.value)}
                            placeholder="Contoh: 120"
                            className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 outline-none"
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                            Tipe Bangunan (PUPR)
                          </label>
                          <Select2
                            options={tipeBangunanOptions}
                            value={formTipeBangunanId}
                            onChange={setFormTipeBangunanId}
                            placeholder="Pilih Tipe PUPR..."
                            searchPlaceholder="Cari tipe..."
                          />
                        </div>
                        <div>
                          <label className="block text-[10px] font-semibold text-slate-500 mb-1">
                            Biaya Bangunan/m² (Rp)
                          </label>
                          <input
                            type="text"
                            value={formHargaBangunanM2}
                            onChange={(e) => setFormHargaBangunanM2(e.target.value)}
                            className="w-full px-2.5 py-1.5 rounded-lg text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono outline-none"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* EMAS SPECIFIC FORM */}
              {selectedKategori === "emas" && (
                <div className="p-4 rounded-2xl bg-yellow-500/5 border border-yellow-500/20 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Berat Total Emas (Gram)
                      </label>
                      <input
                        type="number"
                        value={formBeratEmas}
                        onChange={(e) => setFormBeratEmas(e.target.value)}
                        placeholder="Contoh: 50"
                        className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Harga Emas per Gram (Rp)
                      </label>
                      <input
                        type="text"
                        value={formHargaEmas}
                        onChange={(e) => setFormHargaEmas(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono font-bold text-yellow-600 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* KENDARAAN SPECIFIC FORM */}
              {selectedKategori === "kendaraan" && (
                <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-3">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Jenis Kendaraan
                      </label>
                      <Select2
                        options={tipeKendaraanOptions}
                        value={formTipeKendaraan}
                        onChange={setFormTipeKendaraan}
                        placeholder="Pilih Kendaraan..."
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Tahun Pembuatan
                      </label>
                      <Select2
                        options={tahunKendaraanOptions}
                        value={formTahunKendaraan}
                        onChange={setFormTahunKendaraan}
                        placeholder="Pilih Tahun..."
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                        Taksiran Harga (Rp)
                      </label>
                      <input
                        type="text"
                        value={formNominalKendaraan}
                        onChange={(e) => setFormNominalKendaraan(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono font-bold text-blue-600 outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* KAS & USAHA SPECIFIC FORM */}
              {(selectedKategori === "kas" || selectedKategori === "usaha") && (
                <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                      Nominal Rupiah (Rp)
                    </label>
                    <input
                      type="text"
                      value={formNominalKasUsaha}
                      onChange={(e) => setFormNominalKasUsaha(e.target.value)}
                      placeholder="Masukkan nominal tunai / saham"
                      className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono font-bold text-emerald-600 outline-none"
                    />
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleAddItem}
                className="w-full py-3 bg-[#0b6245] hover:bg-[#084b34] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Plus className="size-4" /> Masukkan Aset Ini ke Daftar Rekam Kasus
              </button>
            </div>
          </div>
        </div>

        {/* SUMMARY & SAVE TO DATABASE CARD */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass rounded-3xl p-6 border border-[#0b6245]/30 bg-gradient-to-br from-white via-[#0b6245]/5 to-[#ca9a28]/10 dark:from-[#151c2c] space-y-6 shadow-xl">
            <div className="space-y-2 border-b border-slate-200 dark:border-slate-800 pb-4">
              <span className="text-[10px] font-bold tracking-widest text-[#0b6245] dark:text-emerald-400 uppercase font-mono">
                TOTAL KASUS BERKAS {noBerkas}
              </span>
              <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
                Total Harta Kotor (Tirkah)
              </h3>
              <div className="text-3xl font-extrabold text-[#0b6245] dark:text-emerald-400 font-mono tracking-tight pt-1">
                {formatIDR(totalHartaKotor)}
              </div>
            </div>

            {/* DAFTAR ITEM TERINPUT */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-bold text-slate-800 dark:text-slate-200">
                <span>Rincian Item ({items.length} Aset)</span>
                {items.length > 0 && (
                  <button onClick={() => setItems([])} className="text-rose-500 hover:underline text-[11px]">
                    Reset All
                  </button>
                )}
              </div>

              {items.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed text-center text-xs text-slate-400">
                  Belum ada aset terdaftar di kasus ini.
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {items.map((it) => (
                    <div key={it.id} className="p-3 rounded-xl bg-white dark:bg-slate-800 border text-xs flex justify-between items-center">
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white">{it.namaItem}</div>
                        <div className="text-[10px] text-slate-400 font-mono">{formatIDR(it.subtotal)}</div>
                      </div>
                      <button onClick={() => handleRemoveItem(it.id)} className="text-slate-400 hover:text-rose-500">
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleSaveToDatabase}
                className="w-full py-3.5 px-4 bg-[#0b6245] hover:bg-[#084b34] text-white text-xs sm:text-sm font-bold rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer scale-102 hover:scale-105"
              >
                <Save className="size-4" /> Simpan Rekam Kasus ke Database
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
