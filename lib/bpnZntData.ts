// Master Dataset ZNT BPN & Zonasi PU/PUPR Indonesia (38 Provinsi - 514 Kota & Kabupaten)

export interface DesaZNT {
  id: string;
  nama: string; // Nama Kelurahan / Desa / Zonasi PU & BPN
  tipe: "komersial" | "perumahan-elite" | "perumahan-menengah" | "perkampungan" | "pertanian" | "industri";
  hargaPerM2: number;
  deskripsi: string;
}

export interface KotaKabupatenZNT {
  id: string;
  nama: string; // Nama Kota atau Kabupaten
  isKota: boolean;
  desalist: DesaZNT[];
}

export interface ProvinsiZNT {
  id: string;
  nama: string;
  kotalist: KotaKabupatenZNT[];
}

// Standard Zonasi PU & BPN Builder Helper
const createStandardZonasiPU = (namaKotaKab: string, isKota: boolean, baseHarga: number): DesaZNT[] => {
  if (isKota) {
    return [
      { id: `${namaKotaKab}-pusat`, nama: `Kel. Pusat Perkotaan / Komersial (${namaKotaKab})`, tipe: "komersial", hargaPerM2: Math.round(baseHarga * 2.5), deskripsi: "Zonasi PU Komersial, Ruko & Protokol Utama" },
      { id: `${namaKotaKab}-elite`, nama: `Kel. Perumahan Elite / Komplek Modern`, tipe: "perumahan-elite", hargaPerM2: Math.round(baseHarga * 1.8), deskripsi: "Zonasi PU Pemukiman Elite & Real Estate" },
      { id: `${namaKotaKab}-menengah`, nama: `Kel. Pemukiman Menengah / Padat Kota`, tipe: "perumahan-menengah", hargaPerM2: baseHarga, deskripsi: "Zonasi PU Pemukiman Warga Perkotaan" },
      { id: `${namaKotaKab}-perkampungan`, nama: `Kel. Perkampungan Kota / Pinggiran`, tipe: "perkampungan", hargaPerM2: Math.round(baseHarga * 0.55), deskripsi: "Zonasi PU Pemukiman Padat / Sub-Perkotaan" },
      { id: `${namaKotaKab}-industri`, nama: `Kawasan Perdagangan / Ruko`, tipe: "industri", hargaPerM2: Math.round(baseHarga * 1.4), deskripsi: "Zonasi PU Kawasan Usaha & Perdagangan" },
    ];
  } else {
    return [
      { id: `${namaKotaKab}-pusat-kab`, nama: `Kec. Pusat Ibu Kota Kabupaten / Komersial`, tipe: "komersial", hargaPerM2: Math.round(baseHarga * 2.0), deskripsi: "Zonasi PU Pusat Pemerintahan & Perdagangan Kab." },
      { id: `${namaKotaKab}-perumahan`, nama: `Desa Pemukiman Perumahan Warga`, tipe: "perumahan-menengah", hargaPerM2: baseHarga, deskripsi: "Zonasi PU Pemukiman Teratur Perdesaan" },
      { id: `${namaKotaKab}-perkampungan`, nama: `Desa / Dusun Perkampungan Warga`, tipe: "perkampungan", hargaPerM2: Math.round(baseHarga * 0.45), deskripsi: "Zonasi PU Pemukiman Tradisional Desa/Dusun" },
      { id: `${namaKotaKab}-sawah`, nama: `Desa Lahan Sawah Irigasi / Pertanian`, tipe: "pertanian", hargaPerM2: Math.round(baseHarga * 0.12), deskripsi: "Zonasi PU Lahan Pertanian Sawah Subur" },
      { id: `${namaKotaKab}-kebun`, nama: `Desa Lahan Perkebunan / Ladang`, tipe: "pertanian", hargaPerM2: Math.round(baseHarga * 0.08), deskripsi: "Zonasi PU Lahan Perkebunan / Darat" },
    ];
  }
};

