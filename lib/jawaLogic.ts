import { Jenazah, AhliWaris } from "@prisma/client";

export interface AdatJawaResult {
  ahliWarisId: string;
  nama: string;
  hubungan: string;
  status: string;
  alasan: string;
  jatahPersen: string;
  jatahNominal: number;
}

export function calculateAdatJawa(
  jenazah: any,
  ahliWarisList: any[],
  metode: "SEPIKUL_SEGENDONGAN" | "KUM_KUM_KUPAT" = "SEPIKUL_SEGENDONGAN"
) {
  const hartaKotor = jenazah.hartaKotor;
  const utang = jenazah.utang || 0;
  const wasiat = jenazah.wasiat || 0;
  
  let hartaBersih = hartaKotor - utang - wasiat;
  let hartaGonoGini = 0;

  // 1. Potong Gono-Gini (50% untuk Pasangan Hidup)
  if (jenazah.potongGonoGini) {
    const pasanganHidup = ahliWarisList.find(h => 
      (h.hubungan === "Istri" || h.hubungan === "Suami") && h.statusHidup !== false
    );
    
    if (pasanganHidup) {
      hartaGonoGini = hartaBersih * 0.5;
      hartaBersih = hartaBersih * 0.5;
    }
  }

  const results: AdatJawaResult[] = [];

  // Jika ada gono-gini, tambahkan ke pasangan
  if (hartaGonoGini > 0) {
    const pasangan = ahliWarisList.find(h => (h.hubungan === "Istri" || h.hubungan === "Suami") && h.statusHidup !== false);
    if (pasangan) {
        // Pasangan mendapat gono-gini secara otomatis, lalu mungkin mendapat bagian lagi dari warisan?
        // Dalam Adat Jawa, biasanya gono-gini dipisah dulu. 
        // Bagian warisannya sendiri seringkali fleksibel, tapi di sini kita fokus ke keturunan.
    }
  }

  // 2. Preprocessing: Auto-link 'Cucu' to deceased 'Anak' if parentId is missing (Otomatis dari System)
  const deceasedChildren = ahliWarisList.filter(h => 
    (h.hubungan === "Anak Laki-laki" || h.hubungan === "Anak Perempuan") && h.statusHidup === false
  );

  ahliWarisList.forEach(h => {
    if ((h.hubungan === "Cucu Laki-laki" || h.hubungan === "Cucu Perempuan") && !h.parentId) {
      // Link to the first deceased child found if not manually linked
      if (deceasedChildren.length > 0) {
        h.parentId = deceasedChildren[0].id;
      }
    }
  });

  // 3. Distribusi ke Keturunan (Recursive)
  // Cari anak-anak langsung dari Jenazah (parentId = null)
  const children = ahliWarisList.filter(h => !h.parentId && (h.hubungan === "Anak Laki-laki" || h.hubungan === "Anak Perempuan"));

  distributeRecursive(children, hartaBersih, 1, "Harta Warisan", ahliWarisList, results, metode, hartaBersih);

  // Jika gono-gini ada, tambahkan ke pasangan di hasil akhir
  if (jenazah.potongGonoGini) {
    const pasangan = ahliWarisList.find(h => (h.hubungan === "Istri" || h.hubungan === "Suami") && h.statusHidup !== false);
    if (pasangan) {
        results.push({
            ahliWarisId: pasangan.id,
            nama: pasangan.nama,
            hubungan: pasangan.hubungan,
            status: "Mewarisi",
            alasan: "Menerima bagian Harta Gono-Gini (50%)",
            jatahPersen: "50% (Gono-Gini)",
            jatahNominal: hartaGonoGini
        });
    }
  }

  // 3. Pastikan SEMUA ahli waris yang terdaftar mendapat status (tidak ada yang 'Belum Dihitung')
  ahliWarisList.forEach(h => {
    if (!results.find(r => r.ahliWarisId === h.id)) {
      results.push({
        ahliWarisId: h.id,
        nama: h.nama,
        hubungan: h.hubungan,
        status: "Tidak Mewarisi",
        alasan: h.statusHidup === false 
          ? "Telah wafat dan tidak ada keturunan penerus." 
          : "Fokus pembagian Adat Jawa turun ke garis keturunan langsung (anak/cucu).",
        jatahPersen: "0%",
        jatahNominal: 0
      });
    }
  });

  return {
    results,
    hartaBersih,
    hartaGonoGini,
    status: "Success",
    metode
  };
}

function distributeRecursive(
  heirs: any[],
  amount: number,
  totalWeightParent: number,
  path: string,
  allHeirs: any[],
  results: AdatJawaResult[],
  metode: string,
  hartaBersih: number
) {
  if (heirs.length === 0) return;

  // Hitung bobot total untuk level ini
  let totalWeight = 0;
  heirs.forEach(h => {
    let weight = 1;
    if (metode === "SEPIKUL_SEGENDONGAN") {
      weight = (h.hubungan.includes("Laki-laki") || h.gender === "Laki-laki") ? 2 : 1;
    }
    h._weight = weight;
    totalWeight += weight;
  });

  heirs.forEach(h => {
    const share = (h._weight / totalWeight) * amount;
    const sharePersen = ((share / hartaBersih) * 100).toFixed(2) + "%";

    if (h.statusHidup !== false) {
      // Masih hidup, dapatkan bagian
      let alasan = "";
      if (metode === "SEPIKUL_SEGENDONGAN") {
         alasan = `Menerima jatah warisan sebagai ${h.hubungan} dengan porsi ${h._weight === 2 ? 'Ganda (2 Bagian)' : 'Tunggal (1 Bagian)'}.`;
      } else {
         alasan = `Menerima jatah warisan sebagai ${h.hubungan} dengan porsi Sama Rata (1 Bagian).`;
      }
      
      results.push({
        ahliWarisId: h.id,
        nama: h.nama,
        hubungan: h.hubungan,
        status: "Mewarisi",
        alasan: alasan,
        jatahPersen: sharePersen,
        jatahNominal: share
      });
    } else {
      // Meninggal, turun ke anak-anaknya (Recursive Replacement)
      results.push({
        ahliWarisId: h.id,
        nama: h.nama,
        hubungan: h.hubungan,
        status: "Digantikan",
        alasan: `Telah wafat. Porsi utuhnya (${sharePersen}) dialihkan ke keturunannya sebagai Ahli Waris Pengganti.`,
        jatahPersen: "0%",
        jatahNominal: 0
      });

      const replacementHeirs = allHeirs.filter(child => child.parentId === h.id);
      if (replacementHeirs.length > 0) {
        distributeRecursive(replacementHeirs, share, h._weight, `${path} -> ${h.nama}`, allHeirs, results, metode, hartaBersih);
      }
    }
  });
}
