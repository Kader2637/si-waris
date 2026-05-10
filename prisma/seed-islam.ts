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
  console.log('--- RESET DATABASE & SEED ISLAM ---');
  await prisma.hasilWaris.deleteMany();
  await prisma.ahliWaris.deleteMany();
  await prisma.jenazah.deleteMany();

  console.log('--- KASUS 1: KAKEK BADRUN (GHARRAWAIN) ---');
  await prisma.jenazah.create({
    data: {
      nama: 'H. Badrun',
      nik: '3578012345670001',
      gender: 'Laki-laki',
      keterangan: 'Kakek',
      tanggalWafat: new Date('2024-01-10'),
      hartaKotor: 600000000,
      ahliWaris: {
        create: [
          { nama: 'Hj. Fatimah', nik: '3578012345110001', hubungan: 'Istri' },
          { nama: 'Ibu Badrun', nik: '3578012345110002', hubungan: 'Ibu' },
          { nama: 'Ayah Badrun', nik: '3578012345110003', hubungan: 'Ayah' },
        ]
      }
    }
  });

  console.log('--- KASUS 2: AYAH HARTONO (RADD) ---');
  await prisma.jenazah.create({
    data: {
      nama: 'Bapak Hartono',
      nik: '3578012345670003',
      gender: 'Laki-laki',
      keterangan: 'Ayah (Meninggal sebagai Bapak)',
      tanggalWafat: new Date('2023-11-25'),
      hartaKotor: 400000000,
      ahliWaris: {
        create: [
          { nama: 'Istri Hartono', nik: '3578012345220001', hubungan: 'Istri' },
          { nama: 'Putri Hartono', nik: '3578012345220002', hubungan: 'Anak Perempuan' },
        ]
      }
    }
  });

  console.log('--- KASUS 3: IBU AMINAH (NORMAL) ---');
  await prisma.jenazah.create({
    data: {
      nama: 'Ibu Aminah',
      nik: '3578012345670002',
      gender: 'Perempuan',
      keterangan: 'Ibu (Meninggal sebagai Mama/Ibu)',
      tanggalWafat: new Date('2024-02-14'),
      hartaKotor: 1200000000,
      ahliWaris: {
        create: [
          { nama: 'Suami Aminah', nik: '3578012345330001', hubungan: 'Suami' },
          { nama: 'Zaid (Anak)', nik: '3578012345330002', hubungan: 'Anak Laki-laki' },
          { nama: 'Aisyah (Anak)', nik: '3578012345330003', hubungan: 'Anak Perempuan' },
        ]
      }
    }
  });

  console.log('--- KASUS 4: ANAK YUSUF (AUL) ---');
  await prisma.jenazah.create({
    data: {
      nama: 'Ahmad Yusuf',
      nik: '3578012345670004',
      gender: 'Laki-laki',
      keterangan: 'Anak Laki-laki',
      tanggalWafat: new Date('2024-03-01'),
      hartaKotor: 800000000,
      ahliWaris: {
        create: [
          { nama: 'Istri Yusuf', nik: '3578012345440001', hubungan: 'Istri' },
          { nama: 'Sdr Pr 1', nik: '3578012345440002', hubungan: 'Saudara Perempuan Sekandung' },
          { nama: 'Sdr Pr 2', nik: '3578012345440003', hubungan: 'Saudara Perempuan Sekandung' },
          { nama: 'Ibu Yusuf', nik: '3578012345440004', hubungan: 'Ibu' },
        ]
      }
    }
  });

  console.log('--- KASUS 5: NENEK ROSIDAH (MAHJUB) ---');
  await prisma.jenazah.create({
    data: {
      nama: 'Hj. Rosidah',
      nik: '3578012345670005',
      gender: 'Perempuan',
      keterangan: 'Nenek',
      tanggalWafat: new Date('2023-09-30'),
      hartaKotor: 500000000,
      ahliWaris: {
        create: [
          { nama: 'Ayah Rosidah', nik: '3578012345550001', hubungan: 'Ayah' },
          { nama: 'Cucu Laki-laki', nik: '3578012345550002', hubungan: 'Cucu Laki-laki' },
          { nama: 'Saudara Laki-laki', nik: '3578012345550003', hubungan: 'Saudara Laki-laki Sekandung' },
        ]
      }
    }
  });

  console.log('--- SEEDING ISLAM SELESAI ---');
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
