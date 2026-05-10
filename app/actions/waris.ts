"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { calculateFaraid } from "@/lib/faraidLogic";
import { calculateAdatJawa } from "@/lib/jawaLogic";
import { put } from "@vercel/blob";


export async function getKeluargaList(search?: string, hukum?: string, page: number = 1, limit: number = 6) {
  const where: any = {};
  
  if (search) {
    where.OR = [
      { nama: { contains: search, mode: 'insensitive' } },
      { nik: { contains: search, mode: 'insensitive' } }
    ];
  }

  if (hukum && hukum !== "Semua") {
    where.hukum = hukum;
  }

  const skip = (page - 1) * limit;

  const [data, total] = await Promise.all([
    prisma.jenazah.findMany({
      where,
      include: {
        ahliWaris: true,
        logKalkulasi: true,
        hasilWaris: { select: { id: true }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limit,
    }),
    prisma.jenazah.count({ where })
  ]);

  return { data, total, totalPages: Math.ceil(total / limit) };
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

      // Simpan pemetaan ID sementara ke ID database untuk parentId
      const idMap: Record<string, string> = {};

      for (let i = 0; i < ahliWarisData.length; i++) {
        const heir = ahliWarisData[i];
        let fileUrl = null;

        const file = formData.get(`file_${i}`) as File | null;
        if (file) {
          const blob = await put(`ktp/${Date.now()}-${file.name}`, file, {
            access: 'public',
          });
          fileUrl = blob.url;
        }

        const createdHeir = await tx.ahliWaris.create({
          data: {
            jenazahId: jenazah.id,
            nama: heir.nama,
            nik: heir.nik,
            hubungan: heir.hubungan,
            statusHidup: heir.statusHidup,
            fileKtpKk: fileUrl,
          }
        });
        idMap[heir.id] = createdHeir.id;
      }

      // Update parentId setelah semua ahli waris dibuat
      for (let i = 0; i < ahliWarisData.length; i++) {
        const heir = ahliWarisData[i];
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
    });

    revalidatePath("/admin/keluarga");
    return { success: true, id: result.id };
  } catch (error) {
    console.error("Error creating keluarga:", error);
    return { success: false, error: "Gagal menyimpan data ke database profesional." };
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
          ahliWarisId: res.ahliWarisId,
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
        statusAulRadd: (results as any).statusAulRadd || "Normal",
        totalHartaBersih: results.hartaBersih,
        hartaGonoGini: (results as any).hartaGonoGini || 0,
      },
      create: {
        jenazahId: jenazah.id,
        kpk: (results as any).kpk || null,
        statusAulRadd: (results as any).statusAulRadd || "Normal",
        totalHartaBersih: results.hartaBersih,
        hartaGonoGini: (results as any).hartaGonoGini || 0,
      }
    });
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
    },
    orderBy: { createdAt: 'desc' }
  });
}
