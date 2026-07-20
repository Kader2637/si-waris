"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createKeluarga } from "@/app/actions/waris";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/ConfirmModal";

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
    <div>
      <ConfirmModal 
        isOpen={removeIndex !== null}
        onClose={() => setRemoveIndex(null)}
        onConfirm={confirmRemoveHeir}
        title="Hapus Anggota?"
        message="Hapus anggota dari daftar perhitungan."
      />

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-3">
        <div>
          <h2 className="font-serif fw-bold text-dark m-0">Form Tambah Keluarga Baru</h2>
          <p className="text-secondary small m-0">Input identitas pewaris, parameter harta, dan silsilah keluarga.</p>
        </div>
        <Link href="/admin/keluarga" className="btn btn-outline-secondary btn-sm fw-bold">
          <i className="bi bi-arrow-left me-1"></i> Kembali ke Tabel
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="row g-4">
          
          <div className="col-lg-8">
            
            {/* Card 1: Identitas Pewaris */}
            <div className="card wp-card p-4 mb-4">
              <h5 className="wp-widget-header mb-3">
                <i className="bi bi-person-fill text-success"></i> Identitas Almarhum / Pewaris
              </h5>

              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Sistem Hukum Pembagian</label>
                <div className="btn-group w-100" role="group">
                  {["Islam", "Jawa", "Perdata"].map((h) => (
                    <button
                      key={h}
                      type="button"
                      className={`btn btn-sm ${hukum === h ? "btn-success fw-bold" : "btn-outline-secondary"}`}
                      onClick={() => setHukum(h)}
                    >
                      {h === "Islam" ? "Hukum Islam (Faraid)" : h === "Jawa" ? "Hukum Adat Jawa" : "Perdata"}
                    </button>
                  ))}
                </div>
              </div>

              {hukum === "Jawa" && (
                <div className="alert alert-warning mb-3">
                  <label className="form-label small fw-bold">Metode Adat Jawa</label>
                  <select 
                    className="form-select form-select-sm mb-2"
                    value={metodeAdat}
                    onChange={(e) => setMetodeAdat(e.target.value)}
                  >
                    <option value="SEPIKUL_SEGENDONGAN">Sepikul Segendongan (2:1)</option>
                    <option value="KUM_KUM_KUPAT">Dum-Duman (1:1 Sama Rata)</option>
                  </select>
                  <div className="form-check form-switch">
                    <input 
                      className="form-check-input" 
                      type="checkbox" 
                      id="gonoSwitch"
                      checked={potongGonoGini}
                      onChange={(e) => setPotongGonoGini(e.target.checked)}
                    />
                    <label className="form-check-label small fw-bold" htmlFor="gonoSwitch">
                      Potong Harta Gono-Gini 50% untuk Pasangan
                    </label>
                  </div>
                </div>
              )}

              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Nama Lengkap *</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="Nama almarhum..."
                    value={jenazah.nama}
                    onChange={(e) => setJenazah({...jenazah, nama: e.target.value})}
                    required
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">NIK (16 Digit)</label>
                  <input 
                    type="text" 
                    className="form-control"
                    placeholder="3171..."
                    value={jenazah.nik}
                    onChange={(e) => setJenazah({...jenazah, nik: e.target.value})}
                  />
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Jenis Kelamin</label>
                  <select 
                    className="form-select"
                    value={jenazah.gender}
                    onChange={(e) => setJenazah({...jenazah, gender: e.target.value})}
                  >
                    <option value="Laki-laki">Laki-laki</option>
                    <option value="Perempuan">Perempuan</option>
                  </select>
                </div>

                <div className="col-md-6">
                  <label className="form-label small fw-bold text-muted">Tanggal Wafat</label>
                  <input 
                    type="date" 
                    className="form-control"
                    value={jenazah.tanggalWafat}
                    onChange={(e) => setJenazah({...jenazah, tanggalWafat: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* Card 2: Ahli Waris */}
            <div className="card wp-card p-4">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="wp-widget-header m-0">
                  <i className="bi bi-people-fill text-success"></i> Silsilah Ahli Waris ({ahliWaris.length})
                </h5>
                <button type="button" className="btn btn-sm btn-outline-success fw-bold" onClick={handleAddAhliWaris}>
                  <i className="bi bi-plus-circle me-1"></i> Tambah Anggota
                </button>
              </div>

              <div className="table-responsive">
                <table className="table table-bordered align-middle small">
                  <thead className="table-light">
                    <tr>
                      <th style={{ width: "40px" }}>No</th>
                      <th>Nama Ahli Waris</th>
                      <th>Hubungan Keluarga</th>
                      <th>Status</th>
                      <th style={{ width: "60px" }}>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ahliWaris.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="text-center text-muted py-3">
                          Belum ada anggota keluarga. Klik Tambah Anggota.
                        </td>
                      </tr>
                    ) : (
                      ahliWaris.map((heir, idx) => (
                        <tr key={heir.id}>
                          <td className="text-center font-monospace">{idx + 1}</td>
                          <td>
                            <input 
                              type="text" 
                              className="form-control form-control-sm"
                              placeholder="Nama..."
                              value={heir.nama}
                              onChange={(e) => updateAhliWaris(idx, "nama", e.target.value)}
                            />
                          </td>
                          <td>
                            <select 
                              className="form-select form-select-sm"
                              value={heir.hubungan}
                              onChange={(e) => updateAhliWaris(idx, "hubungan", e.target.value)}
                            >
                              <option value="Suami">Suami</option>
                              <option value="Istri">Istri</option>
                              <option value="Anak Laki-laki">Anak Laki-laki</option>
                              <option value="Anak Perempuan">Anak Perempuan</option>
                              <option value="Ayah">Ayah</option>
                              <option value="Ibu">Ibu</option>
                              <option value="Saudara Laki-laki Sekandung">Saudara Laki-laki Sekandung</option>
                            </select>
                          </td>
                          <td>
                            <select 
                              className="form-select form-select-sm"
                              value={heir.statusHidup ? "Hidup" : "Meninggal"}
                              onChange={(e) => updateAhliWaris(idx, "statusHidup", e.target.value === "Hidup")}
                            >
                              <option value="Hidup">Masih Hidup</option>
                              <option value="Meninggal">Meninggal</option>
                            </select>
                          </td>
                          <td className="text-center">
                            <button type="button" className="btn btn-sm btn-outline-danger" onClick={() => setRemoveIndex(idx)}>
                              <i className="bi bi-trash"></i>
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
          <div className="col-lg-4">
            <div className="card wp-card p-4">
              <h5 className="wp-widget-header mb-3">
                <i className="bi bi-wallet2 text-success"></i> Rincian Aset
              </h5>

              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Total Harta Kotor (Rp)</label>
                <input 
                  type="text" 
                  className="form-control fw-bold"
                  placeholder="0"
                  value={harta}
                  onChange={(e) => setHarta(formatIDR(e.target.value))}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold text-muted">Total Utang & Tajhiz (Rp)</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="0"
                  value={utang}
                  onChange={(e) => setUtang(formatIDR(e.target.value))}
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold text-muted">Wasiat (Rp)</label>
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="0"
                  value={wasiat}
                  onChange={(e) => setWasiat(formatIDR(e.target.value))}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-success w-100 font-weight-bold py-2 shadow"
                disabled={loading || ahliWaris.length === 0}
              >
                {loading ? "Menyimpan..." : "Simpan & Kalkulasi Waris"}
              </button>
            </div>
          </div>

        </div>
      </form>
    </div>
  );
}
