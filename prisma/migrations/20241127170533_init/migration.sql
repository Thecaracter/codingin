-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'PROSES', 'SELESAI', 'DITOLAK');

-- CreateTable
CREATE TABLE "Order" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "namaAplikasi" TEXT NOT NULL,
    "keperluan" TEXT NOT NULL,
    "teknologi" TEXT[],
    "fitur" TEXT[],
    "deadline" TIMESTAMP(3) NOT NULL,
    "akunTiktok" TEXT NOT NULL,
    "status" "Status" NOT NULL DEFAULT 'PENDING',
    "buktiDP" TEXT,
    "buktiPelunasan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);
