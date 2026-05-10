// @ts-nocheck
import "dotenv/config";
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('--- SEEDING ADAT JAWA ---');

  // CASE 1: SEPIKUL_SEGENDONGAN (2:1 Ratio)
  const caseJawa1 = await prisma.jenazah.create({
    data: {
      nama: "Mbah Kromo Pawiro",
      nik: "3578010101010001",
      gender: "Laki-laki",
      keterangan: "Kakek",
      hartaKotor: 1200000000,
      hukum: "Jawa",
      potongGonoGini: true,
      logKalkulasi: {
        create: {
          metodeAdat: "SEPIKUL_SEGENDONGAN",
          totalHartaBersih: 1200000000,
        }
      },
      ahliWaris: {
        create: [
          { nama: "Nyai Kromo", nik: "3578010101010002", hubungan: "Istri" },
          { nama: "Slamet Utomo", nik: "3578010101010003", hubungan: "Anak Laki-laki" },
        ]
      }
    }
  });

  const sriAlm = await prisma.ahliWaris.create({
    data: {
      jenazahId: caseJawa1.id,
      nama: "Sri Utami (Alm)",
      nik: "3578010101010004",
      hubungan: "Anak Perempuan",
      statusHidup: false
    }
  });

  await prisma.ahliWaris.createMany({
    data: [
      { jenazahId: caseJawa1.id, nama: "Cucu Lanang (Anak Sri)", nik: "3578010101010005", hubungan: "Cucu Laki-laki", parentId: sriAlm.id },
      { jenazahId: caseJawa1.id, nama: "Cucu Wedok (Anak Sri)", nik: "3578010101010006", hubungan: "Cucu Perempuan", parentId: sriAlm.id },
    ]
  });

  // CASE 2: KUM_KUM_KUPAT (Equal Ratio) 
  const caseJawa2 = await prisma.jenazah.create({
    data: {
      nama: "Ibu Handayani",
      nik: "3578020202020001",
      gender: "Perempuan",
      keterangan: "Ibu (Meninggal sebagai Mama/Ibu)",
      hartaKotor: 900000000,
      hukum: "Jawa",
      potongGonoGini: false,
      logKalkulasi: {
        create: {
          metodeAdat: "KUM_KUM_KUPAT",
          totalHartaBersih: 900000000,
        }
      },
      ahliWaris: {
        create: [
          { nama: "Anak Siji", nik: "3578020202020002", hubungan: "Anak Laki-laki" },
          { nama: "Anak Loro", nik: "3578020202020003", hubungan: "Anak Perempuan" },
        ]
      }
    }
  });

  const anak3Alm = await prisma.ahliWaris.create({
    data: {
      jenazahId: caseJawa2.id,
      nama: "Anak Telu (Alm)",
      nik: "3578020202020004",
      hubungan: "Anak Laki-laki",
      statusHidup: false
    }
  });

  const cucuAlm = await prisma.ahliWaris.create({
    data: {
      jenazahId: caseJawa2.id,
      nama: "Putu (Alm)",
      nik: "3578020202020005",
      hubungan: "Cucu Laki-laki",
      parentId: anak3Alm.id,
      statusHidup: false
    }
  });

  await prisma.ahliWaris.create({
    data: {
      jenazahId: caseJawa2.id,
      nama: "Buyut (Ahli Waris Pengganti)",
      nik: "3578020202020006",
      hubungan: "Cucu Perempuan", 
      parentId: cucuAlm.id
    }
  });

  console.log('--- SEEDING ADAT JAWA SELESAI ---');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