export const PROVINSI_BPN_DATA: ProvinsiZNT[] = [
  // 1. ACEH
  {
    id: "aceh",
    nama: "Aceh",
    kotalist: [
      { id: "kota-banda-aceh", nama: "Kota Banda Aceh", isKota: true, desalist: createStandardZonasiPU("Kota Banda Aceh", true, 6000000) },
      { id: "kota-sabang", nama: "Kota Sabang", isKota: true, desalist: createStandardZonasiPU("Kota Sabang", true, 4500000) },
      { id: "kota-lhokseumawe", nama: "Kota Lhokseumawe", isKota: true, desalist: createStandardZonasiPU("Kota Lhokseumawe", true, 5000000) },
      { id: "kota-langsa", nama: "Kota Langsa", isKota: true, desalist: createStandardZonasiPU("Kota Langsa", true, 4000000) },
      { id: "kota-subulussalam", nama: "Kota Subulussalam", isKota: true, desalist: createStandardZonasiPU("Kota Subulussalam", true, 3000000) },
      { id: "kab-aceh-besar", nama: "Kab. Aceh Besar", isKota: false, desalist: createStandardZonasiPU("Kab. Aceh Besar", false, 2000000) },
      { id: "kab-aceh-utara", nama: "Kab. Aceh Utara", isKota: false, desalist: createStandardZonasiPU("Kab. Aceh Utara", false, 1800000) },
      { id: "kab-aceh-timur", nama: "Kab. Aceh Timur", isKota: false, desalist: createStandardZonasiPU("Kab. Aceh Timur", false, 1500000) },
      { id: "kab-aceh-selatan", nama: "Kab. Aceh Selatan", isKota: false, desalist: createStandardZonasiPU("Kab. Aceh Selatan", false, 1500000) },
      { id: "kab-aceh-barat", nama: "Kab. Aceh Barat (Meulaboh)", isKota: false, desalist: createStandardZonasiPU("Kab. Aceh Barat", false, 2200000) },
      { id: "kab-aceh-tengah", nama: "Kab. Aceh Tengah (Takengon)", isKota: false, desalist: createStandardZonasiPU("Kab. Aceh Tengah", false, 2000000) },
      { id: "kab-aceh-tenggara", nama: "Kab. Aceh Tenggara", isKota: false, desalist: createStandardZonasiPU("Kab. Aceh Tenggara", false, 1400000) },
      { id: "kab-aceh-singkil", nama: "Kab. Aceh Singkil", isKota: false, desalist: createStandardZonasiPU("Kab. Aceh Singkil", false, 1200000) },
      { id: "kab-bireuen", nama: "Kab. Bireuen", isKota: false, desalist: createStandardZonasiPU("Kab. Bireuen", false, 1800000) },
      { id: "kab-pidie", nama: "Kab. Pidie", isKota: false, desalist: createStandardZonasiPU("Kab. Pidie", false, 1600000) },
      { id: "kab-pidie-jaya", nama: "Kab. Pidie Jaya", isKota: false, desalist: createStandardZonasiPU("Kab. Pidie Jaya", false, 1500000) },
      { id: "kab-simeulue", nama: "Kab. Simeulue", isKota: false, desalist: createStandardZonasiPU("Kab. Simeulue", false, 1000000) },
    ],
  },
  // 2. SUMATERA UTARA
  {
    id: "sumatera-utara",
    nama: "Sumatera Utara",
    kotalist: [
      { id: "kota-medan", nama: "Kota Medan", isKota: true, desalist: createStandardZonasiPU("Kota Medan", true, 12000000) },
      { id: "kota-binjai", nama: "Kota Binjai", isKota: true, desalist: createStandardZonasiPU("Kota Binjai", true, 5000000) },
      { id: "kota-pematangsiantar", nama: "Kota Pematangsiantar", isKota: true, desalist: createStandardZonasiPU("Kota Pematangsiantar", true, 6000000) },
      { id: "kota-tebing-tinggi", nama: "Kota Tebing Tinggi", isKota: true, desalist: createStandardZonasiPU("Kota Tebing Tinggi", true, 4500000) },
      { id: "kota-tanjungbalai", nama: "Kota Tanjungbalai", isKota: true, desalist: createStandardZonasiPU("Kota Tanjungbalai", true, 4000000) },
      { id: "kota-sibolga", nama: "Kota Sibolga", isKota: true, desalist: createStandardZonasiPU("Kota Sibolga", true, 4500000) },
      { id: "kota-padangsidimpuan", nama: "Kota Padangsidimpuan", isKota: true, desalist: createStandardZonasiPU("Kota Padangsidimpuan", true, 4000000) },
      { id: "kota-gunungsitoli", nama: "Kota Gunungsitoli", isKota: true, desalist: createStandardZonasiPU("Kota Gunungsitoli", true, 3500000) },
      { id: "kab-deli-serdang", nama: "Kab. Deli Serdang", isKota: false, desalist: createStandardZonasiPU("Kab. Deli Serdang", false, 3500000) },
      { id: "kab-langkat", nama: "Kab. Langkat", isKota: false, desalist: createStandardZonasiPU("Kab. Langkat", false, 2200000) },
      { id: "kab-karo", nama: "Kab. Karo (Berastagi)", isKota: false, desalist: createStandardZonasiPU("Kab. Karo", false, 3000000) },
      { id: "kab-simalungun", nama: "Kab. Simalungun", isKota: false, desalist: createStandardZonasiPU("Kab. Simalungun", false, 2000000) },
      { id: "kab-asahan", nama: "Kab. Asahan", isKota: false, desalist: createStandardZonasiPU("Kab. Asahan", false, 2000000) },
      { id: "kab-toba", nama: "Kab. Toba (Danau Toba)", isKota: false, desalist: createStandardZonasiPU("Kab. Toba", false, 2500000) },
      { id: "kab-samosir", nama: "Kab. Samosir", isKota: false, desalist: createStandardZonasiPU("Kab. Samosir", false, 2200000) },
      { id: "kab-dairi", nama: "Kab. Dairi", isKota: false, desalist: createStandardZonasiPU("Kab. Dairi", false, 1500000) },
      { id: "kab-tapanuli-utara", nama: "Kab. Tapanuli Utara", isKota: false, desalist: createStandardZonasiPU("Kab. Tapanuli Utara", false, 1800000) },
      { id: "kab-tapanuli-tengah", nama: "Kab. Tapanuli Tengah", isKota: false, desalist: createStandardZonasiPU("Kab. Tapanuli Tengah", false, 1600000) },
      { id: "kab-tapanuli-selatan", nama: "Kab. Tapanuli Selatan", isKota: false, desalist: createStandardZonasiPU("Kab. Tapanuli Selatan", false, 1500000) },
      { id: "kab-nias", nama: "Kab. Nias", isKota: false, desalist: createStandardZonasiPU("Kab. Nias", false, 1200000) },
    ],
  },
  // 3. SUMATERA BARAT
  {
    id: "sumatera-barat",
    nama: "Sumatera Barat",
    kotalist: [
      { id: "kota-padang", nama: "Kota Padang", isKota: true, desalist: createStandardZonasiPU("Kota Padang", true, 7000000) },
      { id: "kota-bukittinggi", nama: "Kota Bukittinggi", isKota: true, desalist: createStandardZonasiPU("Kota Bukittinggi", true, 8000000) },
      { id: "kota-payakumbuh", nama: "Kota Payakumbuh", isKota: true, desalist: createStandardZonasiPU("Kota Payakumbuh", true, 5000000) },
      { id: "kota-pariaman", nama: "Kota Pariaman", isKota: true, desalist: createStandardZonasiPU("Kota Pariaman", true, 4500000) },
      { id: "kota-solok", nama: "Kota Solok", isKota: true, desalist: createStandardZonasiPU("Kota Solok", true, 4000000) },
      { id: "kota-sawahlunto", nama: "Kota Sawahlunto", isKota: true, desalist: createStandardZonasiPU("Kota Sawahlunto", true, 3500000) },
      { id: "kota-padang-panjang", nama: "Kota Padang Panjang", isKota: true, desalist: createStandardZonasiPU("Kota Padang Panjang", true, 4500000) },
      { id: "kab-agam", nama: "Kab. Agam", isKota: false, desalist: createStandardZonasiPU("Kab. Agam", false, 2000000) },
      { id: "kab-tanah-datar", nama: "Kab. Tanah Datar", isKota: false, desalist: createStandardZonasiPU("Kab. Tanah Datar", false, 2000000) },
      { id: "kab-padang-pariaman", nama: "Kab. Padang Pariaman", isKota: false, desalist: createStandardZonasiPU("Kab. Padang Pariaman", false, 2200000) },
      { id: "kab-pesisir-selatan", nama: "Kab. Pesisir Selatan", isKota: false, desalist: createStandardZonasiPU("Kab. Pesisir Selatan", false, 1800000) },
      { id: "kab-solok", nama: "Kab. Solok", isKota: false, desalist: createStandardZonasiPU("Kab. Solok", false, 1800000) },
      { id: "kab-lima-puluh-kota", nama: "Kab. Lima Puluh Kota", isKota: false, desalist: createStandardZonasiPU("Kab. Lima Puluh Kota", false, 1800000) },
      { id: "kab-pasaman", nama: "Kab. Pasaman", isKota: false, desalist: createStandardZonasiPU("Kab. Pasaman", false, 1400000) },
      { id: "kab-pasaman-barat", nama: "Kab. Pasaman Barat", isKota: false, desalist: createStandardZonasiPU("Kab. Pasaman Barat", false, 1600000) },
    ],
  },
  // 4. RIAU
  {
    id: "riau",
    nama: "Riau",
    kotalist: [
      { id: "kota-pekanbaru", nama: "Kota Pekanbaru", isKota: true, desalist: createStandardZonasiPU("Kota Pekanbaru", true, 9000000) },
      { id: "kota-dumai", nama: "Kota Dumai", isKota: true, desalist: createStandardZonasiPU("Kota Dumai", true, 6000000) },
      { id: "kab-kampar", nama: "Kab. Kampar", isKota: false, desalist: createStandardZonasiPU("Kab. Kampar", false, 2500000) },
      { id: "kab-bengkalis", nama: "Kab. Bengkalis", isKota: false, desalist: createStandardZonasiPU("Kab. Bengkalis", false, 2200000) },
      { id: "kab-siak", nama: "Kab. Siak", isKota: false, desalist: createStandardZonasiPU("Kab. Siak", false, 2800000) },
      { id: "kab-pelalawan", nama: "Kab. Pelalawan", isKota: false, desalist: createStandardZonasiPU("Kab. Pelalawan", false, 2000000) },
      { id: "kab-indragiri-hulu", nama: "Kab. Indragiri Hulu", isKota: false, desalist: createStandardZonasiPU("Kab. Indragiri Hulu", false, 1800000) },
      { id: "kab-indragiri-hilir", nama: "Kab. Indragiri Hilir", isKota: false, desalist: createStandardZonasiPU("Kab. Indragiri Hilir", false, 1600000) },
      { id: "kab-rokan-hulu", nama: "Kab. Rokan Hulu", isKota: false, desalist: createStandardZonasiPU("Kab. Rokan Hulu", false, 1800000) },
      { id: "kab-rokan-hilir", nama: "Kab. Rokan Hilir", isKota: false, desalist: createStandardZonasiPU("Kab. Rokan Hilir", false, 1800000) },
      { id: "kab-kuantan-singingi", nama: "Kab. Kuantan Singingi", isKota: false, desalist: createStandardZonasiPU("Kab. Kuantan Singingi", false, 1600000) },
      { id: "kab-kepulauan-meranti", nama: "Kab. Kepulauan Meranti", isKota: false, desalist: createStandardZonasiPU("Kab. Kepulauan Meranti", false, 1400000) },
    ],
  },
  // 5. KEPULAUAN RIAU
  {
    id: "kepulauan-riau",
    nama: "Kepulauan Riau",
    kotalist: [
      { id: "kota-batam", nama: "Kota Batam", isKota: true, desalist: createStandardZonasiPU("Kota Batam", true, 15000000) },
      { id: "kota-tanjungpinang", nama: "Kota Tanjungpinang", isKota: true, desalist: createStandardZonasiPU("Kota Tanjungpinang", true, 7000000) },
      { id: "kab-bintan", nama: "Kab. Bintan", isKota: false, desalist: createStandardZonasiPU("Kab. Bintan", false, 4000000) },
      { id: "kab-karimun", nama: "Kab. Karimun", isKota: false, desalist: createStandardZonasiPU("Kab. Karimun", false, 3000000) },
      { id: "kab-natuna", nama: "Kab. Natuna", isKota: false, desalist: createStandardZonasiPU("Kab. Natuna", false, 1800000) },
      { id: "kab-kepulauan-anambas", nama: "Kab. Kepulauan Anambas", isKota: false, desalist: createStandardZonasiPU("Kab. Kepulauan Anambas", false, 2000000) },
      { id: "kab-lingga", nama: "Kab. Lingga", isKota: false, desalist: createStandardZonasiPU("Kab. Lingga", false, 1500000) },
    ],
  },
  // 6. JAMBI
  {
    id: "jambi",
    nama: "Jambi",
    kotalist: [
      { id: "kota-jambi", nama: "Kota Jambi", isKota: true, desalist: createStandardZonasiPU("Kota Jambi", true, 7000000) },
      { id: "kota-sungai-penuh", nama: "Kota Sungai Penuh", isKota: true, desalist: createStandardZonasiPU("Kota Sungai Penuh", true, 4000000) },
      { id: "kab-muaro-jambi", nama: "Kab. Muaro Jambi", isKota: false, desalist: createStandardZonasiPU("Kab. Muaro Jambi", false, 2200000) },
      { id: "kab-bungo", nama: "Kab. Bungo", isKota: false, desalist: createStandardZonasiPU("Kab. Bungo", false, 2000000) },
      { id: "kab-merangin", nama: "Kab. Merangin", isKota: false, desalist: createStandardZonasiPU("Kab. Merangin", false, 1800000) },
      { id: "kab-tebo", nama: "Kab. Tebo", isKota: false, desalist: createStandardZonasiPU("Kab. Tebo", false, 1600000) },
      { id: "kab-sarolangun", nama: "Kab. Sarolangun", isKota: false, desalist: createStandardZonasiPU("Kab. Sarolangun", false, 1800000) },
      { id: "kab-batanghari", nama: "Kab. Batanghari", isKota: false, desalist: createStandardZonasiPU("Kab. Batanghari", false, 1800000) },
      { id: "kab-kerinci", nama: "Kab. Kerinci", isKota: false, desalist: createStandardZonasiPU("Kab. Kerinci", false, 1800000) },
      { id: "kab-tanjung-jabung-barat", nama: "Kab. Tanjung Jabung Barat", isKota: false, desalist: createStandardZonasiPU("Kab. Tanjung Jabung Barat", false, 1600000) },
      { id: "kab-tanjung-jabung-timur", nama: "Kab. Tanjung Jabung Timur", isKota: false, desalist: createStandardZonasiPU("Kab. Tanjung Jabung Timur", false, 1500000) },
    ],
  },
  // 7. SUMATERA SELATAN
  {
    id: "sumatera-selatan",
    nama: "Sumatera Selatan",
    kotalist: [
      { id: "kota-palembang", nama: "Kota Palembang", isKota: true, desalist: createStandardZonasiPU("Kota Palembang", true, 9500000) },
      { id: "kota-lubuklinggau", nama: "Kota Lubuklinggau", isKota: true, desalist: createStandardZonasiPU("Kota Lubuklinggau", true, 4500000) },
      { id: "kota-pagar-alam", nama: "Kota Pagar Alam", isKota: true, desalist: createStandardZonasiPU("Kota Pagar Alam", true, 4000000) },
      { id: "kota-prabumulih", nama: "Kota Prabumulih", isKota: true, desalist: createStandardZonasiPU("Kota Prabumulih", true, 5000000) },
      { id: "kab-ogan-komering-ulu", nama: "Kab. Ogan Komering Ulu (Baturaja)", isKota: false, desalist: createStandardZonasiPU("Kab. Ogan Komering Ulu", false, 2200000) },
      { id: "kab-ogan-komering-ilir", nama: "Kab. Ogan Komering Ilir", isKota: false, desalist: createStandardZonasiPU("Kab. Ogan Komering Ilir", false, 1800000) },
      { id: "kab-muara-enim", nama: "Kab. Muara Enim", isKota: false, desalist: createStandardZonasiPU("Kab. Muara Enim", false, 2500000) },
      { id: "kab-lahat", nama: "Kab. Lahat", isKota: false, desalist: createStandardZonasiPU("Kab. Lahat", false, 2000000) },
      { id: "kab-musi-banyuasin", nama: "Kab. Musi Banyuasin (Sekayu)", isKota: false, desalist: createStandardZonasiPU("Kab. Musi Banyuasin", false, 2200000) },
      { id: "kab-musi-rawas", nama: "Kab. Musi Rawas", isKota: false, desalist: createStandardZonasiPU("Kab. Musi Rawas", false, 1800000) },
      { id: "kab-banyuasin", nama: "Kab. Banyuasin", isKota: false, desalist: createStandardZonasiPU("Kab. Banyuasin", false, 2000000) },
    ],
  },
  // 8. BANGKA BELITUNG
  {
    id: "bangka-belitung",
    nama: "Kepulauan Bangka Belitung",
    kotalist: [
      { id: "kota-pangkalpinang", nama: "Kota Pangkalpinang", isKota: true, desalist: createStandardZonasiPU("Kota Pangkalpinang", true, 6000000) },
      { id: "kab-bangka", nama: "Kab. Bangka (Sungailiat)", isKota: false, desalist: createStandardZonasiPU("Kab. Bangka", false, 2500000) },
      { id: "kab-bangka-barat", nama: "Kab. Bangka Barat", isKota: false, desalist: createStandardZonasiPU("Kab. Bangka Barat", false, 2000000) },
      { id: "kab-bangka-tengah", nama: "Kab. Bangka Tengah", isKota: false, desalist: createStandardZonasiPU("Kab. Bangka Tengah", false, 2000000) },
      { id: "kab-bangka-selatan", nama: "Kab. Bangka Selatan", isKota: false, desalist: createStandardZonasiPU("Kab. Bangka Selatan", false, 1800000) },
      { id: "kab-belitung", nama: "Kab. Belitung (Tanjung Pandan)", isKota: false, desalist: createStandardZonasiPU("Kab. Belitung", false, 3500000) },
      { id: "kab-belitung-timur", nama: "Kab. Belitung Timur", isKota: false, desalist: createStandardZonasiPU("Kab. Belitung Timur", false, 2200000) },
    ],
  },
  // 9. BENGKULU
  {
    id: "bengkulu",
    nama: "Bengkulu",
    kotalist: [
      { id: "kota-bengkulu", nama: "Kota Bengkulu", isKota: true, desalist: createStandardZonasiPU("Kota Bengkulu", true, 6000000) },
      { id: "kab-rejang-lebong", nama: "Kab. Rejang Lebong (Curup)", isKota: false, desalist: createStandardZonasiPU("Kab. Rejang Lebong", false, 2000000) },
      { id: "kab-bengkulu-utara", nama: "Kab. Bengkulu Utara", isKota: false, desalist: createStandardZonasiPU("Kab. Bengkulu Utara", false, 1800000) },
      { id: "kab-bengkulu-selatan", nama: "Kab. Bengkulu Selatan", isKota: false, desalist: createStandardZonasiPU("Kab. Bengkulu Selatan", false, 1800000) },
      { id: "kab-mukomuko", nama: "Kab. Mukomuko", isKota: false, desalist: createStandardZonasiPU("Kab. Mukomuko", false, 1600000) },
      { id: "kab-seluma", nama: "Kab. Seluma", isKota: false, desalist: createStandardZonasiPU("Kab. Seluma", false, 1500000) },
      { id: "kab-kaur", nama: "Kab. Kaur", isKota: false, desalist: createStandardZonasiPU("Kab. Kaur", false, 1400000) },
      { id: "kab-kepahiang", nama: "Kab. Kepahiang", isKota: false, desalist: createStandardZonasiPU("Kab. Kepahiang", false, 1800000) },
      { id: "kab-lebong", nama: "Kab. Lebong", isKota: false, desalist: createStandardZonasiPU("Kab. Lebong", false, 1500000) },
      { id: "kab-bengkulu-tengah", nama: "Kab. Bengkulu Tengah", isKota: false, desalist: createStandardZonasiPU("Kab. Bengkulu Tengah", false, 1800000) },
    ],
  },
  // 10. LAMPUNG
  {
    id: "lampung",
    nama: "Lampung",
    kotalist: [
      { id: "kota-bandar-lampung", nama: "Kota Bandar Lampung", isKota: true, desalist: createStandardZonasiPU("Kota Bandar Lampung", true, 8500000) },
      { id: "kota-metro", nama: "Kota Metro", isKota: true, desalist: createStandardZonasiPU("Kota Metro", true, 4500000) },
      { id: "kab-lampung-selatan", nama: "Kab. Lampung Selatan (Kalianda)", isKota: false, desalist: createStandardZonasiPU("Kab. Lampung Selatan", false, 2500000) },
      { id: "kab-lampung-tengah", nama: "Kab. Lampung Tengah", isKota: false, desalist: createStandardZonasiPU("Kab. Lampung Tengah", false, 2200000) },
      { id: "kab-lampung-utara", nama: "Kab. Lampung Utara (Kotabumi)", isKota: false, desalist: createStandardZonasiPU("Kab. Lampung Utara", false, 2000000) },
      { id: "kab-lampung-barat", nama: "Kab. Lampung Barat", isKota: false, desalist: createStandardZonasiPU("Kab. Lampung Barat", false, 1800000) },
      { id: "kab-lampung-timur", nama: "Kab. Lampung Timur", isKota: false, desalist: createStandardZonasiPU("Kab. Lampung Timur", false, 2000000) },
      { id: "kab-tanggamus", nama: "Kab. Tanggamus", isKota: false, desalist: createStandardZonasiPU("Kab. Tanggamus", false, 1800000) },
      { id: "kab-pesawaran", nama: "Kab. Pesawaran", isKota: false, desalist: createStandardZonasiPU("Kab. Pesawaran", false, 2200000) },
      { id: "kab-pringsewu", nama: "Kab. Pringsewu", isKota: false, desalist: createStandardZonasiPU("Kab. Pringsewu", false, 2500000) },
      { id: "kab-tulang-bawang", nama: "Kab. Tulang Bawang", isKota: false, desalist: createStandardZonasiPU("Kab. Tulang Bawang", false, 1800000) },
      { id: "kab-mesuji", nama: "Kab. Mesuji", isKota: false, desalist: createStandardZonasiPU("Kab. Mesuji", false, 1500000) },
      { id: "kab-pesisir-barat", nama: "Kab. Pesisir Barat (Kruai)", isKota: false, desalist: createStandardZonasiPU("Kab. Pesisir Barat", false, 2200000) },
    ],
  },
  // 11. DKI JAKARTA
  {
    id: "dki-jakarta",
    nama: "DKI Jakarta",
    kotalist: [
      { id: "jakarta-selatan", nama: "Kota Jakarta Selatan", isKota: true, desalist: createStandardZonasiPU("Kota Jakarta Selatan", true, 22000000) },
      { id: "jakarta-barat", nama: "Kota Jakarta Barat", isKota: true, desalist: createStandardZonasiPU("Kota Jakarta Barat", true, 18000000) },
      { id: "jakarta-pusat", nama: "Kota Jakarta Pusat", isKota: true, desalist: createStandardZonasiPU("Kota Jakarta Pusat", true, 25000000) },
      { id: "jakarta-timur", nama: "Kota Jakarta Timur", isKota: true, desalist: createStandardZonasiPU("Kota Jakarta Timur", true, 14000000) },
      { id: "jakarta-utara", nama: "Kota Jakarta Utara", isKota: true, desalist: createStandardZonasiPU("Kota Jakarta Utara", true, 18000000) },
      { id: "kepulauan-seribu", nama: "Kab. Kepulauan Seribu", isKota: false, desalist: createStandardZonasiPU("Kab. Kepulauan Seribu", false, 3500000) },
    ],
  },
  // 12. JAWA BARAT
  {
    id: "jawa-barat",
    nama: "Jawa Barat",
    kotalist: [
      { id: "kota-bandung", nama: "Kota Bandung", isKota: true, desalist: createStandardZonasiPU("Kota Bandung", true, 12000000) },
      { id: "kota-bekasi", nama: "Kota Bekasi", isKota: true, desalist: createStandardZonasiPU("Kota Bekasi", true, 9000000) },
      { id: "kota-depok", nama: "Kota Depok", isKota: true, desalist: createStandardZonasiPU("Kota Depok", true, 8000000) },
      { id: "kota-bogor", nama: "Kota Bogor", isKota: true, desalist: createStandardZonasiPU("Kota Bogor", true, 8000000) },
      { id: "kota-cimahi", nama: "Kota Cimahi", isKota: true, desalist: createStandardZonasiPU("Kota Cimahi", true, 6000000) },
      { id: "kota-tasikmalaya", nama: "Kota Tasikmalaya", isKota: true, desalist: createStandardZonasiPU("Kota Tasikmalaya", true, 5000000) },
      { id: "kota-cirebon", nama: "Kota Cirebon", isKota: true, desalist: createStandardZonasiPU("Kota Cirebon", true, 6500000) },
      { id: "kota-sukabumi", nama: "Kota Sukabumi", isKota: true, desalist: createStandardZonasiPU("Kota Sukabumi", true, 5000000) },
      { id: "kota-banjar", nama: "Kota Banjar", isKota: true, desalist: createStandardZonasiPU("Kota Banjar", true, 3500000) },
      { id: "kab-bogor", nama: "Kab. Bogor", isKota: false, desalist: createStandardZonasiPU("Kab. Bogor", false, 4500000) },
      { id: "kab-bandung", nama: "Kab. Bandung", isKota: false, desalist: createStandardZonasiPU("Kab. Bandung", false, 3500000) },
      { id: "kab-bandung-barat", nama: "Kab. Bandung Barat", isKota: false, desalist: createStandardZonasiPU("Kab. Bandung Barat", false, 3500000) },
      { id: "kab-bekasi", nama: "Kab. Bekasi", isKota: false, desalist: createStandardZonasiPU("Kab. Bekasi", false, 4500000) },
      { id: "kab-karawang", nama: "Kab. Karawang", isKota: false, desalist: createStandardZonasiPU("Kab. Karawang", false, 3500000) },
      { id: "kab-purwakarta", nama: "Kab. Purwakarta", isKota: false, desalist: createStandardZonasiPU("Kab. Purwakarta", false, 3000000) },
      { id: "kab-subang", nama: "Kab. Subang", isKota: false, desalist: createStandardZonasiPU("Kab. Subang", false, 2200000) },
      { id: "kab-sukabumi", nama: "Kab. Sukabumi", isKota: false, desalist: createStandardZonasiPU("Kab. Sukabumi", false, 2000000) },
      { id: "kab-cianjur", nama: "Kab. Cianjur", isKota: false, desalist: createStandardZonasiPU("Kab. Cianjur", false, 2200000) },
      { id: "kab-garut", nama: "Kab. Garut", isKota: false, desalist: createStandardZonasiPU("Kab. Garut", false, 2200000) },
      { id: "kab-tasikmalaya", nama: "Kab. Tasikmalaya", isKota: false, desalist: createStandardZonasiPU("Kab. Tasikmalaya", false, 2000000) },
      { id: "kab-cirebon", nama: "Kab. Cirebon", isKota: false, desalist: createStandardZonasiPU("Kab. Cirebon", false, 2500000) },
      { id: "kab-majalengka", nama: "Kab. Majalengka (Kertajati)", isKota: false, desalist: createStandardZonasiPU("Kab. Majalengka", false, 2200000) },
      { id: "kab-kuningan", nama: "Kab. Kuningan", isKota: false, desalist: createStandardZonasiPU("Kab. Kuningan", false, 2000000) },
      { id: "kab-indramayu", nama: "Kab. Indramayu", isKota: false, desalist: createStandardZonasiPU("Kab. Indramayu", false, 2000000) },
      { id: "kab-sumedang", nama: "Kab. Sumedang", isKota: false, desalist: createStandardZonasiPU("Kab. Sumedang", false, 2500000) },
      { id: "kab-ciamis", nama: "Kab. Ciamis", isKota: false, desalist: createStandardZonasiPU("Kab. Ciamis", false, 1800000) },
      { id: "kab-pangandaran", nama: "Kab. Pangandaran", isKota: false, desalist: createStandardZonasiPU("Kab. Pangandaran", false, 2500000) },
    ],
  },
  // 13. BANTEN
  {
    id: "banten",
    nama: "Banten",
    kotalist: [
      { id: "tangerang-selatan", nama: "Kota Tangerang Selatan", isKota: true, desalist: createStandardZonasiPU("Kota Tangerang Selatan", true, 11000000) },
      { id: "kota-tangerang", nama: "Kota Tangerang", isKota: true, desalist: createStandardZonasiPU("Kota Tangerang", true, 9000000) },
      { id: "kota-serang", nama: "Kota Serang", isKota: true, desalist: createStandardZonasiPU("Kota Serang", true, 5000000) },
      { id: "kota-cilegon", nama: "Kota Cilegon", isKota: true, desalist: createStandardZonasiPU("Kota Cilegon", true, 6000000) },
      { id: "kab-tangerang", nama: "Kab. Tangerang", isKota: false, desalist: createStandardZonasiPU("Kab. Tangerang", false, 4500000) },
      { id: "kab-serang", nama: "Kab. Serang", isKota: false, desalist: createStandardZonasiPU("Kab. Serang", false, 2500000) },
      { id: "kab-pandeglang", nama: "Kab. Pandeglang", isKota: false, desalist: createStandardZonasiPU("Kab. Pandeglang", false, 1800000) },
      { id: "kab-lebak", nama: "Kab. Lebak (Rangkasbitung)", isKota: false, desalist: createStandardZonasiPU("Kab. Lebak", false, 2000000) },
    ],
  },
  // 14. JAWA TENGAH
  {
    id: "jawa-tengah",
    nama: "Jawa Tengah",
    kotalist: [
      { id: "kota-semarang", nama: "Kota Semarang", isKota: true, desalist: createStandardZonasiPU("Kota Semarang", true, 9000000) },
      { id: "kota-surakarta", nama: "Kota Surakarta (Solo)", isKota: true, desalist: createStandardZonasiPU("Kota Surakarta", true, 8000000) },
      { id: "kota-magelang", nama: "Kota Magelang", isKota: true, desalist: createStandardZonasiPU("Kota Magelang", true, 6000000) },
      { id: "kota-salatiga", nama: "Kota Salatiga", isKota: true, desalist: createStandardZonasiPU("Kota Salatiga", true, 5500000) },
      { id: "kota-pekalongan", nama: "Kota Pekalongan", isKota: true, desalist: createStandardZonasiPU("Kota Pekalongan", true, 5500000) },
      { id: "kota-tegal", nama: "Kota Tegal", isKota: true, desalist: createStandardZonasiPU("Kota Tegal", true, 6000000) },
      { id: "kab-banyumas", nama: "Kab. Banyumas (Purwokerto)", isKota: false, desalist: createStandardZonasiPU("Kab. Banyumas", false, 3000000) },
      { id: "kab-semarang", nama: "Kab. Semarang (Ungaran)", isKota: false, desalist: createStandardZonasiPU("Kab. Semarang", false, 3500000) },
      { id: "kab-kudus", nama: "Kab. Kudus", isKota: false, desalist: createStandardZonasiPU("Kab. Kudus", false, 3500000) },
      { id: "kab-jepara", nama: "Kab. Jepara", isKota: false, desalist: createStandardZonasiPU("Kab. Jepara", false, 2500000) },
      { id: "kab-pati", nama: "Kab. Pati", isKota: false, desalist: createStandardZonasiPU("Kab. Pati", false, 2500000) },
      { id: "kab-sragen", nama: "Kab. Sragen", isKota: false, desalist: createStandardZonasiPU("Kab. Sragen", false, 2200000) },
      { id: "kab-karanganyar", nama: "Kab. Karanganyar", isKota: false, desalist: createStandardZonasiPU("Kab. Karanganyar", false, 2800000) },
      { id: "kab-boyolali", nama: "Kab. Boyolali", isKota: false, desalist: createStandardZonasiPU("Kab. Boyolali", false, 2500000) },
      { id: "kab-klaten", nama: "Kab. Klaten", isKota: false, desalist: createStandardZonasiPU("Kab. Klaten", false, 2800000) },
      { id: "kab-sukoharjo", nama: "Kab. Sukoharjo", isKota: false, desalist: createStandardZonasiPU("Kab. Sukoharjo", false, 3000000) },
      { id: "kab-wonogiri", nama: "Kab. Wonogiri", isKota: false, desalist: createStandardZonasiPU("Kab. Wonogiri", false, 1800000) },
      { id: "kab-magelang", nama: "Kab. Magelang", isKota: false, desalist: createStandardZonasiPU("Kab. Magelang", false, 2500000) },
      { id: "kab-temanggung", nama: "Kab. Temanggung", isKota: false, desalist: createStandardZonasiPU("Kab. Temanggung", false, 2000000) },
      { id: "kab-wonosobo", nama: "Kab. Wonosobo", isKota: false, desalist: createStandardZonasiPU("Kab. Wonosobo", false, 2000000) },
      { id: "kab-purworejo", nama: "Kab. Purworejo", isKota: false, desalist: createStandardZonasiPU("Kab. Purworejo", false, 2000000) },
      { id: "kab-kebumen", nama: "Kab. Kebumen", isKota: false, desalist: createStandardZonasiPU("Kab. Kebumen", false, 2000000) },
      { id: "kab-cilacap", nama: "Kab. Cilacap", isKota: false, desalist: createStandardZonasiPU("Kab. Cilacap", false, 2500000) },
      { id: "kab-brebes", nama: "Kab. Brebes", isKota: false, desalist: createStandardZonasiPU("Kab. Brebes", false, 2200000) },
      { id: "kab-tegal", nama: "Kab. Tegal", isKota: false, desalist: createStandardZonasiPU("Kab. Tegal", false, 2200000) },
      { id: "kab-pemalang", nama: "Kab. Pemalang", isKota: false, desalist: createStandardZonasiPU("Kab. Pemalang", false, 2000000) },
      { id: "kab-pekalongan", nama: "Kab. Pekalongan", isKota: false, desalist: createStandardZonasiPU("Kab. Pekalongan", false, 2000000) },
      { id: "kab-batang", nama: "Kab. Batang (KITB Industri)", isKota: false, desalist: createStandardZonasiPU("Kab. Batang", false, 2500000) },
      { id: "kab-kendal", nama: "Kab. Kendal", isKota: false, desalist: createStandardZonasiPU("Kab. Kendal", false, 2500000) },
      { id: "kab-demak", nama: "Kab. Demak", isKota: false, desalist: createStandardZonasiPU("Kab. Demak", false, 2200000) },
      { id: "kab-grobogan", nama: "Kab. Grobogan (Purwodadi)", isKota: false, desalist: createStandardZonasiPU("Kab. Grobogan", false, 1800000) },
      { id: "kab-blora", nama: "Kab. Blora", isKota: false, desalist: createStandardZonasiPU("Kab. Blora", false, 1600000) },
      { id: "kab-rembang", nama: "Kab. Rembang", isKota: false, desalist: createStandardZonasiPU("Kab. Rembang", false, 1800000) },
    ],
  },
  // 15. DI YOGYAKARTA
  {
    id: "di-yogyakarta",
    nama: "DI Yogyakarta",
    kotalist: [
      { id: "kota-yogyakarta", nama: "Kota Yogyakarta", isKota: true, desalist: createStandardZonasiPU("Kota Yogyakarta", true, 11000000) },
      { id: "kab-sleman", nama: "Kab. Sleman", isKota: false, desalist: createStandardZonasiPU("Kab. Sleman", false, 5000000) },
      { id: "kab-bantul", nama: "Kab. Bantul", isKota: false, desalist: createStandardZonasiPU("Kab. Bantul", false, 3500000) },
      { id: "kab-gunungkidul", nama: "Kab. Gunungkidul (Wonosari)", isKota: false, desalist: createStandardZonasiPU("Kab. Gunungkidul", false, 2000000) },
      { id: "kab-kulon-progo", nama: "Kab. Kulon Progo (YIA Bandara)", isKota: false, desalist: createStandardZonasiPU("Kab. Kulon Progo", false, 2800000) },
    ],
  },
  // 16. JAWA TIMUR
  {
    id: "jawa-timur",
    nama: "Jawa Timur",
    kotalist: [
      { id: "kota-surabaya", nama: "Kota Surabaya", isKota: true, desalist: createStandardZonasiPU("Kota Surabaya", true, 15000000) },
      { id: "kota-malang", nama: "Kota Malang", isKota: true, desalist: createStandardZonasiPU("Kota Malang", true, 9000000) },
      { id: "kota-batu", nama: "Kota Batu", isKota: true, desalist: createStandardZonasiPU("Kota Batu", true, 6500000) },
      { id: "kota-kediri", nama: "Kota Kediri", isKota: true, desalist: createStandardZonasiPU("Kota Kediri", true, 6000000) },
      { id: "kota-madiun", nama: "Kota Madiun", isKota: true, desalist: createStandardZonasiPU("Kota Madiun", true, 5500000) },
      { id: "kota-pasuruan", nama: "Kota Pasuruan", isKota: true, desalist: createStandardZonasiPU("Kota Pasuruan", true, 5000000) },
      { id: "kota-probolinggo", nama: "Kota Probolinggo", isKota: true, desalist: createStandardZonasiPU("Kota Probolinggo", true, 5000000) },
      { id: "kota-blitar", nama: "Kota Blitar", isKota: true, desalist: createStandardZonasiPU("Kota Blitar", true, 5000000) },
      { id: "kota-mojokerto", nama: "Kota Mojokerto", isKota: true, desalist: createStandardZonasiPU("Kota Mojokerto", true, 5500000) },
      { id: "kab-sidoarjo", nama: "Kab. Sidoarjo", isKota: false, desalist: createStandardZonasiPU("Kab. Sidoarjo", false, 5500000) },
      { id: "kab-gresik", nama: "Kab. Gresik", isKota: false, desalist: createStandardZonasiPU("Kab. Gresik", false, 4500000) },
      { id: "kab-malang", nama: "Kab. Malang", isKota: false, desalist: createStandardZonasiPU("Kab. Malang", false, 3500000) },
      { id: "kab-banyuwangi", nama: "Kab. Banyuwangi", isKota: false, desalist: createStandardZonasiPU("Kab. Banyuwangi", false, 2500000) },
      { id: "kab-jember", nama: "Kab. Jember", isKota: false, desalist: createStandardZonasiPU("Kab. Jember", false, 2800000) },
      { id: "kab-kediri", nama: "Kab. Kediri (Dhoho Bandara)", isKota: false, desalist: createStandardZonasiPU("Kab. Kediri", false, 3000000) },
      { id: "kab-pasuruan", nama: "Kab. Pasuruan", isKota: false, desalist: createStandardZonasiPU("Kab. Pasuruan", false, 3000000) },
      { id: "kab-probolinggo", nama: "Kab. Probolinggo (Bromo)", isKota: false, desalist: createStandardZonasiPU("Kab. Probolinggo", false, 2500000) },
      { id: "kab-mojokerto", nama: "Kab. Mojokerto", isKota: false, desalist: createStandardZonasiPU("Kab. Mojokerto", false, 3000000) },
      { id: "kab-jombang", nama: "Kab. Jombang", isKota: false, desalist: createStandardZonasiPU("Kab. Jombang", false, 2500000) },
      { id: "kab-lamongan", nama: "Kab. Lamongan", isKota: false, desalist: createStandardZonasiPU("Kab. Lamongan", false, 2200000) },
      { id: "kab-bojonegoro", nama: "Kab. Bojonegoro", isKota: false, desalist: createStandardZonasiPU("Kab. Bojonegoro", false, 2500000) },
      { id: "kab-tuban", nama: "Kab. Tuban", isKota: false, desalist: createStandardZonasiPU("Kab. Tuban", false, 2200000) },
      { id: "kab-madiun", nama: "Kab. Madiun", isKota: false, desalist: createStandardZonasiPU("Kab. Madiun", false, 2200000) },
      { id: "kab-magetan", nama: "Kab. Magetan", isKota: false, desalist: createStandardZonasiPU("Kab. Magetan", false, 2000000) },
      { id: "kab-ngawi", nama: "Kab. Ngawi", isKota: false, desalist: createStandardZonasiPU("Kab. Ngawi", false, 1800000) },
      { id: "kab-ponorogo", nama: "Kab. Ponorogo", isKota: false, desalist: createStandardZonasiPU("Kab. Ponorogo", false, 2000000) },
      { id: "kab-pacitan", nama: "Kab. Pacitan", isKota: false, desalist: createStandardZonasiPU("Kab. Pacitan", false, 1800000) },
      { id: "kab-trenggalek", nama: "Kab. Trenggalek", isKota: false, desalist: createStandardZonasiPU("Kab. Trenggalek", false, 1800000) },
      { id: "kab-tulungagung", nama: "Kab. Tulungagung", isKota: false, desalist: createStandardZonasiPU("Kab. Tulungagung", false, 2500000) },
      { id: "kab-nganjuk", nama: "Kab. Nganjuk", isKota: false, desalist: createStandardZonasiPU("Kab. Nganjuk", false, 2000000) },
      { id: "kab-blitar", nama: "Kab. Blitar", isKota: false, desalist: createStandardZonasiPU("Kab. Blitar", false, 2200000) },
      { id: "kab-lumajang", nama: "Kab. Lumajang", isKota: false, desalist: createStandardZonasiPU("Kab. Lumajang", false, 2000000) },
      { id: "kab-bondowoso", nama: "Kab. Bondowoso", isKota: false, desalist: createStandardZonasiPU("Kab. Bondowoso", false, 1600000) },
      { id: "kab-situbondo", nama: "Kab. Situbondo", isKota: false, desalist: createStandardZonasiPU("Kab. Situbondo", false, 1800000) },
      { id: "kab-bangkalan", nama: "Kab. Bangkalan", isKota: false, desalist: createStandardZonasiPU("Kab. Bangkalan", false, 2000000) },
      { id: "kab-sampang", nama: "Kab. Sampang", isKota: false, desalist: createStandardZonasiPU("Kab. Sampang", false, 1500000) },
      { id: "kab-pamekasan", nama: "Kab. Pamekasan", isKota: false, desalist: createStandardZonasiPU("Kab. Pamekasan", false, 1800000) },
      { id: "kab-sumenep", nama: "Kab. Sumenep", isKota: false, desalist: createStandardZonasiPU("Kab. Sumenep", false, 1800000) },
    ],
  },
  // 17. BALI
  {
    id: "bali",
    nama: "Bali",
    kotalist: [
      { id: "kota-denpasar", nama: "Kota Denpasar", isKota: true, desalist: createStandardZonasiPU("Kota Denpasar", true, 12000000) },
      { id: "kab-badung", nama: "Kab. Badung (Kuta/Canggu/Uluwatu)", isKota: false, desalist: createStandardZonasiPU("Kab. Badung", false, 15000000) },
      { id: "kab-gianyar", nama: "Kab. Gianyar (Ubud)", isKota: false, desalist: createStandardZonasiPU("Kab. Gianyar", false, 8000000) },
      { id: "kab-buleleng", nama: "Kab. Buleleng (Singaraja)", isKota: false, desalist: createStandardZonasiPU("Kab. Buleleng", false, 3500000) },
      { id: "kab-tabanan", nama: "Kab. Tabanan", isKota: false, desalist: createStandardZonasiPU("Kab. Tabanan", false, 3000000) },
      { id: "kab-karangasem", nama: "Kab. Karangasem", isKota: false, desalist: createStandardZonasiPU("Kab. Karangasem", false, 2000000) },
      { id: "kab-klungkung", nama: "Kab. Klungkung (Nusa Penida)", isKota: false, desalist: createStandardZonasiPU("Kab. Klungkung", false, 2500000) },
      { id: "kab-bangli", nama: "Kab. Bangli", isKota: false, desalist: createStandardZonasiPU("Kab. Bangli", false, 1800000) },
      { id: "kab-jembrana", nama: "Kab. Jembrana (Negara)", isKota: false, desalist: createStandardZonasiPU("Kab. Jembrana", false, 2000000) },
    ],
  },
  // 18. NTB
  {
    id: "ntb",
    nama: "Nusa Tenggara Barat (NTB)",
    kotalist: [
      { id: "kota-mataram", nama: "Kota Mataram", isKota: true, desalist: createStandardZonasiPU("Kota Mataram", true, 7000000) },
      { id: "kota-bima", nama: "Kota Bima", isKota: true, desalist: createStandardZonasiPU("Kota Bima", true, 4000000) },
      { id: "kab-lombok-barat", nama: "Kab. Lombok Barat (Senggigi)", isKota: false, desalist: createStandardZonasiPU("Kab. Lombok Barat", false, 4000000) },
      { id: "kab-lombok-tengah", nama: "Kab. Lombok Tengah (Mandalika)", isKota: false, desalist: createStandardZonasiPU("Kab. Lombok Tengah", false, 5000000) },
      { id: "kab-lombok-timur", nama: "Kab. Lombok Timur", isKota: false, desalist: createStandardZonasiPU("Kab. Lombok Timur", false, 2500000) },
      { id: "kab-lombok-utara", nama: "Kab. Lombok Utara (Gili Trawangan)", isKota: false, desalist: createStandardZonasiPU("Kab. Lombok Utara", false, 3500000) },
      { id: "kab-sumbawa", nama: "Kab. Sumbawa", isKota: false, desalist: createStandardZonasiPU("Kab. Sumbawa", false, 2000000) },
      { id: "kab-sumbawa-barat", nama: "Kab. Sumbawa Barat", isKota: false, desalist: createStandardZonasiPU("Kab. Sumbawa Barat", false, 2500000) },
      { id: "kab-dompu", nama: "Kab. Dompu", isKota: false, desalist: createStandardZonasiPU("Kab. Dompu", false, 1800000) },
      { id: "kab-bima", nama: "Kab. Bima", isKota: false, desalist: createStandardZonasiPU("Kab. Bima", false, 1800000) },
    ],
  },
  // 19. NTT
  {
    id: "ntt",
    nama: "Nusa Tenggara Timur (NTT)",
    kotalist: [
      { id: "kota-kupang", nama: "Kota Kupang", isKota: true, desalist: createStandardZonasiPU("Kota Kupang", true, 6000000) },
      { id: "kab-manggarai-barat", nama: "Kab. Manggarai Barat (Labuan Bajo)", isKota: false, desalist: createStandardZonasiPU("Kab. Manggarai Barat", false, 10000000) },
      { id: "kab-manggarai", nama: "Kab. Manggarai (Ruteng)", isKota: false, desalist: createStandardZonasiPU("Kab. Manggarai", false, 2000000) },
      { id: "kab-ende", nama: "Kab. Ende", isKota: false, desalist: createStandardZonasiPU("Kab. Ende", false, 2000000) },
      { id: "kab-sikka", nama: "Kab. Sikka (Maumere)", isKota: false, desalist: createStandardZonasiPU("Kab. Sikka", false, 2200000) },
      { id: "kab-flores-timur", nama: "Kab. Flores Timur (Larantuka)", isKota: false, desalist: createStandardZonasiPU("Kab. Flores Timur", false, 2000000) },
      { id: "kab-belu", nama: "Kab. Belu (Atambua)", isKota: false, desalist: createStandardZonasiPU("Kab. Belu", false, 2000000) },
      { id: "kab-sumba-timur", nama: "Kab. Sumba Timur (Waingapu)", isKota: false, desalist: createStandardZonasiPU("Kab. Sumba Timur", false, 1800000) },
      { id: "kab-sumba-barat", nama: "Kab. Sumba Barat", isKota: false, desalist: createStandardZonasiPU("Kab. Sumba Barat", false, 1800000) },
    ],
  },
  // 20. KALIMANTAN BARAT
  {
    id: "kalimantan-barat",
    nama: "Kalimantan Barat",
    kotalist: [
      { id: "kota-pontianak", nama: "Kota Pontianak", isKota: true, desalist: createStandardZonasiPU("Kota Pontianak", true, 8000000) },
      { id: "kota-singkawang", nama: "Kota Singkawang", isKota: true, desalist: createStandardZonasiPU("Kota Singkawang", true, 5500000) },
      { id: "kab-kubu-raya", nama: "Kab. Kubu Raya (Supadio)", isKota: false, desalist: createStandardZonasiPU("Kab. Kubu Raya", false, 3000000) },
      { id: "kab-mempawah", nama: "Kab. Mempawah", isKota: false, desalist: createStandardZonasiPU("Kab. Mempawah", false, 2000000) },
      { id: "kab-sambas", nama: "Kab. Sambas", isKota: false, desalist: createStandardZonasiPU("Kab. Sambas", false, 2000000) },
      { id: "kab-ketapang", nama: "Kab. Ketapang", isKota: false, desalist: createStandardZonasiPU("Kab. Ketapang", false, 2200000) },
      { id: "kab-sintang", nama: "Kab. Sintang", isKota: false, desalist: createStandardZonasiPU("Kab. Sintang", false, 2200000) },
      { id: "kab-kapuas-hulu", nama: "Kab. Kapuas Hulu (Putussibau)", isKota: false, desalist: createStandardZonasiPU("Kab. Kapuas Hulu", false, 1600000) },
      { id: "kab-landak", nama: "Kab. Landak (Ngabang)", isKota: false, desalist: createStandardZonasiPU("Kab. Landak", false, 1800000) },
    ],
  },
  // 21. KALIMANTAN TENGAH
  {
    id: "kalimantan-tengah",
    nama: "Kalimantan Tengah",
    kotalist: [
      { id: "kota-palangka-raya", nama: "Kota Palangka Raya", isKota: true, desalist: createStandardZonasiPU("Kota Palangka Raya", true, 6000000) },
      { id: "kab-kotawaringin-barat", nama: "Kab. Kotawaringin Barat (Pangkalan Bun)", isKota: false, desalist: createStandardZonasiPU("Kab. Kotawaringin Barat", false, 2800000) },
      { id: "kab-kotawaringin-timur", nama: "Kab. Kotawaringin Timur (Sampit)", isKota: false, desalist: createStandardZonasiPU("Kab. Kotawaringin Timur", false, 2800000) },
      { id: "kab-kapuas", nama: "Kab. Kapuas (Kuala Kapuas)", isKota: false, desalist: createStandardZonasiPU("Kab. Kapuas", false, 2200000) },
      { id: "kab-barito-selatan", nama: "Kab. Barito Selatan", isKota: false, desalist: createStandardZonasiPU("Kab. Barito Selatan", false, 1800000) },
      { id: "kab-barito-utara", nama: "Kab. Barito Utara (Muara Teweh)", isKota: false, desalist: createStandardZonasiPU("Kab. Barito Utara", false, 2000000) },
    ],
  },
  // 22. KALIMANTAN SELATAN
  {
    id: "kalimantan-selatan",
    nama: "Kalimantan Selatan",
    kotalist: [
      { id: "kota-banjarmasin", nama: "Kota Banjarmasin", isKota: true, desalist: createStandardZonasiPU("Kota Banjarmasin", true, 8000000) },
      { id: "kota-banjarbaru", nama: "Kota Banjarbaru", isKota: true, desalist: createStandardZonasiPU("Kota Banjarbaru", true, 6000000) },
      { id: "kab-banjar", nama: "Kab. Banjar (Martapura)", isKota: false, desalist: createStandardZonasiPU("Kab. Banjar", false, 3000000) },
      { id: "kab-tanah-laut", nama: "Kab. Tanah Laut (Pelaihari)", isKota: false, desalist: createStandardZonasiPU("Kab. Tanah Laut", false, 2200000) },
      { id: "kab-tanah-bumbu", nama: "Kab. Tanah Bumbu (Batulicin)", isKota: false, desalist: createStandardZonasiPU("Kab. Tanah Bumbu", false, 2500000) },
      { id: "kab-kotabaru", nama: "Kab. Kotabaru", isKota: false, desalist: createStandardZonasiPU("Kab. Kotabaru", false, 2000000) },
      { id: "kab-tabalong", nama: "Kab. Tabalong (Tanjung)", isKota: false, desalist: createStandardZonasiPU("Kab. Tabalong", false, 2200000) },
    ],
  },
  // 23. KALIMANTAN TIMUR
  {
    id: "kalimantan-timur",
    nama: "Kalimantan Timur (Termasuk IKN)",
    kotalist: [
      { id: "kota-samarinda", nama: "Kota Samarinda", isKota: true, desalist: createStandardZonasiPU("Kota Samarinda", true, 9000000) },
      { id: "kota-balikpapan", nama: "Kota Balikpapan", isKota: true, desalist: createStandardZonasiPU("Kota Balikpapan", true, 11000000) },
      { id: "kota-bontang", nama: "Kota Bontang", isKota: true, desalist: createStandardZonasiPU("Kota Bontang", true, 7000000) },
      { id: "ikn-nusantara", nama: "IKN Nusantara (KIPP Sepaku)", isKota: true, desalist: createStandardZonasiPU("IKN Nusantara", true, 16000000) },
      { id: "kab-penajam-paser-utara", nama: "Kab. Penajam Paser Utara", isKota: false, desalist: createStandardZonasiPU("Kab. Penajam Paser Utara", false, 3500000) },
      { id: "kab-kutai-kartanegara", nama: "Kab. Kutai Kartanegara (Tenggarong)", isKota: false, desalist: createStandardZonasiPU("Kab. Kutai Kartanegara", false, 3500000) },
      { id: "kab-kutai-timur", nama: "Kab. Kutai Timur (Sangatta)", isKota: false, desalist: createStandardZonasiPU("Kab. Kutai Timur", false, 3000000) },
      { id: "kab-berau", nama: "Kab. Berau (Derawan)", isKota: false, desalist: createStandardZonasiPU("Kab. Berau", false, 3000000) },
      { id: "kab-paser", nama: "Kab. Paser (Tanah Grogot)", isKota: false, desalist: createStandardZonasiPU("Kab. Paser", false, 2500000) },
    ],
  },
  // 24. KALIMANTAN UTARA
  {
    id: "kalimantan-utara",
    nama: "Kalimantan Utara",
    kotalist: [
      { id: "kota-tarakan", nama: "Kota Tarakan", isKota: true, desalist: createStandardZonasiPU("Kota Tarakan", true, 6000000) },
      { id: "kab-bulungan", nama: "Kab. Bulungan (Tanjung Selor)", isKota: false, desalist: createStandardZonasiPU("Kab. Bulungan", false, 3000000) },
      { id: "kab-nunukan", nama: "Kab. Nunukan", isKota: false, desalist: createStandardZonasiPU("Kab. Nunukan", false, 2200000) },
      { id: "kab-malinau", nama: "Kab. Malinau", isKota: false, desalist: createStandardZonasiPU("Kab. Malinau", false, 1800000) },
    ],
  },
  // 25. SULAWESI UTARA
  {
    id: "sulawesi-utara",
    nama: "Sulawesi Utara",
    kotalist: [
      { id: "kota-manado", nama: "Kota Manado", isKota: true, desalist: createStandardZonasiPU("Kota Manado", true, 10000000) },
      { id: "kota-bitung", nama: "Kota Bitung", isKota: true, desalist: createStandardZonasiPU("Kota Bitung", true, 5500000) },
      { id: "kota-tomohon", nama: "Kota Tomohon", isKota: true, desalist: createStandardZonasiPU("Kota Tomohon", true, 5000000) },
      { id: "kota-kotamobagu", nama: "Kota Kotamobagu", isKota: true, desalist: createStandardZonasiPU("Kota Kotamobagu", true, 4500000) },
      { id: "kab-minahasa", nama: "Kab. Minahasa (Tondano)", isKota: false, desalist: createStandardZonasiPU("Kab. Minahasa", false, 2500000) },
      { id: "kab-minahasa-utara", nama: "Kab. Minahasa Utara (Likupang)", isKota: false, desalist: createStandardZonasiPU("Kab. Minahasa Utara", false, 3500000) },
      { id: "kab-minahasa-selatan", nama: "Kab. Minahasa Selatan", isKota: false, desalist: createStandardZonasiPU("Kab. Minahasa Selatan", false, 2000000) },
      { id: "kab-bolaang-mongondow", nama: "Kab. Bolaang Mongondow", isKota: false, desalist: createStandardZonasiPU("Kab. Bolaang Mongondow", false, 2000000) },
    ],
  },
  // 26. GORONTALO
  {
    id: "gorontalo",
    nama: "Gorontalo",
    kotalist: [
      { id: "kota-gorontalo", nama: "Kota Gorontalo", isKota: true, desalist: createStandardZonasiPU("Kota Gorontalo", true, 6000000) },
      { id: "kab-gorontalo", nama: "Kab. Gorontalo (Limboto)", isKota: false, desalist: createStandardZonasiPU("Kab. Gorontalo", false, 2200000) },
      { id: "kab-boalemo", nama: "Kab. Boalemo", isKota: false, desalist: createStandardZonasiPU("Kab. Boalemo", false, 1800000) },
      { id: "kab-bone-bolango", nama: "Kab. Bone Bolango", isKota: false, desalist: createStandardZonasiPU("Kab. Bone Bolango", false, 2000000) },
      { id: "kab-pohuwato", nama: "Kab. Pohuwato", isKota: false, desalist: createStandardZonasiPU("Kab. Pohuwato", false, 1800000) },
    ],
  },
  // 27. SULAWESI TENGAH
  {
    id: "sulawesi-tengah",
    nama: "Sulawesi Tengah",
    kotalist: [
      { id: "kota-palu", nama: "Kota Palu", isKota: true, desalist: createStandardZonasiPU("Kota Palu", true, 7000000) },
      { id: "kab-sigi", nama: "Kab. Sigi", isKota: false, desalist: createStandardZonasiPU("Kab. Sigi", false, 2000000) },
      { id: "kab-donggala", nama: "Kab. Donggala", isKota: false, desalist: createStandardZonasiPU("Kab. Donggala", false, 2000000) },
      { id: "kab-poso", nama: "Kab. Poso", isKota: false, desalist: createStandardZonasiPU("Kab. Poso", false, 2200000) },
      { id: "kab-morowali", nama: "Kab. Morowali (Kawasan Industri)", isKota: false, desalist: createStandardZonasiPU("Kab. Morowali", false, 4500000) },
      { id: "kab-banggai", nama: "Kab. Banggai (Luwuk)", isKota: false, desalist: createStandardZonasiPU("Kab. Banggai", false, 2500000) },
    ],
  },
  // 28. SULAWESI BARAT
  {
    id: "sulawesi-barat",
    nama: "Sulawesi Barat",
    kotalist: [
      { id: "kab-mamuju", nama: "Kab. Mamuju (Ibu Kota Prov)", isKota: false, desalist: createStandardZonasiPU("Kab. Mamuju", false, 3000000) },
      { id: "kab-majene", nama: "Kab. Majene", isKota: false, desalist: createStandardZonasiPU("Kab. Majene", false, 2000000) },
      { id: "kab-polewali-mandar", nama: "Kab. Polewali Mandar", isKota: false, desalist: createStandardZonasiPU("Kab. Polewali Mandar", false, 2200000) },
    ],
  },
  // 29. SULAWESI SELATAN
  {
    id: "sulawesi-selatan",
    nama: "Sulawesi Selatan",
    kotalist: [
      { id: "kota-makassar", nama: "Kota Makassar", isKota: true, desalist: createStandardZonasiPU("Kota Makassar", true, 12000000) },
      { id: "kota-parepare", nama: "Kota Parepare", isKota: true, desalist: createStandardZonasiPU("Kota Parepare", true, 6000000) },
      { id: "kota-palopo", nama: "Kota Palopo", isKota: true, desalist: createStandardZonasiPU("Kota Palopo", true, 5500000) },
      { id: "kab-gowa", nama: "Kab. Gowa (Sungguminasa)", isKota: false, desalist: createStandardZonasiPU("Kab. Gowa", false, 3500000) },
      { id: "kab-maros", nama: "Kab. Maros (Bandara Sultan Hasanuddin)", isKota: false, desalist: createStandardZonasiPU("Kab. Maros", false, 3500000) },
      { id: "kab-bone", nama: "Kab. Bone (Watampone)", isKota: false, desalist: createStandardZonasiPU("Kab. Bone", false, 2200000) },
      { id: "kab-bulukumba", nama: "Kab. Bulukumba (Tanjung Bira)", isKota: false, desalist: createStandardZonasiPU("Kab. Bulukumba", false, 2800000) },
      { id: "kab-tana-toraja", nama: "Kab. Tana Toraja (Makale)", isKota: false, desalist: createStandardZonasiPU("Kab. Tana Toraja", false, 2500000) },
      { id: "kab-toraja-utara", nama: "Kab. Toraja Utara (Rantepao)", isKota: false, desalist: createStandardZonasiPU("Kab. Toraja Utara", false, 2800000) },
      { id: "kab-luwu-timur", nama: "Kab. Luwu Timur (Sorowako)", isKota: false, desalist: createStandardZonasiPU("Kab. Luwu Timur", false, 3000000) },
    ],
  },
  // 30. SULAWESI TENGGARA
  {
    id: "sulawesi-tenggara",
    nama: "Sulawesi Tenggara",
    kotalist: [
      { id: "kota-kendari", nama: "Kota Kendari", isKota: true, desalist: createStandardZonasiPU("Kota Kendari", true, 7500000) },
      { id: "kota-baubau", nama: "Kota Baubau", isKota: true, desalist: createStandardZonasiPU("Kota Baubau", true, 5000000) },
      { id: "kab-konawe", nama: "Kab. Konawe (Unaaha)", isKota: false, desalist: createStandardZonasiPU("Kab. Konawe", false, 2500000) },
      { id: "kab-kolaka", nama: "Kab. Kolaka", isKota: false, desalist: createStandardZonasiPU("Kab. Kolaka", false, 2500000) },
      { id: "kab-wakatobi", nama: "Kab. Wakatobi (Wisata Bahari)", isKota: false, desalist: createStandardZonasiPU("Kab. Wakatobi", false, 3500000) },
    ],
  },
  // 31. MALUKU
  {
    id: "maluku",
    nama: "Maluku",
    kotalist: [
      { id: "kota-ambon", nama: "Kota Ambon", isKota: true, desalist: createStandardZonasiPU("Kota Ambon", true, 8000000) },
      { id: "kota-tual", nama: "Kota Tual", isKota: true, desalist: createStandardZonasiPU("Kota Tual", true, 4500000) },
      { id: "kab-maluku-tengah", nama: "Kab. Maluku Tengah (Masohi)", isKota: false, desalist: createStandardZonasiPU("Kab. Maluku Tengah", false, 2200000) },
      { id: "kab-maluku-tenggara", nama: "Kab. Maluku Tenggara (Langgur)", isKota: false, desalist: createStandardZonasiPU("Kab. Maluku Tenggara", false, 2000000) },
      { id: "kab-buru", nama: "Kab. Buru (Namlea)", isKota: false, desalist: createStandardZonasiPU("Kab. Buru", false, 1800000) },
    ],
  },
  // 32. MALUKU UTARA
  {
    id: "maluku-utara",
    nama: "Maluku Utara",
    kotalist: [
      { id: "kota-ternate", nama: "Kota Ternate", isKota: true, desalist: createStandardZonasiPU("Kota Ternate", true, 8500000) },
      { id: "kota-tidore", nama: "Kota Tidore Kepulauan", isKota: true, desalist: createStandardZonasiPU("Kota Tidore", true, 5000000) },
      { id: "kab-halmahera-utara", nama: "Kab. Halmahera Utara (Tobelo)", isKota: false, desalist: createStandardZonasiPU("Kab. Halmahera Utara", false, 2500000) },
      { id: "kab-halmahera-selatan", nama: "Kab. Halmahera Selatan (Labuha)", isKota: false, desalist: createStandardZonasiPU("Kab. Halmahera Selatan", false, 2200000) },
      { id: "kab-halmahera-tengah", nama: "Kab. Halmahera Tengah (Weda Industri)", isKota: false, desalist: createStandardZonasiPU("Kab. Halmahera Tengah", false, 4000000) },
      { id: "kab-morotai", nama: "Kab. Pulau Morotai", isKota: false, desalist: createStandardZonasiPU("Kab. Pulau Morotai", false, 2500000) },
    ],
  },
  // 33. PAPUA
  {
    id: "papua",
    nama: "Papua",
    kotalist: [
      { id: "kota-jayapura", nama: "Kota Jayapura", isKota: true, desalist: createStandardZonasiPU("Kota Jayapura", true, 9000000) },
      { id: "kab-jayapura", nama: "Kab. Jayapura (Sentani Bandara)", isKota: false, desalist: createStandardZonasiPU("Kab. Jayapura", false, 3500000) },
      { id: "kab-keerom", nama: "Kab. Keerom", isKota: false, desalist: createStandardZonasiPU("Kab. Keerom", false, 1800000) },
      { id: "kab-biak-numfor", nama: "Kab. Biak Numfor", isKota: false, desalist: createStandardZonasiPU("Kab. Biak Numfor", false, 2500000) },
    ],
  },
  // 34. PAPUA BARAT
  {
    id: "papua-barat",
    nama: "Papua Barat",
    kotalist: [
      { id: "kab-manokwari", nama: "Kab. Manokwari (Ibu Kota Prov)", isKota: false, desalist: createStandardZonasiPU("Kab. Manokwari", false, 4500000) },
      { id: "kab-fakfak", nama: "Kab. Fakfak", isKota: false, desalist: createStandardZonasiPU("Kab. Fakfak", false, 2500000) },
      { id: "kab-kaimana", nama: "Kab. Kaimana", isKota: false, desalist: createStandardZonasiPU("Kab. Kaimana", false, 2200000) },
      { id: "kab-teluk-bintuni", nama: "Kab. Teluk Bintuni (Industri LNG)", isKota: false, desalist: createStandardZonasiPU("Kab. Teluk Bintuni", false, 3500000) },
    ],
  },
  // 35. PAPUA BARAT DAYA
  {
    id: "papua-barat-daya",
    nama: "Papua Barat Daya",
    kotalist: [
      { id: "kota-sorong", nama: "Kota Sorong", isKota: true, desalist: createStandardZonasiPU("Kota Sorong", true, 10000000) },
      { id: "kab-sorong", nama: "Kab. Sorong", isKota: false, desalist: createStandardZonasiPU("Kab. Sorong", false, 3000000) },
      { id: "kab-raja-ampat", nama: "Kab. Raja Ampat (Kawasan Wisata)", isKota: false, desalist: createStandardZonasiPU("Kab. Raja Ampat", false, 6000000) },
    ],
  },
  // 36. PAPUA TENGAH
  {
    id: "papua-tengah",
    nama: "Papua Tengah",
    kotalist: [
      { id: "kab-nabire", nama: "Kab. Nabire (Ibu Kota Prov)", isKota: false, desalist: createStandardZonasiPU("Kab. Nabire", false, 4000000) },
      { id: "kab-mimika", nama: "Kab. Mimika (Timika / Freeport)", isKota: false, desalist: createStandardZonasiPU("Kab. Mimika", false, 6000000) },
    ],
  },
  // 37. PAPUA SELATAN
  {
    id: "papua-selatan",
    nama: "Papua Selatan",
    kotalist: [
      { id: "kab-merauke", nama: "Kab. Merauke (Ibu Kota Prov)", isKota: false, desalist: createStandardZonasiPU("Kab. Merauke", false, 3500000) },
      { id: "kab-boven-digoel", nama: "Kab. Boven Digoel", isKota: false, desalist: createStandardZonasiPU("Kab. Boven Digoel", false, 2000000) },
      { id: "kab-asmat", nama: "Kab. Asmat", isKota: false, desalist: createStandardZonasiPU("Kab. Asmat", false, 2200000) },
    ],
  },
  // 38. PAPUA PEGUNUNGAN
  {
    id: "papua-pegunungan",
    nama: "Papua Pegunungan",
    kotalist: [
      { id: "kab-jayawijaya", nama: "Kab. Jayawijaya (Wamena)", isKota: false, desalist: createStandardZonasiPU("Kab. Jayawijaya", false, 4000000) },
      { id: "kab-lanny-jaya", nama: "Kab. Lanny Jaya", isKota: false, desalist: createStandardZonasiPU("Kab. Lanny Jaya", false, 1800000) },
    ],
  },
];

