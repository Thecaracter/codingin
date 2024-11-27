/*
  Warnings:

  - You are about to drop the `Order` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Order";

-- CreateTable
CREATE TABLE "Pesanan" (
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

    CONSTRAINT "Pesanan_pkey" PRIMARY KEY ("id")
);
