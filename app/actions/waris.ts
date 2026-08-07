"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { calculateFaraid } from "@/lib/faraidLogic";
import { calculateAdatJawa } from "@/lib/jawaLogic";
import { calculatePerdata } from "@/lib/perdataLogic";
import { put } from "@vercel/blob";

export async function getKeluargaList(search?: string, hukum?: string, page: number = 1, limit: number = 6) {
  const cleanSearch = search?.trim().toLowerCase();

  try {
    // 1. Fetch data from Prisma
    let allRecords = await prisma.jenazah.findMany({
      include: {
        ahliWaris: true,
        logKalkulasi: true,
        hasilWaris: { select: { id: true }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
    });

    // 2. Filter Hukum if requested
    if (hukum && hukum !== "Semua") {
      allRecords = allRecords.filter((item) => 
        item.hukum?.toLowerCase() === hukum.toLowerCase()
      );
    }

    // 3. Filter Search (Case-Insensitive across nama, nik, keterangan, hukum)
    if (cleanSearch) {
      allRecords = allRecords.filter((item) => {
        const namaMatch = item.nama?.toLowerCase().includes(cleanSearch);
        const nikMatch = item.nik?.toLowerCase().includes(cleanSearch);
        const ketMatch = item.keterangan?.toLowerCase().includes(cleanSearch);
        const hukumMatch = item.hukum?.toLowerCase().includes(cleanSearch);
        return namaMatch || nikMatch || ketMatch || hukumMatch;
      });
    }

    const total = allRecords.length;
    const totalPages = Math.ceil(total / limit) || 1;
    const skip = (page - 1) * limit;
    const paginatedData = allRecords.slice(skip, skip + limit);

    return { data: paginatedData, total, totalPages };
  } catch (err) {
    console.error("Error fetching getKeluargaList:", err);
    return { data: [], total: 0, totalPages: 1 };
  }
}

export async function getKeluargaById(id: string) {
  return await prisma.jenazah.findUnique({
    where: { id },
    include: {
      ahliWaris: {
        include: { hasil: true }
      },
      logKalkulasi: true,
    }
  });
}

export async function createKeluarga(formData: FormData) {
  const nama = formData.get("nama") as string;
  const nik = formData.get("nik") as string;
  const gender = formData.get("gender") as string;
  const keterangan = formData.get("keterangan") as string;
  const tanggalWafat = formData.get("tanggalWafat") ? new Date(formData.get("tanggalWafat") as string) : new Date();
  const hartaKotor = parseFloat(formData.get("hartaKotor") as string);
  const utang = parseFloat(formData.get("utang") as string) || 0;
  const wasiat = parseFloat(formData.get("wasiat") as string) || 0;
  const hukum = formData.get("hukum") as string || "Islam";
  const potongGonoGini = formData.get("potongGonoGini") === "true";
  const metodeAdat = formData.get("metodeAdat") as string;

  const ahliWarisRaw = formData.get("ahliWarisJson") as string;
  const ahliWarisData = JSON.parse(ahliWarisRaw);

  const ahliWarisWithFiles = [...ahliWarisData];
  for (let i = 0; i < ahliWarisWithFiles.length; i++) {
    const file = formData.get(`file_${i}`) as File | null;
    if (file && file.size > 0) {
      try {
        const blob = await put(`ktp/${Date.now()}-${file.name.replace(/\s+/g, '_')}`, file, {
          access: 'public',
        });
        ahliWarisWithFiles[i].fileKtpKk = blob.url;
      } catch (err) {
        console.error("Gagal upload file ke Vercel Blob:", err);
      }
    }
  }

  try {
    const result = await prisma.$transaction(async (tx) => {
      const jenazah = await tx.jenazah.create({
        data: {
          nama,
          nik,
          gender,
          keterangan,
          tanggalWafat,
          hartaKotor,
          utang,
          wasiat,
          hukum,
          potongGonoGini,
        }
      });

      const idMap: Record<string, string> = {};

      for (let i = 0; i < ahliWarisWithFiles.length; i++) {
        const heir = ahliWarisWithFiles[i];

        const createdHeir = await tx.ahliWaris.create({
          data: {
            jenazahId: jenazah.id,
            nama: heir.nama,
            nik: heir.nik,
            hubungan: heir.hubungan,
            statusHidup: heir.statusHidup,
            fileKtpKk: heir.fileKtpKk || null,
          }
        });
        idMap[heir.id] = createdHeir.id;
      }

      for (let i = 0; i < ahliWarisWithFiles.length; i++) {
        const heir = ahliWarisWithFiles[i];
        if (heir.parentId && idMap[heir.parentId]) {
          await tx.ahliWaris.update({
            where: { id: idMap[heir.id] },
            data: { parentId: idMap[heir.parentId] }
          });
        }
      }

      if (hukum === "Jawa") {
        await tx.logKalkulasi.create({
          data: {
            jenazahId: jenazah.id,
            metodeAdat,
            totalHartaBersih: hartaKotor - utang - wasiat,
          }
        });
      }

      return jenazah;
    }, {
      maxWait: 15000,
      timeout: 30000,
    });

    await processFaraid(result.id);

    revalidatePath("/admin/keluarga");
    return { success: true, id: result.id };
  } catch (error: any) {
    console.error("Error creating keluarga:", error);
    return { success: false, error: error.message || "Gagal menyimpan data ke database profesional." };
  }
}

export async function processFaraid(jenazahId: string) {
  const jenazah = await prisma.jenazah.findUnique({
    where: { id: jenazahId },
    include: { 
      ahliWaris: true,
      logKalkulasi: true 
    }
  });

  if (!jenazah) return { success: false, error: "Data tidak ditemukan." };

  const results = jenazah.hukum === "Jawa" 
    ? calculateAdatJawa(jenazah, jenazah.ahliWaris, jenazah.logKalkulasi?.metodeAdat as any)
    : jenazah.hukum === "Perdata"
    ? calculatePerdata(jenazah, jenazah.ahliWaris)
    : calculateFaraid(jenazah, jenazah.ahliWaris);

  await prisma.$transaction(async (tx) => {
    await tx.hasilWaris.deleteMany({
      where: { jenazahId: jenazah.id }
    });

    const ahliWarisGetted = (results as any).ahliWarisGetted || (results as any).results;

    for (const res of ahliWarisGetted) {
      await tx.hasilWaris.create({
        data: {
          jenazahId: jenazah.id,
          ahliWarisId: res.ahliWarisId || res.id,
          status: res.status,
          alasan: res.alasan,
          jatahPersen: res.jatahPersen,
          jatahNominal: res.jatahNominal
        }
      });
    }

    await tx.logKalkulasi.upsert({
      where: { jenazahId: jenazah.id },
      update: {
        kpk: (results as any).kpk || null,
        statusAulRadd: (results as any).statusAulRadd || (jenazah.hukum === "Perdata" ? "KUHPerdata (BW)" : "Normal"),
        totalHartaBersih: results.hartaBersih,
        hartaGonoGini: (results as any).hartaGonoGini || 0,
      },
      create: {
        jenazahId: jenazah.id,
        kpk: (results as any).kpk || null,
        statusAulRadd: (results as any).statusAulRadd || (jenazah.hukum === "Perdata" ? "KUHPerdata (BW)" : "Normal"),
        totalHartaBersih: results.hartaBersih,
        hartaGonoGini: (results as any).hartaGonoGini || 0,
      }
    });
  }, {
    maxWait: 10000,
    timeout: 20000,
  });

  revalidatePath(`/admin/keluarga/${jenazahId}`);
  return { success: true };
}

export async function deleteKeluarga(id: string) {
  await prisma.jenazah.delete({ where: { id } });
  revalidatePath("/admin/keluarga");
  return { success: true };
}

export async function getArsipList() {
  return await prisma.jenazah.findMany({
    where: {
      logKalkulasi: { isNot: null }
    },
    include: {
      logKalkulasi: true,
      ahliWaris: true,
    },
    orderBy: { createdAt: 'desc' }
  });
}