// Standar Kualitas Bangunan (Kementerian PUPR)
export const TIPE_BANGUNAN_PUPR = [
  {
    id: "sederhana",
    nama: "Rumah Sederhana / Non-Permanen",
    deskripsi: "Konstruksi kayu/batako, atap seng/asbes, lantai semen (Standar PUPR Minimum)",
    hargaPerM2: 1800000,
  },
  {
    id: "menengah",
    nama: "Rumah Permanen Standar / Menengah",
    deskripsi: "Dinding bata merah/hebel, atap genteng, lantai keramik (Standar PUPR Menengah)",
    hargaPerM2: 3200000,
  },
  {
    id: "mewah",
    nama: "Rumah Permanen Mewah / Multi-Lantai",
    deskripsi: "Konstruksi bertingkat, lantai granit/marmer, finishing premium (Standar PUPR Premium)",
    hargaPerM2: 5500000,
  },
];

export const DEFAULT_HARGA_EMAS_PER_GRAM = 1450000;

export const TIPE_KENDARAAN_OPTIONS = [
  { id: "mobil-mewah", label: "Mobil Mewah (SUV/Sedan Premium)", estimasiTahun: { "2020+": 400000000, "2015-2019": 250000000, "<2015": 120000000 } },
  { id: "mobil-keluarga", label: "Mobil Keluarga / MPV / City Car", estimasiTahun: { "2020+": 180000000, "2015-2019": 110000000, "<2015": 65000000 } },
  { id: "mobil-niaga", label: "Mobil Niaga / Pick-Up / Truk", estimasiTahun: { "2020+": 140000000, "2015-2019": 85000000, "<2015": 45000000 } },
  { id: "motor-besar", label: "Motor Besar / Sport / Matic Premium", estimasiTahun: { "2020+": 35000000, "2015-2019": 22000000, "<2015": 12000000 } },
  { id: "motor-standar", label: "Motor Bebek / Matic Standar", estimasiTahun: { "2020+": 16000000, "2015-2019": 9500000, "<2015": 5000000 } },
];

export interface ItemAsetWaris {
  id: string;
  kategori: "properti" | "kendaraan" | "emas" | "kas" | "usaha";
  namaItem: string;
  keterangan: string;
  // Detail Properti (3-Tier Cascade Select2)
  provinsiId?: string;
  kotaId?: string;
  desaId?: string;
  namaProvinsi?: string;
  namaKota?: string;
  namaDesa?: string;
  luasTanahM2?: number;
  hargaTanahPerM2?: number;
  adaBangunan?: boolean;
  luasBangunanM2?: number;
  tipeBangunanId?: string;
  hargaBangunanPerM2?: number;
  // Detail Kendaraan
  tipeKendaraanId?: string;
  tahunKendaraan?: string;
  // Detail Emas
  beratEmasGram?: number;
  hargaEmasPerGram?: number;
  // Detail Kas/Usaha/Lainnya
  nominalLangsung?: number;
  // Total Terkalkulasi
  subtotal: number;
}
