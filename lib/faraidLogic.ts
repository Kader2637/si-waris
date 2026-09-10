import { AhliWaris, Jenazah } from '@prisma/client';

export interface FaraidResult {
  hartaBersih: number;
  kpk: number;
  statusAulRadd: string;
  ahliWarisGetted: {
    ahliWarisId: string;
    nama: string;
    hubungan: string;
    status: string;
    alasan: string;
    jatahPersen: string; 
    jatahNominal: number;
  }[];
}

type PartialAhliWaris = Pick<AhliWaris, 'id' | 'nama' | 'hubungan' | 'statusHidup' | 'parentId'>;
type PartialJenazah = Pick<Jenazah, 'id' | 'gender' | 'hartaKotor' | 'utang' | 'wasiat'>;

export function calculateFaraid(jenazah: PartialJenazah, ahliWarisList: PartialAhliWaris[]): FaraidResult {
  const hartaKotor = jenazah.hartaKotor;
  const utang = jenazah.utang;
  let wasiat = jenazah.wasiat;
  
  const hartaSetelahUtang = Math.max(0, hartaKotor - utang);
  if (wasiat > hartaSetelahUtang / 3) wasiat = hartaSetelahUtang / 3;
  const hartaBersih = Math.max(0, hartaSetelahUtang - wasiat);

  // Preprocessing: Auto-link 'Cucu' to deceased 'Anak' if parentId is missing
  const deceasedChildren = ahliWarisList.filter(h => 
    (h.hubungan === "Anak Laki-laki" || h.hubungan === "Anak Perempuan") && h.statusHidup === false
  );

  ahliWarisList.forEach(h => {
    const isCucuType = [
      "Cucu Laki-laki", "Cucu Perempuan", 
      "Cucu Laki-laki dari Anak Laki-laki", "Cucu Perempuan dari Anak Laki-laki",
      "Cucu Laki-laki dari Anak Perempuan", "Cucu Perempuan dari Anak Perempuan"
    ].includes(h.hubungan);

    if (isCucuType && !h.parentId) {
      if (h.hubungan.includes("Anak Perempuan")) {
        const deceasedDaughter = deceasedChildren.find(d => d.hubungan === "Anak Perempuan");
        if (deceasedDaughter) h.parentId = deceasedDaughter.id;
      } else {
        const deceasedSon = deceasedChildren.find(d => d.hubungan === "Anak Laki-laki");
        if (deceasedSon) h.parentId = deceasedSon.id;
        else if (deceasedChildren.length > 0) h.parentId = deceasedChildren[0].id;
      }
    }
  });

  let heirs = ahliWarisList.map(a => ({
    ...a,
    status: a.statusHidup === false ? 'Meninggal' : 'Menunggu',
    alasan: a.statusHidup === false ? 'Telah wafat sebelum pewaris.' : '',
    jatahPersen: '',
    jatahNominal: 0,
    fraction: { n: 0, d: 1 }, 
    ashabah: false,
    ashabahRatio: 0,
    raddTarget: false,
  }));

  const count = (hubungan: string) => heirs.filter(h => h.hubungan === hubungan && h.status !== 'Meninggal').length;
  
  const isCucuLkLk = (h: string) => ["Cucu Laki-laki", "Cucu Laki-laki dari Anak Laki-laki"].includes(h);
  const isCucuPrLk = (h: string) => ["Cucu Perempuan", "Cucu Perempuan dari Anak Laki-laki"].includes(h);
  const isCucuLkPr = (h: string) => h === "Cucu Laki-laki dari Anak Perempuan";
  const isCucuPrPr = (h: string) => h === "Cucu Perempuan dari Anak Perempuan";
  const isCucuAny = (h: string) => isCucuLkLk(h) || isCucuPrLk(h) || isCucuLkPr(h) || isCucuPrPr(h);

  const adaAnakLaki = count('Anak Laki-laki') > 0;
  const adaAnakPr = count('Anak Perempuan') > 0;
  const adaCucuLaki = heirs.some(h => (isCucuLkLk(h.hubungan) || isCucuLkPr(h.hubungan)) && h.status !== 'Meninggal');
  const adaCucuPr = heirs.some(h => (isCucuPrLk(h.hubungan) || isCucuPrPr(h.hubungan)) && h.status !== 'Meninggal');
  const adaKeturunan = adaAnakLaki || adaAnakPr || adaCucuLaki || adaCucuPr;
  const adaBapak = count('Ayah') > 0 || count('Bapak') > 0;
  const adaIbu = count('Ibu') > 0;
  const totalSaudara = count('Saudara Laki-laki Sekandung') + count('Saudara Perempuan Sekandung') + count('Saudara Laki-laki Seibu') + count('Saudara Perempuan Seibu');

  // 1. Deteksi Hijab Mahjub (Hirman) & Status Orang Tua Cucu
  heirs = heirs.map(h => {
    if (h.status === 'Meninggal') return h;

    // Cek jika Cucu memiliki parentId yang orang tuanya MASIH HIDUP
    if (isCucuAny(h.hubungan)) {
      if (h.parentId) {
        const parentHeir = ahliWarisList.find(p => p.id === h.parentId);
        if (parentHeir && parentHeir.statusHidup !== false) {
          h.status = 'Mahjub';
          h.alasan = `Mahjub Hirman: Terhalang karena orang tua (${parentHeir.nama || parentHeir.hubungan}) masih hidup dan menerima hak waris secara langsung.`;
          return h;
        }
      }
    }

    if (['Saudara Laki-laki Sekandung', 'Saudara Perempuan Sekandung'].includes(h.hubungan)) {
      if (adaAnakLaki || adaCucuLaki) { h.status = 'Mahjub'; h.alasan = 'Mahjub Hirman: Terhalang oleh keturunan laki-laki (Anak/Cucu Laki-laki).'; }
      else if (adaBapak) { h.status = 'Mahjub'; h.alasan = 'Mahjub Hirman: Terhalang oleh Ayah/Bapak.'; }
    }

    // Mahjub Cucu dari Anak Laki-laki jika ada Anak Laki-laki (Kecuali sebagai AWP KHI jika ayahnya wafat)
    if (isCucuLkLk(h.hubungan) || isCucuPrLk(h.hubungan)) {
      if (adaAnakLaki) {
        // Cek apakah ayahnya sudah meninggal (punya parentId ke anak laki yang wafat)
        const parentHeir = h.parentId ? ahliWarisList.find(p => p.id === h.parentId) : null;
        const isOrangTuaWafat = parentHeir ? parentHeir.statusHidup === false : (h.hubungan.includes("dari Anak Laki-laki"));

        if (!isOrangTuaWafat) {
          h.status = 'Mahjub';
          h.alasan = 'Mahjub Hirman: Terhalang oleh Anak Laki-laki pewaris yang masih hidup.';
        }
      }
    }

    if (isCucuPrLk(h.hubungan) && count('Anak Perempuan') >= 2 && !adaCucuLaki) {
      const parentHeir = h.parentId ? ahliWarisList.find(p => p.id === h.parentId) : null;
      const isOrangTuaWafat = parentHeir ? parentHeir.statusHidup === false : (h.hubungan.includes("dari Anak Laki-laki"));
      if (!isOrangTuaWafat) {
        h.status = 'Mahjub';
        h.alasan = 'Mahjub Hirman: Terhalang karena bagian 2/3 Anak Perempuan telah terpenuhi.';
      }
    }

    if (h.hubungan === 'Kakek' && adaBapak) { h.status = 'Mahjub'; h.alasan = 'Mahjub Hirman: Terhalang oleh Ayah/Bapak.'; }
    if (h.hubungan === 'Nenek' && adaIbu) { h.status = 'Mahjub'; h.alasan = 'Mahjub Hirman: Terhalang oleh Ibu.'; }
    if (['Saudara Laki-laki Seibu', 'Saudara Perempuan Seibu'].includes(h.hubungan)) {
      if (adaKeturunan) {
        h.status = 'Mahjub';
        h.alasan = 'Mahjub Hirman: Terhalang oleh adanya keturunan (Anak/Cucu).';
      } else if (adaBapak || count('Kakek') > 0) {
        h.status = 'Mahjub';
        h.alasan = 'Mahjub Hirman: Terhalang oleh Ayah/Bapak/Kakek.';
      }
    }
    return h;
  });

  // 2. Deteksi Kasus Khusus (Gharrawain)
  const isGharrawainHusband = count('Suami') === 1 && adaIbu && adaBapak && !adaKeturunan && totalSaudara < 2;
  const isGharrawainWife = count('Istri') > 0 && adaIbu && adaBapak && !adaKeturunan && totalSaudara < 2;
  const isSpecialGharrawain = isGharrawainHusband || isGharrawainWife;

  const activeHeirs = heirs.filter(h => h.status !== 'Mahjub' && h.status !== 'Meninggal');
  const countActive = (hubungan: string) => activeHeirs.filter(h => h.hubungan === hubungan).length;

  // Helper count active cucu
  const activeCucuLkLk = activeHeirs.filter(h => isCucuLkLk(h.hubungan)).length;
  const activeCucuPrLk = activeHeirs.filter(h => isCucuPrLk(h.hubungan)).length;
  const activeCucuLkPr = activeHeirs.filter(h => isCucuLkPr(h.hubungan)).length;
  const activeCucuPrPr = activeHeirs.filter(h => isCucuPrPr(h.hubungan)).length;

  // 3. Distribusi Porsi (Dzawil Furud & Ashabah)
  activeHeirs.forEach(h => {
    if (h.hubungan === 'Suami') {
      h.fraction = adaKeturunan ? { n: 1, d: 4 } : { n: 1, d: 2 };
      h.jatahPersen = adaKeturunan ? '1/4' : '1/2';
      h.alasan = `Fardhu ${h.jatahPersen} karena pewaris ${adaKeturunan ? 'memiliki' : 'tidak memiliki'} keturunan.`;
      h.status = 'Mewarisi';
    }
    if (h.hubungan === 'Istri') {
      const totalI = countActive('Istri');
      h.fraction = adaKeturunan ? { n: 1, d: 8 * totalI } : { n: 1, d: 4 * totalI };
      h.jatahPersen = totalI > 1 ? `${adaKeturunan ? '1/8' : '1/4'} (Bagi ${totalI})` : (adaKeturunan ? '1/8' : '1/4');
      h.alasan = `Fardhu ${adaKeturunan ? '1/8' : '1/4'} karena pewaris ${adaKeturunan ? 'memiliki' : 'tidak memiliki'} keturunan${totalI > 1 ? ` (dibagi rata ${totalI} istri)` : ''}.`;
      h.status = 'Mewarisi';
    }
    if (h.hubungan === 'Ibu') {
      if (isSpecialGharrawain) {
        h.status = 'Mewarisi';
        h.raddTarget = true;
      } else {
        const banyakSdr = totalSaudara >= 2;
        h.fraction = (adaKeturunan || banyakSdr) ? { n: 1, d: 6 } : { n: 1, d: 3 };
        h.jatahPersen = (adaKeturunan || banyakSdr) ? '1/6' : '1/3';
        h.alasan = `Fardhu ${h.jatahPersen} karena pewaris ${adaKeturunan ? 'memiliki keturunan' : (banyakSdr ? 'mempunyai banyak saudara' : 'tidak memiliki keturunan/banyak saudara')}.`;
        h.status = 'Mewarisi';
        h.raddTarget = true;
      }
    }
    if (h.hubungan === 'Ayah' || h.hubungan === 'Bapak') {
      if (isSpecialGharrawain) {
        h.status = 'Mewarisi'; h.ashabah = true; h.ashabahRatio = 1; 
        h.alasan = 'Mendapat Sisa (Ashabah) setelah bagian Istri/Suami dan Ibu (Tsulutsul Baqi) dibagikan.';
      } else if (adaAnakLaki || adaCucuLaki) {
        h.fraction = { n: 1, d: 6 }; h.jatahPersen = '1/6'; h.status = 'Mewarisi';
        h.alasan = 'Fardhu 1/6 karena ada keturunan laki-laki (anak/cucu).';
      } else if (adaAnakPr || adaCucuPr) {
        h.fraction = { n: 1, d: 6 }; h.jatahPersen = '1/6 + Ashabah'; h.status = 'Mewarisi'; h.ashabah = true; h.ashabahRatio = 1;
        h.alasan = 'Fardhu 1/6 ditambah sisa harta (Ashabah) karena hanya ada keturunan perempuan.';
      } else {
        h.ashabah = true; h.status = 'Mewarisi'; h.ashabahRatio = 1; h.jatahPersen = 'Ashabah';
        h.alasan = 'Mendapat seluruh sisa harta (Ashabah) karena tidak ada keturunan.';
      }
    }
    if (h.hubungan === 'Kakek') {
      if (adaAnakLaki || adaCucuLaki) {
        h.fraction = { n: 1, d: 6 }; h.jatahPersen = '1/6'; h.status = 'Mewarisi';
        h.alasan = 'Fardhu 1/6 menggantikan Ayah karena ada keturunan laki-laki.';
      } else if (adaAnakPr || adaCucuPr) {
        h.fraction = { n: 1, d: 6 }; h.jatahPersen = '1/6 + Ashabah'; h.status = 'Mewarisi'; h.ashabah = true; h.ashabahRatio = 1;
        h.alasan = 'Fardhu 1/6 ditambah sisa menggantikan Ayah karena hanya ada keturunan perempuan.';
      } else {
        h.ashabah = true; h.status = 'Mewarisi'; h.ashabahRatio = 1; h.jatahPersen = 'Ashabah';
        h.alasan = 'Mendapat sisa harta (Ashabah) menggantikan Ayah karena tidak ada keturunan.';
      }
    }
    if (h.hubungan === 'Nenek') {
      const totalNenek = countActive('Nenek');
      h.fraction = { n: 1, d: 6 * totalNenek };
      h.jatahPersen = totalNenek > 1 ? `1/6 (Bagi ${totalNenek})` : '1/6';
      h.alasan = `Fardhu 1/6 menggantikan Ibu${totalNenek > 1 ? ` (dibagi rata ${totalNenek} nenek)` : ''}.`;
      h.status = 'Mewarisi';
      h.raddTarget = true;
    }
    if (h.hubungan === 'Anak Perempuan') {
      if (adaAnakLaki) {
        h.ashabah = true; h.status = 'Mewarisi'; h.ashabahRatio = 1; h.jatahPersen = 'Ashabah (1:2)';
        h.alasan = 'Menjadi Ashabah bil Ghair bersama anak laki-laki dengan perbandingan 1:2.';
      } else {
        const totalAP = countActive('Anak Perempuan');
        h.fraction = totalAP === 1 ? { n: 1, d: 2 } : { n: 2, d: 3 * totalAP };
        h.jatahPersen = totalAP === 1 ? '1/2' : `2/3 (Bagi ${totalAP})`;
        h.alasan = `Fardhu ${h.jatahPersen} karena merupakan anak perempuan ${totalAP === 1 ? 'tunggal' : 'berjumlah '+totalAP}.`;
        h.status = 'Mewarisi'; h.raddTarget = true;
      }
    }
    if (h.hubungan === 'Anak Laki-laki') {
      h.ashabah = true; h.status = 'Mewarisi'; 
      h.ashabahRatio = adaAnakPr ? 2 : 1; 
      h.jatahPersen = adaAnakPr ? 'Ashabah (2:1)' : 'Ashabah';
      h.alasan = adaAnakPr ? 'Mendapat sisa harta (Ashabah) dengan porsi 2x lipat dari anak perempuan.' : 'Mendapat sisa harta (Ashabah) sebagai keturunan laki-laki utama.';
    }

    // Cucu Laki-laki dari Anak Laki-laki
    if (isCucuLkLk(h.hubungan)) {
      if (adaAnakLaki) {
        // Ahli Waris Pengganti (AWP) menurut KHI Pasal 185
        h.ashabah = true; h.status = 'Mewarisi';
        h.ashabahRatio = activeCucuPrLk > 0 ? 2 : 1;
        h.jatahPersen = 'Ashabah (AWP KHI Pasal 185)';
        h.alasan = 'Ahli Waris Pengganti (KHI Pasal 185): Menggantikan posisi ayah (anak laki-laki) yang wafat terlebih dahulu.';
      } else {
        h.ashabah = true; h.status = 'Mewarisi';
        h.ashabahRatio = activeCucuPrLk > 0 ? 2 : 1;
        h.jatahPersen = activeCucuPrLk > 0 ? 'Ashabah (2:1)' : 'Ashabah';
        h.alasan = activeCucuPrLk > 0 ? 'Mendapat sisa harta (Ashabah) bersama cucu perempuan dari anak laki-laki (2:1).' : 'Mendapat sisa harta (Ashabah) menggantikan anak laki-laki.';
      }
    }

    // Cucu Perempuan dari Anak Laki-laki
    if (isCucuPrLk(h.hubungan)) {
      if (activeCucuLkLk > 0) {
        h.ashabah = true; h.status = 'Mewarisi'; h.ashabahRatio = 1; h.jatahPersen = 'Ashabah (1:2)';
        h.alasan = 'Menjadi Ashabah bil Ghair bersama cucu laki-laki dari anak laki-laki (1:2).';
      } else if (countActive('Anak Perempuan') === 1) {
        const totalCP = activeCucuPrLk;
        h.fraction = { n: 1, d: 6 * totalCP };
        h.jatahPersen = totalCP === 1 ? '1/6' : `1/6 (Bagi ${totalCP})`;
        h.alasan = `Fardhu ${h.jatahPersen} sebagai penyempurna 2/3 (takmilah ats-tsulutsain) bersama 1 anak perempuan.`;
        h.status = 'Mewarisi'; h.raddTarget = true;
      } else if (countActive('Anak Perempuan') === 0) {
        const totalCP = activeCucuPrLk;
        h.fraction = totalCP === 1 ? { n: 1, d: 2 } : { n: 2, d: 3 * totalCP };
        h.jatahPersen = totalCP === 1 ? '1/2' : `2/3 (Bagi ${totalCP})`;
        h.alasan = `Fardhu ${h.jatahPersen} dari porsi cucu perempuan anak laki-laki (ayah wafat).`;
        h.status = 'Mewarisi'; h.raddTarget = true;
      } else if (adaAnakLaki) {
        // AWP KHI
        h.ashabah = true; h.status = 'Mewarisi'; h.ashabahRatio = 1;
        h.jatahPersen = 'Ashabah (AWP KHI Pasal 185)';
        h.alasan = 'Ahli Waris Pengganti (KHI Pasal 185): Menggantikan posisi ayah (anak laki-laki) yang wafat terlebih dahulu.';
      }
    }

    // Cucu Laki-laki / Perempuan dari Anak Perempuan (AWP KHI Pasal 185)
    if (isCucuLkPr(h.hubungan) || isCucuPrPr(h.hubungan)) {
      const isLk = isCucuLkPr(h.hubungan);
      const totalCucuPrLine = activeCucuLkPr + activeCucuPrPr;
      if (adaAnakLaki || adaAnakPr) {
        h.ashabah = true; h.status = 'Mewarisi';
        h.ashabahRatio = (isLk && activeCucuPrPr > 0) ? 2 : 1;
        h.jatahPersen = 'Ashabah (AWP KHI Pasal 185)';
        h.alasan = 'Ahli Waris Pengganti (KHI Pasal 185): Menggantikan kedudukan ibu (anak perempuan) yang wafat terlebih dahulu.';
      } else {
        // Jika tidak ada anak sama sekali, cucu dari anak perempuan mewarisi fardhu ibunya / AWP
        const totalCP = totalCucuPrLine;
        h.fraction = totalCP === 1 ? { n: 1, d: 2 } : { n: 2, d: 3 * totalCP };
        h.jatahPersen = totalCP === 1 ? '1/2 (AWP)' : `2/3 (Bagi ${totalCP} AWP)`;
        h.alasan = `Menerima porsi Fardhu menggantikan kedudukan ibu (anak perempuan) yang wafat lebih dahulu.`;
        h.status = 'Mewarisi'; h.raddTarget = true;
      }
    }
    if (h.hubungan === 'Saudara Laki-laki Sekandung') {
      h.ashabah = true; h.status = 'Mewarisi';
      const adaSdrPr = countActive('Saudara Perempuan Sekandung') > 0;
      h.ashabahRatio = adaSdrPr ? 2 : 1;
      h.jatahPersen = adaSdrPr ? 'Ashabah (2:1)' : 'Ashabah';
      h.alasan = adaSdrPr ? 'Mendapat sisa harta (Ashabah) bersama saudara perempuan sekandung (2:1).' : 'Mendapat sisa harta (Ashabah) karena tidak ada keturunan laki-laki / ayah.';
    }
    if (h.hubungan === 'Saudara Perempuan Sekandung') {
      const adaSdrLk = countActive('Saudara Laki-laki Sekandung') > 0;
      if (adaSdrLk) {
        h.ashabah = true; h.status = 'Mewarisi'; h.ashabahRatio = 1; h.jatahPersen = 'Ashabah (1:2)';
        h.alasan = 'Menjadi Ashabah bil Ghair bersama saudara laki-laki sekandung (1:2).';
      } else if (adaAnakPr || adaCucuPr) {
        h.ashabah = true; h.status = 'Mewarisi'; h.ashabahRatio = 1; h.jatahPersen = 'Ashabah ma\'al Ghair';
        h.alasan = 'Menjadi Ashabah ma\'al Ghair bersama anak/cucu perempuan.';
      } else {
        const totalSPr = countActive('Saudara Perempuan Sekandung');
        h.fraction = totalSPr === 1 ? { n: 1, d: 2 } : { n: 2, d: 3 * totalSPr };
        h.jatahPersen = totalSPr === 1 ? '1/2' : `2/3 (Bagi ${totalSPr})`;
        h.alasan = `Fardhu ${h.jatahPersen} karena tidak ada keturunan, bapak, maupun saudara laki-laki.`;
        h.status = 'Mewarisi'; h.raddTarget = true;
      }
    }
    if (['Saudara Laki-laki Seibu', 'Saudara Perempuan Seibu'].includes(h.hubungan)) {
      const totalSeibu = countActive('Saudara Laki-laki Seibu') + countActive('Saudara Perempuan Seibu');
      if (totalSeibu === 1) {
        h.fraction = { n: 1, d: 6 };
        h.jatahPersen = '1/6';
        h.alasan = 'Fardhu 1/6 (saudara seibu tunggal saat kalalah).';
      } else {
        h.fraction = { n: 1, d: 3 * totalSeibu };
        h.jatahPersen = `1/3 (Bagi ${totalSeibu})`;
        h.alasan = `Fardhu 1/3 dibagi rata antarsaudara seibu (${totalSeibu} orang saat kalalah).`;
      }
      h.status = 'Mewarisi';
      h.raddTarget = true;
    }
  });

  // 4. Kalkulasi Nominal Dasar & Deteksi Gharrawain / Aul / Radd / Normal
  let usedNominal = 0;
  let statusProblem = 'Normal';

  if (isSpecialGharrawain) {
    statusProblem = 'Gharrawain';
    const spouse = activeHeirs.find(h => h.hubungan === 'Suami' || h.hubungan === 'Istri');
    const mother = activeHeirs.find(h => h.hubungan === 'Ibu');
    const father = activeHeirs.find(h => h.hubungan === 'Bapak' || h.hubungan === 'Ayah');
    
    if (spouse && mother && father) {
      const spouseNominal = Math.floor(hartaBersih * (spouse.fraction.n / spouse.fraction.d));
      spouse.jatahNominal = spouseNominal;
      usedNominal += spouseNominal;

      const remainder = hartaBersih - spouseNominal;
      const motherNominal = Math.floor(remainder / 3); // 1/3 of residual
      mother.jatahNominal = motherNominal;
      mother.jatahPersen = isGharrawainHusband ? "1/3 Sisa (1/6 Total)" : "1/3 Sisa (1/4 Total)";
      mother.alasan = `Kasus Gharrawain: Mendapat 1/3 dari SISA harta setelah bagian ${spouse.hubungan} diambil.`;
      usedNominal += motherNominal;

      const fatherNominal = hartaBersih - usedNominal;
      father.jatahNominal = fatherNominal;
      father.jatahPersen = isGharrawainHusband ? "Sisa (1/3 Total)" : "Sisa (1/2 Total)";
      usedNominal = hartaBersih;
    }
  } else {
    // Standard Calculation
    let totalFractionVal = 0;
    activeHeirs.forEach(h => {
      if (h.fraction && h.fraction.n > 0) {
        totalFractionVal += h.fraction.n / h.fraction.d;
      }
    });

    const hasAshabah = activeHeirs.some(h => h.ashabah);

    if (totalFractionVal > 1) {
      statusProblem = 'Aul';
      // Scaled down proportionally for Aul
      activeHeirs.forEach(h => {
        if (h.fraction && h.fraction.n > 0) {
          const prop = (h.fraction.n / h.fraction.d) / totalFractionVal;
          const nominal = Math.floor(hartaBersih * prop);
          h.jatahNominal = nominal;
          h.alasan += ` (Penyesuaian porsi 'Aul).`;
          usedNominal += nominal;
        }
      });
    } else if (totalFractionVal < 1 && !hasAshabah && activeHeirs.length > 0) {
      statusProblem = 'Radd';
      const fuelForRadd = activeHeirs.filter(h => h.raddTarget);
      const raddTotalFractionVal = fuelForRadd.reduce((sum, h) => sum + (h.fraction.n / h.fraction.d), 0);

      const fixedHeirs = activeHeirs.filter(h => !h.raddTarget); // Non-Radd (Spouse)
      fixedHeirs.forEach(h => {
        if (h.fraction && h.fraction.n > 0) {
          const nominal = Math.floor(hartaBersih * (h.fraction.n / h.fraction.d));
          h.jatahNominal = nominal;
          usedNominal += nominal;
        }
      });

      const sisaRadd = hartaBersih - usedNominal;
      if (fuelForRadd.length > 0 && raddTotalFractionVal > 0) {
        fuelForRadd.forEach(h => {
          const prop = (h.fraction.n / h.fraction.d) / raddTotalFractionVal;
          const nominal = Math.floor(sisaRadd * prop);
          h.jatahNominal = nominal;
          if (sisaRadd > 0 && prop < 1) {
            h.alasan += ` (Ditambah porsi pengalihan Radd sebesar Rp ${nominal.toLocaleString('id-ID')}).`;
          }
          usedNominal += nominal;
        });
      } else if (fixedHeirs.length > 0 && sisaRadd > 0) {
        // If ONLY spouse exists and no Radd targets
        fixedHeirs.forEach(h => {
          h.jatahNominal += sisaRadd;
        });
      }
      usedNominal = hartaBersih;
    } else {
      // Normal or Ashabah
      activeHeirs.forEach(h => {
        if (h.fraction && h.fraction.n > 0) {
          const nominal = Math.floor(hartaBersih * (h.fraction.n / h.fraction.d));
          h.jatahNominal = nominal;
          usedNominal += nominal;
        }
      });
    }

    // Ashabah distribution
    const sisa = hartaBersih - usedNominal;
    const totalAshabah = activeHeirs.reduce((sum, h) => sum + (h.ashabahRatio || 0), 0);
    if (sisa > 0 && totalAshabah > 0) {
      activeHeirs.forEach(h => {
        if (h.ashabah && (h.ashabahRatio || 0) > 0) {
          const nominal = Math.floor(sisa * (h.ashabahRatio / totalAshabah));
          h.jatahNominal += nominal;
          if (h.fraction && h.fraction.n > 0) {
            h.alasan += ` (Termasuk porsi sisa/Ashabah sebesar Rp ${nominal.toLocaleString('id-ID')}).`;
          }
        }
      });
    }
  }

  // Calculate KPK for display
  const denominators = activeHeirs.map(h => h.fraction?.d || 1).filter(d => d > 1);
  const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b));
  const lcm = (a: number, b: number): number => (a * b) / gcd(a, b);
  const baseKpk = denominators.length > 0 ? denominators.reduce((acc, curr) => lcm(acc, curr), 1) : 24;

  return {
    hartaBersih,
    kpk: isSpecialGharrawain ? 0 : baseKpk,
    statusAulRadd: statusProblem,
    ahliWarisGetted: heirs.map(h => ({
      ahliWarisId: h.id,
      nama: h.nama,
      hubungan: h.hubungan,
      status: h.status === 'Menunggu' ? (h.jatahNominal > 0 ? 'Mewarisi' : 'Mahjub') : h.status,
      alasan: h.alasan || 'Tidak memenuhi syarat sebagai Dzawil Furud maupun Ashabah dalam skenario ini.',
      jatahPersen: h.jatahPersen || '-',
      jatahNominal: h.jatahNominal,
    }))
  };
}
