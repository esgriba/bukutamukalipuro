import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GuestListSWR from "@/components/GuestListSWR";
import AdminNav from "@/components/AdminNav";
import AdminRefreshHead from "@/components/AdminRefreshHead";
import AdminDataStatus from "@/components/AdminDataStatus";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Admin - Kantor Kecamatan Kalipuro",
  description:
    "Halaman Admin untuk mengelola data tamu di Kantor Kecamatan Kalipuro",
};

// Disable cache for this page
export const revalidate = 0;
export const dynamic = "force-dynamic";

// This would normally check session/auth token
const isAuthenticated = true;

export default async function AdminPage() {
  // This would normally redirect to login if not authenticated
  if (!isAuthenticated) {
    redirect("/login");
  }

  // Fetch data from database
  const guests = await prisma.guestEntry.findMany({
    orderBy: {
      createdAt: "desc",
    },
    take: 10,
  });

  // Calculate total pages (would be done with count in production)
  const totalGuests = await prisma.guestEntry.count();
  const totalPages = Math.ceil(totalGuests / 10);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50 py-10">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {" "}
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800">
                Data Buku Tamu
              </h1>
              <div className="flex space-x-2">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  Export Data
                </button>
              </div>
            </div>
            <AdminNav />{" "}
            {/* This component adds a periodic refresh for real-time data updates */}
            <div className="mt-4">
              <AdminRefreshHead />
            </div>
            {/* Database status indicator */}
            <div className="mt-2 mb-4">
              <AdminDataStatus />
            </div>
            <div className="mt-4">
              <GuestListSWR
                initialGuests={JSON.parse(JSON.stringify(guests))}
                totalPages={totalPages}
              />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
