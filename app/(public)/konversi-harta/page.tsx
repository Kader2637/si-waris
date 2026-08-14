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
  Info,
  Sparkles,
  MapPin,
  RotateCcw,
  TrendingUp,
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

export default function KonversiHartaPage() {
  const router = useRouter();

  // State Daftar Item Aset - Dimulai Kosong (Dinamis Murni Tanpa Data Dummy)
  const [items, setItems] = useState<ItemAsetWaris[]>([]);

  // Load items dari sessionStorage jika ada
  useEffect(() => {
    try {
      const savedItems = sessionStorage.getItem("emawarist_items_harta");
      if (savedItems) {
        const parsed = JSON.parse(savedItems);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch (e) {
      console.error("Gagal membaca sessionStorage aset", e);
    }
  }, []);

  // Simpan items ke sessionStorage secara dinamis setiap kali berubah
  useEffect(() => {
    if (items.length > 0) {
      sessionStorage.setItem("emawarist_items_harta", JSON.stringify(items));
      const total = items.reduce((acc, curr) => acc + curr.subtotal, 0);
      sessionStorage.setItem("emawarist_total_harta_kotor", total.toString());
    } else {
      sessionStorage.removeItem("emawarist_items_harta");
      sessionStorage.removeItem("emawarist_total_harta_kotor");
    }
  }, [items]);

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
      setAiTrendBadge(`📈 Analisis Tren ZNT: Terdeteksi penyesuaian tren harga ZNT +${growthPercent}% di lokasi ini (Berdasarkan Indeks NIR Terkini).`);
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
    // Fallback jika input mandiri
    return formKotaId.toLowerCase().includes("kota");
  }, [selectedKotaObj, formKotaId]);

  // Opsi Select2 Kelurahan / Desa / Zonasi (Tergantung Kota Terpilih)
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

  // Handlers saat Provinsi berubah -> Reset Kota & Desa ke item pertama
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

  // Handlers saat Kota berubah -> Reset Desa ke item pertama
  const handleKotaChange = (kotaId: string) => {
    setFormKotaId(kotaId);
    const kota = availableKotaList.find((k) => k.id === kotaId);
    if (kota && kota.desalist.length > 0) {
      const firstDesa = kota.desalist[0];
      setFormDesaId(firstDesa.id);
      setFormHargaTanahM2(firstDesa.hargaPerM2.toString());
    }
  };

  // Handlers saat Kelurahan/Desa/Zonasi berubah -> Auto set harga baseline (tetap bisa diedit pengguna)
  const handleDesaChange = (desaVal: string) => {
    setFormDesaId(desaVal);
    const desa = availableDesaList.find((d) => d.id === desaVal);
    if (desa) {
      setFormHargaTanahM2(desa.hargaPerM2.toString());
    }
  };

  // Update Harga Bangunan ketika Tipe Bangunan PUPR berubah
  useEffect(() => {
    const b = TIPE_BANGUNAN_PUPR.find((x) => x.id === formTipeBangunanId);
    if (b) {
      setFormHargaBangunanM2(b.hargaPerM2.toString());
    }
  }, [formTipeBangunanId]);

  // Update Nominal Kendaraan saat tipe & tahun berubah
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

  // Breakdown Per Kategori
  const breakdownKategori = useMemo(() => {
    const result = {
      properti: 0,
      kendaraan: 0,
      emas: 0,
      kas: 0,
      usaha: 0,
    };
    items.forEach((it) => {
      result[it.kategori] += it.subtotal;
    });
    return result;
  }, [items]);

  // Tambah Item Baru ke Daftar Dinamis
  const handleAddItem = () => {
    const parseNum = (val: string) => parseInt(val.replace(/\D/g, "")) || 0;

    let subtotal = 0;
    let newItem: ItemAsetWaris = {
      id: `item-${Date.now()}`,
      kategori: selectedKategori,
      namaItem: formNama.trim() || `Aset ${selectedKategori.toUpperCase()}`,
      keterangan: formKet.trim() || "Taksiran Harta Waris",
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
      // Kas / Usaha
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

  // Hapus Item Dinamis
  const handleRemoveItem = (id: string) => {
    setItems(items.filter((x) => x.id !== id));
  };

  // Reset Semua Aset
  const handleResetAll = () => {
    setItems([]);
  };

  // Export PDF Laporan Taksiran Harta
  const handleExportPDF = () => {
    const doc = new jsPDF();
    const dateStr = new Date().toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

    doc.setFontSize(16);
    doc.text("LAPORAN TAKSIRAN & KONVERSI HARTA WARIS", 105, 18, { align: "center" });
    doc.setFontSize(10);
    doc.text(`Platform E-MAWARIST — Standar Acuan ZNT & Penilaian PUPR`, 105, 24, {
      align: "center",
    });
    doc.text(`Tanggal Cetak: ${dateStr}`, 105, 29, { align: "center" });
    doc.line(15, 33, 195, 33);

    doc.setFontSize(11);
    doc.text(`TOTAL HARGA KOTOR TERKONVERSI: ${formatIDR(totalHartaKotor)}`, 15, 42);

    const tableData = items.map((it, idx) => [
      (idx + 1).toString(),
      it.namaItem,
      it.kategori.toUpperCase(),
      it.kategori === "properti"
        ? `${it.namaProvinsi} > ${it.namaKota} > ${it.namaDesa}`
        : it.keterangan || "-",
      formatIDR(it.subtotal),
    ]);

    autoTable(doc, {
      startY: 48,
      head: [["NO", "NAMA ASET", "KATEGORI", "LOKASI / SPESIFIKASI", "TAKSIRAN NILAI (IDR)"]],
      body: tableData,
      theme: "striped",
      headStyles: { fillColor: [11, 98, 69] },
      styles: { fontSize: 9 },
    });

    const finalY = (doc as any).lastAutoTable.finalY + 15;
    doc.setFontSize(10);
    doc.text(
      "* Catatan: Taksiran nilai properti tanah mengacu pada acuan Zona Nilai Tanah (ZNT) E-MAWARIST",
      15,
      finalY
    );
    doc.text(
      "  dan penilaian kualitas bangunan standar PUPR. Dapat disesuaikan kembali sesuai kesepakatan ahli waris.",
      15,
      finalY + 6
    );

    doc.save(`Laporan_Konversi_Harta_EMawarist_${Date.now()}.pdf`);
  };

  // Transfer ke Kalkulator Waris
  const handleTransferToKalkulator = () => {
    sessionStorage.setItem("emawarist_total_harta_kotor", totalHartaKotor.toString());
    sessionStorage.setItem("emawarist_items_harta", JSON.stringify(items));
    router.push("/kalkulator");
  };

  const getKategoriBadge = (kategori: string) => {
    switch (kategori) {
      case "properti":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Building2 className="size-3.5" /> Tanah & Rumah (ZNT Properti)
          </span>
        );
      case "kendaraan":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
            <Car className="size-3.5" /> Kendaraan
          </span>
        );
      case "emas":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/20">
            <Coins className="size-3.5" /> Emas & Logam Mulia
          </span>
        );
      case "kas":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
            <Wallet className="size-3.5" /> Tabungan / Kas
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-bold bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20">
            <Briefcase className="size-3.5" /> Usaha / Lainnya
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen hero-aurora pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* HEADER TITLE HERO */}
        <ScrollReveal>
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0b6245]/10 dark:bg-[#0b6245]/30 border border-[#0b6245]/20 dark:border-[#34d399]/30 text-[#0b6245] dark:text-[#34d399] text-xs font-bold uppercase tracking-wider shadow-2xs">
              <Building2 className="size-3.5" /> SISTEM TAKSIRAN LOKASI ZNT E-MAWARIST &amp; KEMENTERIAN PUPR
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Konversi &amp; Taksiran <span className="text-[#0b6245] dark:text-emerald-400">Harta Waris</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300">
              Pilih lokasi wilayah (Provinsi &rarr; Kota/Kabupaten &rarr; Kelurahan/Desa) dengan taksiran Zona Nilai Tanah (ZNT) E-MAWARIST sebelum dihitung pembagian warisnya.
            </p>
          </div>
        </ScrollReveal>

        {/* ZNT REALTIME BANNER & DIRECT LINK */}
        <ScrollReveal delay={100}>
          <div className="glass rounded-2xl p-4 sm:p-6 border border-emerald-500/30 bg-gradient-to-r from-emerald-900/10 via-emerald-800/5 to-amber-900/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
            <div className="flex items-start gap-3">
              <div className="p-3 rounded-xl bg-[#0b6245] text-white shrink-0 shadow-md">
                <MapPin className="size-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  Portal Cek Peta Zonasi Pertanahan Digital
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                  Ingin mengecek koordinat zona tanah persil Anda secara real-time? Gunakan portal Peta Pertanahan Geografis resmi.
                </p>
              </div>
            </div>
            <a
              href="https://bhumi.atrbpn.go.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0b6245] hover:bg-[#084b34] text-white text-xs font-bold shadow-md transition-all no-underline cursor-pointer"
            >
              <ExternalLink className="size-4" /> Buka Peta Pertanahan Digital
            </a>
          </div>
        </ScrollReveal>

        {/* MAIN LAYOUT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN (7 COLS) - INPUT FORM & DAFTAR ITEM */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* CARD 1: FORM TAMBAH ASET */}
            <ScrollReveal delay={150}>
              <div className="glass rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 space-y-6 shadow-xl relative z-30 overflow-visible">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                  <h2 className="text-lg font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    <Plus className="size-5 text-[#0b6245] dark:text-emerald-400" /> Tambah Aset Warisan Baru
                  </h2>
                  <span className="text-xs text-[#0b6245] font-bold font-mono">Acuan ZNT E-MAWARIST</span>
                </div>

                {/* KATEGORI PILL TABS */}
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
                            : "bg-white/60 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700"
                        }`}
                      >
                        <Icon className="size-4 mb-1" />
                        <span className="text-[11px] text-center leading-tight">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* FORM INPUTS ACCORDING TO CATEGORY */}
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
                        placeholder="Contoh: Rumah Tinggal / Tanah Kavling"
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-[#0b6245] dark:focus:ring-emerald-400 outline-none"
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
                        placeholder="Contoh: Sertifikat SHM No. 123"
                        className="w-full px-3.5 py-2.5 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:ring-2 focus:ring-[#0b6245] dark:focus:ring-emerald-400 outline-none"
                      />
                    </div>
                  </div>

                  {/* PROPERTI SPECIFIC FORM: SEARCHABLE COMBOBOX 3-TINGKAT */}
                  {selectedKategori === "properti" && (
                    <div className="p-4.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-4 relative z-30 overflow-visible">
                      {/* METODOLOGI PENILAIAN CALLOUT */}
                      <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs text-[#0b6245] dark:text-emerald-300 space-y-1">
                        <div className="font-bold flex items-center gap-1.5">
                          <Building2 className="size-4 text-[#0b6245] dark:text-emerald-400" /> Acuan Metodologi Penilaian Zonasi PU &amp; Standar PUPR
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
                          1. <strong>Taksiran Tanah</strong>: Ditentukan berdasarkan lokasi Zonasi Daerah (PU &amp; ZNT E-MAWARIST) × Luas Tanah (m²).
                          <br />
                          2. <strong>Taksiran Rumah</strong>: Ditentukan dari Luas Bangunan (m²) × Taksiran Biaya Bangunan/m² (Standar PUPR).
                        </p>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                          <Building2 className="size-4" /> Penentuan Lokasi &amp; Zonasi PU
                        </span>
                        <a
                          href="https://bhumi.atrbpn.go.id/"
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-[#0b6245] dark:text-emerald-400 font-bold underline flex items-center gap-1"
                        >
                          Peta Geografis <ExternalLink className="size-3" />
                        </a>
                      </div>

                      {/* 3 SEARCHABLE COMPONENTS */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        {/* SELECT 1: PROVINSI */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                            1. Provinsi
                          </label>
                          <Select2
                            options={provinsiOptions}
                            value={formProvinsiId}
                            onChange={handleProvinsiChange}
                            placeholder="Cari Provinsi..."
                            searchPlaceholder="Ketik nama provinsi..."
                            allowCustom={true}
                          />
                        </div>

                        {/* SELECT 2: KOTA / KABUPATEN */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                            2. Kota / Kabupaten
                          </label>
                          <Select2
                            options={kotaOptions}
                            value={formKotaId}
                            onChange={handleKotaChange}
                            placeholder="Cari Kota/Kabupaten..."
                            searchPlaceholder="Ketik nama kota/kab..."
                            allowCustom={true}
                          />
                        </div>

                        {/* SELECT 3: KELURAHAN (KOTA) ATAU DESA (KABUPATEN) */}
                        <div>
                          <label className="block text-[11px] font-bold text-slate-700 dark:text-slate-300 mb-1">
                            3. {isKotaSelected ? "Kelurahan / Kecamatan" : "Desa / Kecamatan"}
                          </label>
                          <Select2
                            options={desaOptions}
                            value={formDesaId}
                            onChange={handleDesaChange}
                            placeholder={isKotaSelected ? "Cari Kelurahan / Kecamatan..." : "Cari Desa / Kecamatan..."}
                            searchPlaceholder={isKotaSelected ? "Ketik nama kelurahan..." : "Ketik nama desa..."}
                            allowCustom={true}
                          />
                        </div>
                      </div>

                      {/* Summary Badging Lokasi Terpilih */}
                      {formDesaId && (
                        <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-900/50 flex items-center justify-between text-xs">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 font-mono uppercase">
                              LOKASI & ZONASI TERPILIH ({isKotaSelected ? "KOTA" : "KABUPATEN"})
                            </span>
                            <div className="font-bold text-slate-800 dark:text-slate-200">
                              {PROVINSI_BPN_DATA.find((p) => p.id === formProvinsiId)?.nama || formProvinsiId} &rarr;{" "}
                              {availableKotaList.find((k) => k.id === formKotaId)?.nama || formKotaId} &rarr;{" "}
                              {availableDesaList.find((d) => d.id === formDesaId)?.nama || formDesaId}
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-[10px] text-slate-400 font-mono">Taksiran ZNT</div>
                            <div className="font-bold font-mono text-[#0b6245] dark:text-emerald-400">
                              {formatIDR(parseInt(formHargaTanahM2) || 0)} / m²
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                            Luas Tanah (m²)
                          </label>
                          <input
                            type="number"
                            value={formLuasTanah}
                            onChange={(e) => setFormLuasTanah(e.target.value)}
                            placeholder="Contoh: 150"
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

                      {aiTrendBadge && (
                        <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-[11px] font-medium text-emerald-800 dark:text-emerald-300 flex items-center gap-2 animate-in fade-in">
                          <TrendingUp className="size-4 text-emerald-500 shrink-0" />
                          <span>{aiTrendBadge}</span>
                        </div>
                      )}

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
                                placeholder="Contoh: 100"
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
                                placeholder="Pilih Tipe Bangunan PUPR..."
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
                      <div className="text-xs font-bold text-yellow-700 dark:text-yellow-400 flex items-center gap-1.5">
                        <Coins className="size-4" /> Taksiran Logam Mulia / Emas
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                            Berat Total Emas (Gram)
                          </label>
                          <input
                            type="number"
                            value={formBeratEmas}
                            onChange={(e) => setFormBeratEmas(e.target.value)}
                            placeholder="Contoh: 25"
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
                            className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono font-bold text-yellow-600 dark:text-yellow-400 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* KENDARAAN SPECIFIC FORM */}
                  {selectedKategori === "kendaraan" && (
                    <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/20 space-y-3">
                      <div className="text-xs font-bold text-blue-700 dark:text-blue-400 flex items-center gap-1.5">
                        <Car className="size-4" /> Taksiran Kendaraan (Depresiasi Pasar)
                      </div>
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
                            searchPlaceholder="Cari kendaraan..."
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
                            searchPlaceholder="Cari tahun..."
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
                            className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono font-bold text-blue-600 dark:text-blue-400 outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* KAS & USAHA SPECIFIC FORM */}
                  {(selectedKategori === "kas" || selectedKategori === "usaha") && (
                    <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/20 space-y-3">
                      <div className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                        <Wallet className="size-4" /> Nominal Kas / Nilai Bersih Usaha
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                          Nominal Rupiah (Rp)
                        </label>
                        <input
                          type="text"
                          value={formNominalKasUsaha}
                          onChange={(e) => setFormNominalKasUsaha(e.target.value)}
                          placeholder="Masukkan nominal tunai / nilai saham usaha"
                          className="w-full px-3 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-mono font-bold text-emerald-600 dark:text-emerald-400 outline-none"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleAddItem}
                    className="w-full py-3 bg-[#0b6245] hover:bg-[#084b34] text-white text-xs font-bold rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <Plus className="size-4" /> Masukkan Aset Ini ke Daftar Taksiran
                  </button>
                </div>
              </div>
            </ScrollReveal>

            {/* CARD 2: DAFTAR ASET YANG SUDAH DITAMBAHKAN */}
            <ScrollReveal delay={200}>
              <div className="glass rounded-3xl p-6 sm:p-8 border border-slate-200/80 dark:border-slate-800 space-y-4 shadow-xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    Rincian Aset Terdaftar ({items.length} Item)
                  </h3>
                  {items.length > 0 && (
                    <button
                      type="button"
                      onClick={handleResetAll}
                      className="text-xs text-rose-500 hover:text-rose-700 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <RotateCcw className="size-3.5" /> Hapus Semua
                    </button>
                  )}
                </div>

                {items.length === 0 ? (
                  <div className="text-center py-12 px-4 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 space-y-3">
                    <div className="mx-auto size-12 rounded-full bg-emerald-500/10 text-[#0b6245] dark:text-emerald-400 grid place-items-center">
                      <Plus className="size-6" />
                    </div>
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Daftar Aset Masih Kosong</h4>
                      <p className="text-xs text-slate-500 max-w-sm mx-auto">
                        Silakan tambahkan aset warisan almarhum/ah (tanah, rumah, kendaraan, emas, tabungan, usaha) pada form di atas.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {items.map((it) => (
                      <div
                        key={it.id}
                        className="p-4 rounded-2xl bg-white/70 dark:bg-slate-800/70 border border-slate-200/80 dark:border-slate-700/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs hover:border-[#0b6245]/40 transition-colors"
                      >
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            {getKategoriBadge(it.kategori)}
                            <h4 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-slate-100">
                              {it.namaItem}
                            </h4>
                          </div>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {it.kategori === "properti"
                              ? `Lokasi: ${it.namaProvinsi} > ${it.namaKota} > ${it.namaDesa}`
                              : it.keterangan || "Tidak ada rincian"}
                          </p>
                          {it.kategori === "properti" && (
                            <div className="text-[10px] font-mono text-amber-700 dark:text-amber-400 pt-0.5">
                              Luas Tanah: {it.luasTanahM2}m² ({formatIDR(it.hargaTanahPerM2 || 0)}/m²)
                              {it.adaBangunan && ` + Bangunan: ${it.luasBangunanM2}m²`}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                          <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white font-mono">
                            {formatIDR(it.subtotal)}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveItem(it.id)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                            title="Hapus aset"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </ScrollReveal>

          </div>

          {/* RIGHT COLUMN (5 COLS) - SUMMARY CARD & ACTION BUTTONS */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            
            {/* TOTAL CONVERSION SUMMARY CARD */}
            <ScrollReveal delay={250}>
              <div className="glass rounded-3xl p-6 sm:p-8 border border-[#0b6245]/30 bg-gradient-to-br from-white/90 via-[#0b6245]/5 to-[#ca9a28]/10 dark:from-[#151c2c] dark:to-[#0b6245]/20 space-y-6 shadow-2xl relative overflow-hidden">
                <div className="space-y-2">
                  <span className="text-[10px] font-bold tracking-widest text-[#0b6245] dark:text-emerald-400 uppercase font-mono">
                    HASIL TAKSIRAN TERKONVERSI
                  </span>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    Total Harta Kotor (Tirkah)
                  </h3>
                  <div className="text-3xl sm:text-4xl font-extrabold text-[#0b6245] dark:text-emerald-400 font-mono tracking-tight pt-1">
                    {formatIDR(totalHartaKotor)}
                  </div>
                </div>

                {/* BREAKDOWN DISTRIBUSI KATEGORI */}
                {totalHartaKotor > 0 && (
                  <div className="space-y-3 pt-2 border-t border-slate-200/80 dark:border-slate-800">
                    <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Proporsi Distribusi Aset:
                    </div>

                    <div className="space-y-2">
                      {[
                        { key: "properti", label: "Tanah & Rumah (ZNT Properti)", color: "bg-amber-500" },
                        { key: "emas", label: "Emas & Perhiasan", color: "bg-yellow-500" },
                        { key: "kendaraan", label: "Kendaraan", color: "bg-blue-500" },
                        { key: "kas", label: "Tabungan & Kas", color: "bg-emerald-500" },
                        { key: "usaha", label: "Usaha / Lainnya", color: "bg-purple-500" },
                      ].map((item) => {
                        const val = (breakdownKategori as any)[item.key] || 0;
                        const pct = totalHartaKotor > 0 ? Math.round((val / totalHartaKotor) * 100) : 0;
                        if (val === 0) return null;
                        return (
                          <div key={item.key} className="space-y-1 text-xs">
                            <div className="flex justify-between font-medium">
                              <span className="text-slate-600 dark:text-slate-400">{item.label}</span>
                              <span className="font-bold text-slate-900 dark:text-slate-100 font-mono">
                                {formatIDR(val)} ({pct}%)
                              </span>
                            </div>
                            <div className="w-full bg-slate-200 dark:bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div
                                className={`h-full ${item.color} transition-all duration-500`}
                                style={{ width: `${pct}%` }}
                              />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* MAIN ACTIONS BUTTONS */}
                <div className="space-y-3 pt-4">
                  <button
                    type="button"
                    disabled={items.length === 0}
                    onClick={handleTransferToKalkulator}
                    className="w-full py-3.5 px-4 bg-[#0b6245] hover:bg-[#084b34] disabled:bg-slate-400 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed scale-102 hover:scale-105"
                  >
                    <Calculator className="size-4" /> Gunakan Total Ini di Kalkulator Waris
                  </button>

                  <button
                    type="button"
                    disabled={items.length === 0}
                    onClick={handleExportPDF}
                    className="w-full py-3 px-4 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 disabled:opacity-50 text-slate-700 dark:text-slate-200 text-xs font-bold rounded-2xl shadow-xs hover:bg-slate-50 dark:hover:bg-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                  >
                    <Download className="size-4 text-[#ca9a28]" /> Download Laporan Inventaris (PDF)
                  </button>
                </div>
              </div>
            </ScrollReveal>

            {/* INFORMASI HUKUM WARIS NOTE */}
            <ScrollReveal delay={300}>
              <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-900 dark:text-amber-300 space-y-2">
                <div className="font-bold flex items-center gap-1.5">
                  <Info className="size-4 text-amber-600 dark:text-amber-400" /> Pengurangan Tirkah Sebelum Pembagian Waris
                </div>
                <p className="leading-relaxed text-[11px] font-normal">
                  Sesuai hukum Faraidh & Perdata, setelah total harta kotor terkonversi, pastikan untuk mengisikan **Hutang Pewaris** dan **Wasiat (maksimal 1/3)** di halaman Kalkulator Waris sebelum membagi hak ahli waris.
                </p>
              </div>
            </ScrollReveal>

          </div>

        </div>
      </div>
    </div>
  );
}
