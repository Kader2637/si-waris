export interface PerdataResultItem {
  ahliWarisId: string;
  nama: string;
  hubungan: string;
  status: string;
  alasan: string;
  jatahPersen: string;
  jatahNominal: number;
}

export interface PerdataResult {
  hartaBersih: number;
  statusAulRadd: string;
  ahliWarisGetted: PerdataResultItem[];
}

export function calculatePerdata(
  jenazah: { hartaKotor: number; utang: number; wasiat: number },
  ahliWarisList: { id?: string; nama: string; hubungan: string; statusHidup?: boolean }[]
): PerdataResult {
  const hartaKotor = jenazah.hartaKotor || 0;
  const utang = jenazah.utang || 0;
  const wasiat = jenazah.wasiat || 0;
  const hartaBersih = Math.max(0, hartaKotor - utang - wasiat);

  const activeHeirs = ahliWarisList.filter(h => h.statusHidup !== false);

  const gol1 = activeHeirs.filter(h => ["Suami", "Istri", "Anak Laki-laki", "Anak Perempuan"].includes(h.hubungan));
  const gol2 = activeHeirs.filter(h => ["Ayah", "Ibu", "Saudara Laki-laki Sekandung", "Saudara Perempuan Sekandung"].includes(h.hubungan));

  let results: PerdataResultItem[] = [];

  if (gol1.length > 0) {
    const sharePerPerson = 1 / gol1.length;
    results = activeHeirs.map(h => {
      const isGol1 = gol1.some(g => g.hubungan === h.hubungan);
      if (isGol1) {
        return {
          ahliWarisId: h.id || h.hubungan,
          nama: h.nama || h.hubungan,
          hubungan: h.hubungan,
          status: "Mewarisi",
          alasan: "Golongan I: Pasangan dan Anak membagi rata (Pasal 852a KUHPerdata)",
          jatahPersen: `${(sharePerPerson * 100).toFixed(2)}%`,
          jatahNominal: Math.round(sharePerPerson * hartaBersih),
        };
      }
      return {
        ahliWarisId: h.id || h.hubungan,
        nama: h.nama || h.hubungan,
        hubungan: h.hubungan,
        status: "Terhijab",
        alasan: "Tertutup oleh Golongan I",
        jatahPersen: "0%",
        jatahNominal: 0,
      };
    });
  } else if (gol2.length > 0) {
    const sharePerPerson = 1 / gol2.length;
    results = activeHeirs.map(h => {
      const isGol2 = gol2.some(g => g.hubungan === h.hubungan);
      if (isGol2) {
        return {
          ahliWarisId: h.id || h.hubungan,
          nama: h.nama || h.hubungan,
          hubungan: h.hubungan,
          status: "Mewarisi",
          alasan: "Golongan II: Orang tua dan saudara membagi rata",
          jatahPersen: `${(sharePerPerson * 100).toFixed(2)}%`,
          jatahNominal: Math.round(sharePerPerson * hartaBersih),
        };
      }
      return {
        ahliWarisId: h.id || h.hubungan,
        nama: h.nama || h.hubungan,
        hubungan: h.hubungan,
        status: "Terhijab",
        alasan: "Tertutup oleh Golongan II",
        jatahPersen: "0%",
        jatahNominal: 0,
      };
    });
  } else {
    const sharePerPerson = activeHeirs.length > 0 ? 1 / activeHeirs.length : 0;
    results = activeHeirs.map(h => ({
      ahliWarisId: h.id || h.hubungan,
      nama: h.nama || h.hubungan,
      hubungan: h.hubungan,
      status: "Mewarisi",
      alasan: "Membagi rata bagian waris perdata",
      jatahPersen: `${(sharePerPerson * 100).toFixed(2)}%`,
      jatahNominal: Math.round(sharePerPerson * hartaBersih),
    }));
  }

  return {
    hartaBersih,
    statusAulRadd: "KUHPerdata (BW)",
    ahliWarisGetted: results,
  };
}
