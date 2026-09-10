export interface HubunganOption {
  value: string;
  label: string;
  subtext: string;
}

export const HUBUNGAN_OPTIONS: HubunganOption[] = [
  { value: "Suami", label: "Suami", subtext: "Pasangan hidup pewaris (Laki-laki)" },
  { value: "Istri", label: "Istri", subtext: "Pasangan hidup pewaris (Perempuan)" },
  { value: "Anak Laki-laki", label: "Anak Laki-laki", subtext: "Anak kandung laki-laki (Ashabah Utama)" },
  { value: "Anak Perempuan", label: "Anak Perempuan", subtext: "Anak kandung perempuan (Dzawil Furud / Ashabah)" },
  { value: "Cucu Laki-laki", label: "Cucu Laki-laki (dari Anak Laki-laki)", subtext: "Cucu laki-laki dari anak laki-laki almarhum" },
  { value: "Cucu Perempuan", label: "Cucu Perempuan (dari Anak Laki-laki)", subtext: "Cucu perempuan dari anak laki-laki almarhum" },
  { value: "Cucu Laki-laki dari Anak Laki-laki", label: "Cucu Laki-laki dari Anak Laki-laki (Ayah Wafat)", subtext: "Cucu laki-laki dari anak laki-laki yang telah meninggal lebih dahulu" },
  { value: "Cucu Perempuan dari Anak Laki-laki", label: "Cucu Perempuan dari Anak Laki-laki (Ayah Wafat)", subtext: "Cucu perempuan dari anak laki-laki yang telah meninggal lebih dahulu" },
  { value: "Cucu Laki-laki dari Anak Perempuan", label: "Cucu Laki-laki dari Anak Perempuan (Ibu Wafat)", subtext: "Cucu laki-laki dari anak perempuan yang telah meninggal (Ahli Waris Pengganti)" },
  { value: "Cucu Perempuan dari Anak Perempuan", label: "Cucu Perempuan dari Anak Perempuan (Ibu Wafat)", subtext: "Cucu perempuan dari anak perempuan yang telah meninggal (Ahli Waris Pengganti)" },
  { value: "Ayah", label: "Ayah", subtext: "Bapak kandung pewaris (Dzawil Furud / Ashabah)" },
  { value: "Ibu", label: "Ibu", subtext: "Ibu kandung pewaris (Dzawil Furud)" },
  { value: "Kakek", label: "Kakek", subtext: "Kakek kandung dari jalur ayah" },
  { value: "Nenek", label: "Nenek", subtext: "Nenek kandung dari jalur ibu / ayah" },
  { value: "Saudara Laki-laki Sekandung", label: "Saudara Laki-laki Sekandung", subtext: "Saudara kandung laki-laki (Seayah & Seibu)" },
  { value: "Saudara Perempuan Sekandung", label: "Saudara Perempuan Sekandung", subtext: "Saudara kandung perempuan (Seayah & Seibu)" },
  { value: "Saudara Laki-laki Seibu", label: "Saudara Laki-laki Seibu", subtext: "Saudara laki-laki seibu (Kalalah)" },
  { value: "Saudara Perempuan Seibu", label: "Saudara Perempuan Seibu", subtext: "Saudara perempuan seibu (Kalalah)" },
];

export const HUBUNGAN_ARRAY = HUBUNGAN_OPTIONS.map((o) => o.value);

export const GENDER_OPTIONS = [
  { value: "Laki-laki", label: "Laki-laki", subtext: "Almarhum / Pewaris Laki-laki" },
  { value: "Perempuan", label: "Perempuan", subtext: "Almarhumah / Pewaris Perempuan" },
];

export const METODE_ADAT_OPTIONS = [
  { value: "SEPIKUL_SEGENDONGAN", label: "Sepikul Segendongan (2:1)", subtext: "Anak laki-laki 2 bagian, anak perempuan 1 bagian" },
  { value: "KUM_KUM_KUPAT", label: "Musyawarah Mufakat (1:1 Sama Rata)", subtext: "Seluruh anak menerima bagian sama besar" },
];

export const HUKUM_SYSTEM_OPTIONS = [
  { value: "syariah", label: "Hukum Syariah (Faraidh)", subtext: "Kompilasi Hukum Islam (KHI)" },
  { value: "perdata", label: "Hukum Perdata (KUHPerdata / BW)", subtext: "Sistem 4 Golongan KUHPerdata" },
  { value: "adat-jawa", label: "Hukum Adat Jawa", subtext: "Sepikul Segendongan / Musyawarah" },
];

export const STATUS_HIDUP_OPTIONS = [
  { value: "Hidup", label: "Masih Hidup", subtext: "Ahli waris aktif yang masih hidup" },
  { value: "Meninggal", label: "Telah Meninggal", subtext: "Wafat sebelum almarhum pewaris" },
];

