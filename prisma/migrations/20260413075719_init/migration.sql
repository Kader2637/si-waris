-- CreateTable
CREATE TABLE "Jenazah" (
    "id" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "hartaKotor" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "utang" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "wasiat" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Jenazah_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AhliWaris" (
    "id" TEXT NOT NULL,
    "jenazahId" TEXT NOT NULL,
    "nama" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "hubungan" TEXT NOT NULL,
    "fileKtpKk" TEXT,
    "status" TEXT,
    "alasanMahjub" TEXT,
    "jatahPersen" TEXT,
    "jatahNominal" DOUBLE PRECISION DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AhliWaris_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LogKalkulasi" (
    "id" TEXT NOT NULL,
    "jenazahId" TEXT NOT NULL,
    "kpk" INTEGER,
    "statusAulRadd" TEXT,
    "totalHartaBersih" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "LogKalkulasi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LogKalkulasi_jenazahId_key" ON "LogKalkulasi"("jenazahId");

-- AddForeignKey
ALTER TABLE "AhliWaris" ADD CONSTRAINT "AhliWaris_jenazahId_fkey" FOREIGN KEY ("jenazahId") REFERENCES "Jenazah"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LogKalkulasi" ADD CONSTRAINT "LogKalkulasi_jenazahId_fkey" FOREIGN KEY ("jenazahId") REFERENCES "Jenazah"("id") ON DELETE CASCADE ON UPDATE CASCADE;
