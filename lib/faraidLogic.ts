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

type PartialAhliWaris = Pick<AhliWaris, 'id' | 'nama' | 'hubungan'>;
type PartialJenazah = Pick<Jenazah, 'id' | 'gender' | 'hartaKotor' | 'utang' | 'wasiat'>;

export function calculateFaraid(jenazah: PartialJenazah, ahliWarisList: PartialAhliWaris[]): FaraidResult {
  const hartaKotor = jenazah.hartaKotor;
  const utang = jenazah.utang;
  let wasiat = jenazah.wasiat;
  
  const hartaSetelahUtang = Math.max(0, hartaKotor - utang);
  if (wasiat > hartaSetelahUtang / 3) wasiat = hartaSetelahUtang / 3;
  const hartaBersih = Math.max(0, hartaSetelahUtang - wasiat);

  let heirs = ahliWarisList.map(a => ({
    ...a,
    status: 'Menunggu',
    alasan: '',
    jatahPersen: '',
    jatahNominal: 0,
    fraction: { n: 0, d: 1 }, 
    ashabah: false,
    ashabahRatio: 0,
    raddTarget: false,
  }));

  const count = (hubungan: string) => heirs.filter(h => h.hubungan === hubungan).length;
  
  const adaAnakLaki = count('Anak Laki-laki') > 0;
  const adaAnakPr = count('Anak Perempuan') > 0;
  const adaCucuLaki = count('Cucu Laki-laki') > 0;
  const adaCucuPr = count('Cucu Perempuan') > 0;
  const adaKeturunan = adaAnakLaki || adaAnakPr || adaCucuLaki || adaCucuPr;
  const adaBapak = count('Ayah') > 0 || count('Bapak') > 0;
  const adaIbu = count('Ibu') > 0;
  const totalSaudara = count('Saudara Laki-laki Sekandung') + count('Saudara Perempuan Sekandung') + count('Saudara Laki-laki Seibu') + count('Saudara Perempuan Seibu');

  // 1. Deteksi Hijab Mahjub
  heirs = heirs.map(h => {
    if (['Saudara Laki-laki Sekandung', 'Saudara Perempuan Sekandung'].includes(h.hubungan)) {
      if (adaAnakLaki || adaCucuLaki) { h.status = 'Mahjub'; h.alasan = 'Mahjub Hirman: Terhalang oleh keturunan laki-laki.'; }
      else if (adaBapak) { h.status = 'Mahjub'; h.alasan = 'Mahjub Hirman: Terhalang oleh Bapak.'; }
    }
    if (['Cucu Laki-laki', 'Cucu Perempuan'].includes(h.hubungan)) {
      if (adaAnakLaki) { h.status = 'Mahjub'; h.alasan = 'Mahjub Hirman: Terhalang oleh Anak Laki-laki.'; }
    }
    if (h.hubungan === 'Kakek' && adaBapak) { h.status = 'Mahjub'; h.alasan = 'Mahjub Hirman: Terhalang oleh Bapak.'; }
    if (h.hubungan === 'Nenek' && adaIbu) { h.status = 'Mahjub'; h.alasan = 'Mahjub Hirman: Terhalang oleh Ibu.'; }
    return h;
  });

  // 2. Deteksi Kasus Khusus (Gharrawain)
  const isGharrawainHusband = count('Suami') === 1 && adaIbu && adaBapak && !adaKeturunan && totalSaudara < 2;
  const isGharrawainWife = count('Istri') > 0 && adaIbu && adaBapak && !adaKeturunan && totalSaudara < 2;
  const isSpecialGharrawain = isGharrawainHusband || isGharrawainWife;

  const activeHeirs = heirs.filter(h => h.status !== 'Mahjub');
  
  // 3. Distribusi Porsi (Dzawil Furud)
  activeHeirs.forEach(h => {
    if (h.hubungan === 'Suami') {
      h.fraction = adaKeturunan ? { n: 1, d: 4 } : { n: 1, d: 2 };
      h.jatahPersen = adaKeturunan ? '1/4' : '1/2';
      h.alasan = `Fardhu ${h.jatahPersen} karena istri ${adaKeturunan ? 'memiliki' : 'tidak memiliki'} keturunan.`;
      h.status = 'Mewarisi';
    }
    if (h.hubungan === 'Istri') {
      const totalI = count('Istri');
      h.fraction = adaKeturunan ? { n: 1, d: 8 * totalI } : { n: 1, d: 4 * totalI };
      h.jatahPersen = `${adaKeturunan ? '1/8' : '1/4'} (Bagi ${totalI})`;
      h.alasan = `Fardhu ${adaKeturunan ? '1/8' : '1/4'} karena suami ${adaKeturunan ? 'memiliki' : 'tidak memiliki'} keturunan (bagi rata ${totalI} istri).`;
      h.status = 'Mewarisi';
    }
    if (h.hubungan === 'Ibu') {
      if (isSpecialGharrawain) {
        h.status = 'Mewarisi';
        h.raddTarget = true;
        // In Gharrawain, Mother gets 1/3 of REMAINDER.
        // We handle this by setting a special case later in nominal calculation
      } else {
        const banyakSdr = totalSaudara >= 2;
        h.fraction = (adaKeturunan || banyakSdr) ? { n: 1, d: 6 } : { n: 1, d: 3 };
        h.jatahPersen = (adaKeturunan || banyakSdr) ? '1/6' : '1/3';
        h.alasan = `Fardhu ${h.jatahPersen} karena jenazah ${adaKeturunan ? 'memiliki keturunan' : (banyakSdr ? 'mempunyai banyak saudara' : 'tidak memiliki keturunan/banyak saudara')}.`;
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
        h.alasan = 'Fardhu 1/6 karena ada anak/cucu laki-laki.';
      } else if (adaAnakPr || adaCucuPr) {
        h.fraction = { n: 1, d: 6 }; h.jatahPersen = '1/6 + Ashabah'; h.status = 'Mewarisi'; h.ashabah = true; h.ashabahRatio = 1;
        h.alasan = 'Fardhu 1/6 ditambah sisa karena hanya ada anak/cucu perempuan.';
      } else {
        h.ashabah = true; h.status = 'Mewarisi'; h.ashabahRatio = 1; h.jatahPersen = 'Ashabah';
        h.alasan = 'Mendapat seluruh sisa harta (Ashabah) karena tidak ada keturunan.';
      }
    }
    if (h.hubungan === 'Anak Perempuan') {
      if (adaAnakLaki) {
        h.ashabah = true; h.status = 'Mewarisi'; h.ashabahRatio = 1; h.jatahPersen = 'Ashabah (1:2)';
        h.alasan = 'Menjadi Ashabah bil Ghair karena ada anak laki-laki dengan perbandingan 1:2.';
      } else {
        const totalAP = count('Anak Perempuan');
        h.fraction = totalAP === 1 ? { n: 1, d: 2 } : { n: 2, d: 3 * totalAP };
        h.jatahPersen = totalAP === 1 ? '1/2' : `2/3 (Bagi ${totalAP})`;
        h.alasan = `Fardhu ${h.jatahPersen} karena merupakan anak perempuan ${totalAP === 1 ? 'tunggal' : 'berjumlah '+totalAP}.`;
        h.status = 'Mewarisi'; h.raddTarget = true;
      }
    }
    if (h.hubungan === 'Anak Laki-laki') {
      h.ashabah = true; h.status = 'Mewarisi'; h.ashabahRatio = 2; h.jatahPersen = 'Ashabah (2:1)';
      h.alasan = 'Mendapat sisa harta (Ashabah) dengan porsi 2x lipat dari anak perempuan.';
    }
  });

  // 4. Kalkulasi Nominal Dasar & Deteksi Gharrawain
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
    // Standard Calculation (Aul / Radd / Normal)
    let kpk = 24; 
    let totalNum = 0;
    activeHeirs.forEach(h => { if (h.fraction.n > 0) totalNum += (h.fraction.n * (kpk / h.fraction.d)); });

    if (totalNum > kpk) {
      statusProblem = 'Aul'; kpk = totalNum;
    } else if (totalNum < kpk && activeHeirs.every(h => !h.ashabah)) {
      statusProblem = 'Radd';
      // Radd logic: Surplus given back to Dzawil Furud (Prop) excluding Spouse
      const fuelForRadd = activeHeirs.filter(h => h.raddTarget);
      const raddTotalNum = fuelForRadd.reduce((sum, h) => sum + (h.fraction.n * (kpk / h.fraction.d)), 0);
      
      const fixedHeirs = activeHeirs.filter(h => !h.raddTarget); // Non-Radd (Spouse)
      fixedHeirs.forEach(h => {
        const nominal = Math.floor(hartaBersih * (h.fraction.n / h.fraction.d));
        h.jatahNominal = nominal;
        usedNominal += nominal;
      });

      const sisaRadd = hartaBersih - usedNominal;
      fuelForRadd.forEach(h => {
        const prop = (h.fraction.n * (kpk / h.fraction.d)) / raddTotalNum;
        const nominal = Math.floor(sisaRadd * prop);
        h.jatahNominal = nominal;
        h.alasan += ` (Ditambah porsi pengalihan Radd sebesar Rp ${nominal.toLocaleString('id-ID')}).`;
        usedNominal += nominal;
      });
      usedNominal = hartaBersih; // Force balance
    } else {
      // Normal or Ashabah
      activeHeirs.forEach(h => {
        if (h.fraction.n > 0) {
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
        if (h.ashabah && h.ashabahRatio > 0) {
          const nominal = Math.floor(sisa * (h.ashabahRatio / totalAshabah));
          h.jatahNominal += nominal;
          h.alasan += ` (Termasuk porsi sisa/Ashabah).`;
        }
      });
    }
  }

  return {
    hartaBersih,
    kpk: isSpecialGharrawain ? 0 : 24, // KPK less relevant for special cases
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
