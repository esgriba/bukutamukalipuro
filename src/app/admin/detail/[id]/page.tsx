import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: "Detail Tamu - Kantor Kecamatan Kalipuro",
  description: "Detail data tamu di Kantor Kecamatan Kalipuro",
};

// Disable cache for this page
export const dynamic = "force-dynamic";
export const revalidate = 0;

type Props = {
  params: {
    id: string;
  };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function GuestDetail({ params }: Props) {
  const guestId = parseInt(params.id);

  // Handle invalid ID
  if (isNaN(guestId)) {
    console.error(`[DetailPage] Invalid guest ID format: ${params.id}`);
    notFound();
  } // Fetch guest data from API instead of direct Prisma call to ensure cache control
  const timestamp = Date.now(); // Add timestamp to prevent caching

  // Fix the URL construction for Vercel deployment with enhanced error logging
  const protocol = process.env.NODE_ENV === "production" ? "https" : "http";
  const domain =
    process.env.VERCEL_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    "localhost:3000";
  const baseUrl = domain.includes("://") ? domain : `${protocol}://${domain}`;

  console.log(
    `[DetailPage] Environment: ${process.env.NODE_ENV}, Base URL: ${baseUrl}`
  );
  console.log(
    `[DetailPage] Fetching guest ID ${guestId} from ${baseUrl}/api/guestbook/${guestId}?_t=${timestamp}`
  );

  let guestData = null;
  let apiError = null;

  try {
    const response = await fetch(
      `${baseUrl}/api/guestbook/${guestId}?_t=${timestamp}`,
      {
        cache: "no-store",
        next: { revalidate: 0 },
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
          Pragma: "no-cache",
          Expires: "0",
          "x-requested-from": "detail-page-server",
        },
      }
    );

    if (!response.ok) {
      throw new Error(
        `API returned status ${response.status}: ${response.statusText}`
      );
    }

    const data = await response.json();
    if (data && data.guest) {
      guestData = data.guest;
      console.log(
        `[DetailPage] Successfully fetched guest data from API for ID ${guestId}`
      );
    } else {
      throw new Error(`API response missing guest data for ID ${guestId}`);
    }
  } catch (error) {
    apiError = error instanceof Error ? error.message : String(error);
    console.error(`[DetailPage] API fetch error for ID ${guestId}:`, error);
    // Will fall back to direct Prisma query below
  }
  // If API call fails or guestData is null, fall back to direct Prisma query
  let guest = guestData;

  try {
    if (!guest) {
      console.log(
        `[DetailPage] API approach failed with error: ${apiError}, falling back to direct Prisma query for guest ID ${guestId}`
      );

      // Fall back to direct Prisma query
      const prismaResult = await prisma.guestEntry.findUnique({
        where: {
          id: guestId,
        },
      });

      if (prismaResult) {
        guest = prismaResult;
        console.log(
          `[DetailPage] Direct Prisma query successful, found guest ID ${guestId}`
        );
      } else {
        console.error(`[DetailPage] Guest ID ${guestId} not found in database`);
        // Guest not found in database either
        notFound();
      }
    }
  } catch (error) {
    console.error(`[DetailPage] Error processing guest data:`, error);

    // Last resort attempt with Prisma
    console.log(`[DetailPage] Making last resort attempt with Prisma`);
    try {
      guest = await prisma.guestEntry.findUnique({
        where: {
          id: guestId,
        },
      });

      if (guest) {
        console.log(
          `[DetailPage] Last resort Prisma attempt successful, found guest ID ${guestId}`
        );
      }
    } catch (prismaError) {
      console.error(`[DetailPage] Final Prisma fallback failed:`, prismaError);
      throw new Error(
        `Failed to retrieve guest data: ${
          prismaError instanceof Error
            ? prismaError.message
            : String(prismaError)
        }`
      );
    }
  }

  // If guest not found
  if (!guest) {
    console.error(
      `[DetailPage] Guest ID ${guestId} not found after all attempts`
    );

    notFound();
  }

  // Format date for display
  const formatDate = (dateString: Date | string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Link
                href="/admin"
                className="text-blue-600 hover:underline flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z"
                    clipRule="evenodd"
                  />
                </svg>
                Kembali ke Daftar Tamu
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b">
                <h1 className="text-2xl font-bold text-gray-800">
                  Detail Tamu
                </h1>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                      Informasi Tamu
                    </h2>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Nama Lengkap</p>
                        <p className="text-gray-800 font-medium">
                          {guest.nama}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">NIK</p>
                        <p className="text-gray-800 font-medium">{guest.nik}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Desa/Kelurahan</p>
                        <p className="text-gray-800 font-medium">
                          {guest.desaKelurahan}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Alamat Lengkap</p>
                        <p className="text-gray-800 font-medium">
                          {guest.alamat}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Nomor Telepon</p>
                        <p className="text-gray-800 font-medium">
                          {guest.noTelepon}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                      Informasi Pelayanan
                    </h2>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-500">Keperluan</p>
                        <p className="text-gray-800 font-medium">
                          {guest.keperluan}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">
                          Tanggal Pelayanan
                        </p>
                        <p className="text-gray-800 font-medium">
                          {formatDate(guest.tanggalPelayanan)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500">Terdaftar Pada</p>
                        <p className="text-gray-800 font-medium">
                          {formatDate(guest.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {guest.dokumentasiPelayanan && (
                  <div className="mt-8">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">
                      Dokumentasi Pelayanan
                    </h2>
                    <div className="mt-2 relative h-64 w-full md:w-96 bg-gray-100 rounded-lg overflow-hidden">
                      <Image
                        src={guest.dokumentasiPelayanan}
                        alt="Dokumentasi Pelayanan"
                        fill
                        sizes="(max-width: 768px) 100vw, 384px"
                        style={{ objectFit: "cover" }}
                        className="rounded-lg"
                      />
                    </div>
                  </div>
                )}

                <div className="mt-8 flex justify-end space-x-3">
                  <Link
                    href={`/admin/edit/${guest.id}`}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Edit Data
                  </Link>
                  <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors">
                    Hapus Data
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
