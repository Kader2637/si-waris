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

// Helper: determine which "stirps slot" a cucu belongs to
// Returns "AnakLaki" or "AnakPerempuan" or null
function getCucuSlot(hubungan: string): "AnakLaki" | "AnakPerempuan" | null {
  const fromAnakPr = [
    "Cucu Laki-laki dari Anak Perempuan",
    "Cucu Perempuan dari Anak Perempuan",
    "Cucu Laki-laki Anak Perempuan",
    "Cucu Perempuan Anak Perempuan",
  ];
  const fromAnakLk = [
    "Cucu Laki-laki",
    "Cucu Perempuan",
    "Cucu Laki-laki dari Anak Laki-laki",
    "Cucu Perempuan dari Anak Laki-laki",
  ];
  if (fromAnakPr.includes(hubungan)) return "AnakPerempuan";
  if (fromAnakLk.includes(hubungan)) return "AnakLaki";
  return null;
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

  const pasangan   = activeHeirs.filter(h => h.hubungan === "Suami" || h.hubungan === "Istri");
  const anakLaki   = activeHeirs.filter(h => h.hubungan === "Anak Laki-laki");
  const anakPr     = activeHeirs.filter(h => h.hubungan === "Anak Perempuan");
  const allAnak    = [...anakLaki, ...anakPr];

  // Cucu kelompokkan per slot jalur
  const cucuDariAnakLaki = activeHeirs.filter(h => getCucuSlot(h.hubungan) === "AnakLaki");
  const cucuDariAnakPr   = activeHeirs.filter(h => getCucuSlot(h.hubungan) === "AnakPerempuan");

  const gol2Types = ["Ayah", "Ibu", "Saudara Laki-laki Sekandung", "Saudara Perempuan Sekandung"];
  const gol2 = activeHeirs.filter(h => gol2Types.includes(h.hubungan));

  const results: PerdataResultItem[] = [];
  const assigned = new Set<string>();

  const makeId = (h: typeof activeHeirs[0]) => h.id || h.hubungan + "_" + h.nama;

  // Golongan I: Pasangan + Anak + Cucu (plaatsvervulling per stirpes)
  // Apakah ada Gol1 sama sekali?
  const hasGol1 = pasangan.length > 0 || allAnak.length > 0
    || cucuDariAnakLaki.length > 0 || cucuDariAnakPr.length > 0;

  if (hasGol1) {
    // ---- Hitung berapa "slot" level Anak ----
    // Slot dari anak laki-laki: jumlah anak laki hidup ATAU (jika 0, tapi ada cucu dari anak laki) = 1 slot gabungan
    const slotAnakLaki = anakLaki.length > 0
      ? anakLaki.length
      : (cucuDariAnakLaki.length > 0 ? 1 : 0);

    const slotAnakPr = anakPr.length > 0
      ? anakPr.length
      : (cucuDariAnakPr.length > 0 ? 1 : 0);

    const slotAnak = slotAnakLaki + slotAnakPr;
    const slotPasangan = pasangan.length;

    // Total slot: pasangan + slot anak (per stirpes)
    const totalSlots = slotPasangan + slotAnak;

    if (totalSlots === 0) {
      // Fallback: tidak ada yang mewarisi
    } else {
      const sharePerSlot = hartaBersih / totalSlots;

      // Pasangan: masing-masing 1 slot
      pasangan.forEach(h => {
        const id = makeId(h);
        assigned.add(id);
        results.push({
          ahliWarisId: h.id || h.hubungan,
          nama: h.nama || h.hubungan,
          hubungan: h.hubungan,
          status: "Mewarisi",
          alasan: "Golongan I: Pasangan hidup pewaris (Pasal 852a KUHPerdata)",
          jatahPersen: `${((sharePerSlot / hartaBersih) * 100).toFixed(2)}%`,
          jatahNominal: Math.round(sharePerSlot),
        });
      });

      // Anak hidup: masing-masing 1 slot penuh
      allAnak.forEach(h => {
        const id = makeId(h);
        assigned.add(id);
        results.push({
          ahliWarisId: h.id || h.hubungan,
          nama: h.nama || h.hubungan,
          hubungan: h.hubungan,
          status: "Mewarisi",
          alasan: "Golongan I: Anak kandung mendapat bagian penuh per kepala (Pasal 852 KUHPerdata)",
          jatahPersen: `${((sharePerSlot / hartaBersih) * 100).toFixed(2)}%`,
          jatahNominal: Math.round(sharePerSlot),
        });
      });

      // Cucu dari Anak Laki-laki: berbagi 1 slot bersama (hanya jika TIDAK ada anak laki yang hidup)
      if (anakLaki.length === 0 && cucuDariAnakLaki.length > 0) {
        const sharePerCucu = sharePerSlot / cucuDariAnakLaki.length;
        cucuDariAnakLaki.forEach(h => {
          const id = makeId(h);
          assigned.add(id);
          results.push({
            ahliWarisId: h.id || h.hubungan,
            nama: h.nama || h.hubungan,
            hubungan: h.hubungan,
            status: "Mewarisi",
            alasan: `Golongan I (Plaatsvervulling per stirpes): Berbagi 1 slot jalur Anak Laki-laki bersama ${cucuDariAnakLaki.length} cucu lain (Pasal 841 KUHPerdata)`,
            jatahPersen: `${((sharePerCucu / hartaBersih) * 100).toFixed(2)}%`,
            jatahNominal: Math.round(sharePerCucu),
          });
        });
      } else if (anakLaki.length > 0 && cucuDariAnakLaki.length > 0) {
        // Ada anak laki hidup → cucu dari anak laki terhijab
        cucuDariAnakLaki.forEach(h => {
          const id = makeId(h);
          assigned.add(id);
          results.push({
            ahliWarisId: h.id || h.hubungan,
            nama: h.nama || h.hubungan,
            hubungan: h.hubungan,
            status: "Terhijab",
            alasan: "Orang tua (Anak Laki-laki) masih hidup — Cucu tertutup oleh Anak (Plaatsvervulling hanya berlaku jika orang tua wafat)",
            jatahPersen: "0%",
            jatahNominal: 0,
          });
        });
      }

      // Cucu dari Anak Perempuan: berbagi 1 slot bersama (hanya jika TIDAK ada anak perempuan yang hidup)
      if (anakPr.length === 0 && cucuDariAnakPr.length > 0) {
        const sharePerCucu = sharePerSlot / cucuDariAnakPr.length;
        cucuDariAnakPr.forEach(h => {
          const id = makeId(h);
          assigned.add(id);
          results.push({
            ahliWarisId: h.id || h.hubungan,
            nama: h.nama || h.hubungan,
            hubungan: h.hubungan,
            status: "Mewarisi",
            alasan: `Golongan I (Plaatsvervulling per stirpes): Berbagi 1 slot jalur Anak Perempuan bersama ${cucuDariAnakPr.length} cucu lain (Pasal 841 KUHPerdata)`,
            jatahPersen: `${((sharePerCucu / hartaBersih) * 100).toFixed(2)}%`,
            jatahNominal: Math.round(sharePerCucu),
          });
        });
      } else if (anakPr.length > 0 && cucuDariAnakPr.length > 0) {
        // Ada anak perempuan hidup → cucu dari anak perempuan terhijab
        cucuDariAnakPr.forEach(h => {
          const id = makeId(h);
          assigned.add(id);
          results.push({
            ahliWarisId: h.id || h.hubungan,
            nama: h.nama || h.hubungan,
            hubungan: h.hubungan,
            status: "Terhijab",
            alasan: "Orang tua (Anak Perempuan) masih hidup — Cucu tertutup oleh Anak (Plaatsvervulling hanya berlaku jika orang tua wafat)",
            jatahPersen: "0%",
            jatahNominal: 0,
          });
        });
      }
    }

    // Semua ahli waris yang tidak masuk Gol1 → Terhijab
    activeHeirs.forEach(h => {
      const id = makeId(h);
      if (!assigned.has(id)) {
        results.push({
          ahliWarisId: h.id || h.hubungan,
          nama: h.nama || h.hubungan,
          hubungan: h.hubungan,
          status: "Terhijab",
          alasan: "Tertutup oleh Golongan I (Pasangan / Anak / Cucu Pengganti)",
          jatahPersen: "0%",
          jatahNominal: 0,
        });
      }
    });

  } else if (gol2.length > 0) {
    // Golongan II: Orang tua & Saudara
    const sharePerPerson = hartaBersih / gol2.length;
    activeHeirs.forEach(h => {
      const isGol2 = gol2.some(g => g.hubungan === h.hubungan);
      results.push({
        ahliWarisId: h.id || h.hubungan,
        nama: h.nama || h.hubungan,
        hubungan: h.hubungan,
        status: isGol2 ? "Mewarisi" : "Terhijab",
        alasan: isGol2
          ? "Golongan II: Orang tua dan saudara membagi rata (Pasal 854-857 KUHPerdata)"
          : "Tertutup oleh Golongan II",
        jatahPersen: isGol2 ? `${((sharePerPerson / hartaBersih) * 100).toFixed(2)}%` : "0%",
        jatahNominal: isGol2 ? Math.round(sharePerPerson) : 0,
      });
    });
  } else {
    // Tidak ada ahli waris → bagi rata semua
    const sharePerPerson = activeHeirs.length > 0 ? hartaBersih / activeHeirs.length : 0;
    activeHeirs.forEach(h => {
      results.push({
        ahliWarisId: h.id || h.hubungan,
        nama: h.nama || h.hubungan,
        hubungan: h.hubungan,
        status: "Mewarisi",
        alasan: "Membagi rata seluruh harta waris",
        jatahPersen: `${((sharePerPerson / hartaBersih) * 100).toFixed(2)}%`,
        jatahNominal: Math.round(sharePerPerson),
      });
    });
  }

  return {
    hartaBersih,
    statusAulRadd: "KUHPerdata (BW)",
    ahliWarisGetted: results,
  };
}
