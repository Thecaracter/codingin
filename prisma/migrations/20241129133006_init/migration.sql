-- CreateEnum
CREATE TYPE "Status" AS ENUM ('PENDING', 'PROSES', 'SELESAI', 'DITOLAK');

-- CreateTable
CREATE TABLE "Admin" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "Portofolio" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "deskripsi" TEXT NOT NULL,
    "techStack" TEXT[],
    "link" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Portofolio_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Admin_email_key" ON "Admin"("email");
