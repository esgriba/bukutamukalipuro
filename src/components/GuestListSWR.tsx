"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";

type Guest = {
  id: number;
  nama: string;
  nik: string;
  desaKelurahan: string;
  alamat: string;
  noTelepon: string;
  keperluan: string;
  tanggalPelayanan: string;
  dokumentasiPelayanan: string | null;
  createdAt: string;
};

type GuestListProps = {
  initialGuests: Guest[];
  totalPages: number;
};

// Custom fetcher dengan no-cache
const fetcher = async (url: string) => {
  const res = await fetch(url, {
    headers: {
      "Cache-Control": "no-cache, no-store, must-revalidate",
      Pragma: "no-cache",
      Expires: "0",
    },
    next: { revalidate: 0 },
  });

  if (!res.ok) {
    const error = new Error("An error occurred while fetching the data.");
    error.message = await res.text();
    throw error;
  }

  return res.json();
};

export default function GuestListSWR({
  initialGuests,
  totalPages: initialTotalPages,
}: GuestListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [timestamp, setTimestamp] = useState(Date.now()); // Use state for timestamp

  // Buat URL API dengan parameter yang diperlukan
  const apiUrl = `/api/guestbook?page=${currentPage}&limit=10&search=${encodeURIComponent(
    searchTerm
  )}&_t=${timestamp}`; // Gunakan timestamp dari state untuk menghindari infinite refetch
  // Gunakan SWR untuk fetching data
  const { data, error, isLoading, mutate } = useSWR(apiUrl, fetcher, {
    fallbackData: {
      data: initialGuests,
      total: initialGuests.length,
      meta: { page: 1, limit: 10, totalPages: initialTotalPages },
    },
    revalidateOnFocus: true,
    revalidateOnMount: true,
    dedupingInterval: 0,
    keepPreviousData: true, // Pertahankan data sebelumnya saat loading untuk menghindari flickering
    errorRetryCount: 3, // Batasi retry otomatis saat error
    refreshInterval: 30000, // Refresh otomatis setiap 30 detik
  });
  // Mendapatkan data dari hasil SWR atau data awal
  const guests: Guest[] = data?.data || [];
  const totalPagesCount = data?.meta?.totalPages || initialTotalPages;
  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    // Update timestamp ketika pindah halaman untuk memastikan data fresh
    setTimestamp(Date.now());
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    // Update timestamp ketika pencarian untuk memastikan data fresh
    setTimestamp(Date.now());
    mutate();
  };

  const handleRefresh = () => {
    // Update timestamp ketika refresh untuk memastikan data fresh
    setTimestamp(Date.now());
    mutate();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      {/* Search Form */}
      <div className="p-4 border-b">
        <div className="flex flex-wrap items-center gap-2 justify-between mb-3">
          <h2 className="text-xl font-bold">Daftar Tamu</h2>
          <button
            onClick={handleRefresh}
            className="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm flex items-center gap-1"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z"
                clipRule="evenodd"
              />
            </svg>
            Refresh Data
          </button>
        </div>

        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Cari berdasarkan nama, NIK, atau keperluan..."
            className="flex-1 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Cari
          </button>
        </form>
      </div>{" "}
      {/* Loading indicator - show at the top while keeping data visible */}
      {isLoading && (
        <div className="p-2 bg-blue-50 text-center flex items-center justify-center gap-2">
          <div className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-blue-600"></div>
          <p className="text-blue-600 text-sm">Memperbarui data...</p>
        </div>
      )}
      {/* Error state */}
      {error && (
        <div className="p-4 text-center">
          <div className="bg-red-100 p-4 rounded-lg text-red-700 mb-4">
            <p>Gagal memuat data. Silahkan coba lagi.</p>
            <p className="text-sm mt-1">{error.message}</p>
          </div>
          <button
            onClick={() => {
              setTimestamp(Date.now());
              mutate();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      )}
      {/* Guest list - always show even while loading */}
      {(guests.length > 0 || !isLoading) && (
        <>
          {guests.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Belum ada data tamu atau tidak ada hasil yang cocok dengan
              pencarian.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      No
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Nama / NIK
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Desa & Alamat
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tanggal
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Aksi
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {guests.map((guest, index) => (
                    <tr key={guest.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(currentPage - 1) * 10 + index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {guest.nama}
                        </div>
                        <div className="text-sm text-gray-500">{guest.nik}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {guest.desaKelurahan}
                        </div>
                        <div className="text-sm text-gray-500">
                          {guest.alamat}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(guest.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <Link
                          href={`/admin/detail/${guest.id}`}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Detail
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPagesCount > 1 && (
            <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200">
              <div className="flex-1 flex justify-center">
                <div>
                  <nav
                    className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                    aria-label="Pagination"
                  >
                    <button
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      onClick={() =>
                        handlePageChange(Math.max(1, currentPage - 1))
                      }
                      disabled={currentPage === 1}
                    >
                      &laquo; Prev
                    </button>

                    {Array.from(
                      { length: totalPagesCount },
                      (_, i) => i + 1
                    ).map((page) => (
                      <button
                        key={page}
                        className={`relative inline-flex items-center px-4 py-2 border ${
                          currentPage === page
                            ? "bg-blue-600 text-white border-blue-600"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        } text-sm font-medium`}
                        onClick={() => handlePageChange(page)}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      onClick={() =>
                        handlePageChange(
                          Math.min(totalPagesCount, currentPage + 1)
                        )
                      }
                      disabled={currentPage === totalPagesCount}
                    >
                      Next &raquo;
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
