"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { calculateFaraid } from "@/lib/faraidLogic";
import { put } from "@vercel/blob";


export async function getKeluargaList(search?: string) {
  return await prisma.jenazah.findMany({
    where: search ? {
      OR: [
        { nama: { contains: search, mode: 'insensitive' } },
        { nik: { contains: search, mode: 'insensitive' } }
      ]
    } : {},
    include: {
      ahliWaris: true,
      logKalkulasi: true,
    },
    orderBy: { createdAt: 'desc' }
  });
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
        }
      });

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

        await tx.ahliWaris.create({
          data: {
            jenazahId: jenazah.id,
            nama: heir.nama,
            nik: heir.nik,
            hubungan: heir.hubungan,
            fileKtpKk: fileUrl,
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
    include: { ahliWaris: true }
  });

  if (!jenazah) return { success: false, error: "Data tidak ditemukan." };

  const results = calculateFaraid(jenazah, jenazah.ahliWaris);

  await prisma.$transaction(async (tx) => {
    await tx.hasilWaris.deleteMany({
      where: { jenazahId: jenazah.id }
    });

    for (const res of results.ahliWarisGetted) {
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
        kpk: results.kpk,
        statusAulRadd: results.statusAulRadd,
        totalHartaBersih: results.hartaBersih,
      },
      create: {
        jenazahId: jenazah.id,
        kpk: results.kpk,
        statusAulRadd: results.statusAulRadd,
        totalHartaBersih: results.hartaBersih,
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
