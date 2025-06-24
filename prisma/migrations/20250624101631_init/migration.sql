-- CreateTable
CREATE TABLE "GuestEntry" (
    "id" SERIAL NOT NULL,
    "nama" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "desaKelurahan" TEXT NOT NULL,
    "alamat" TEXT NOT NULL,
    "noTelepon" TEXT NOT NULL,
    "keperluan" TEXT NOT NULL,
    "tanggalPelayanan" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dokumentasiPelayanan" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GuestEntry_pkey" PRIMARY KEY ("id")
);
