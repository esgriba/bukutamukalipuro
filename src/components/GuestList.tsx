"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

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

export default function GuestList({
  initialGuests,
  totalPages,
}: GuestListProps) {
  const [guests, setGuests] = useState<Guest[]>(initialGuests);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [totalPagesCount, setTotalPagesCount] = useState(totalPages);
  // Fetch data from API based on page and search term
  const fetchGuests = async (page: number, search: string = "") => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `/api/guestbook?page=${page}&limit=10&search=${encodeURIComponent(
          search
        )}`
      );
      if (!response.ok) throw new Error("Failed to fetch data");

      const data = await response.json();
      if (data.data) {
        setGuests(data.data);
        setTotalPagesCount(Math.ceil(data.total / 10));
      } else {
        console.error("Unexpected API response format:", data);
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Error fetching guest data:", error);
      // Set empty array if error occurs so UI doesn't break
      setGuests([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    await fetchGuests(page, searchTerm);
  };

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    await fetchGuests(1, searchTerm);
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
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : guests.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Tidak ada data tamu yang ditemukan.
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nama
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NIK
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Desa/Kelurahan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Keperluan
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
              {guests.map((guest) => (
                <tr key={guest.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {guest.nama}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">{guest.nik}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {guest.desaKelurahan}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-500 truncate max-w-xs">
                      {guest.keperluan}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {formatDate(guest.tanggalPelayanan)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <Link
                      href={`/admin/detail/${guest.id}`}
                      className="text-blue-600 hover:text-blue-900 mr-4"
                    >
                      Detail
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPagesCount > 1 && (
        <div className="px-6 py-4 flex justify-between items-center border-t">
          <button
            onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className={`px-3 py-1 rounded-md ${
              currentPage === 1
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-600 hover:bg-blue-50"
            }`}
          >
            Sebelumnya
          </button>

          <div className="flex items-center">
            {Array.from({ length: totalPagesCount }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  disabled={isLoading}
                  className={`px-3 py-1 mx-1 rounded-md ${
                    currentPage === page
                      ? "bg-blue-600 text-white"
                      : "text-blue-600 hover:bg-blue-50"
                  }`}
                >
                  {page}
                </button>
              )
            )}
          </div>

          <button
            onClick={() =>
              currentPage < totalPagesCount && handlePageChange(currentPage + 1)
            }
            disabled={currentPage === totalPagesCount || isLoading}
            className={`px-3 py-1 rounded-md ${
              currentPage === totalPagesCount
                ? "text-gray-400 cursor-not-allowed"
                : "text-blue-600 hover:bg-blue-50"
            }`}
          >
            Selanjutnya
          </button>
        </div>
      )}
    </div>
  );
}
