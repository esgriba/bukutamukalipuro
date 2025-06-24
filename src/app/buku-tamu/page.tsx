import GuestBookForm from "@/components/GuestBookForm";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Buku Tamu - Kantor Kecamatan Kalipuro",
  description:
    "Form Buku Tamu Digital untuk pengunjung Kantor Kecamatan Kalipuro",
};

export default function BukuTamu() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-10">
          <div className="max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">
                Buku Tamu Digital
              </h1>
              <p className="mt-2 text-gray-600">
                Silakan isi form di bawah ini dengan data yang benar untuk
                membantu kami meningkatkan kualitas pelayanan
              </p>
            </div>

            <GuestBookForm />

            <div className="mt-10 bg-blue-50 p-4 rounded-md">
              <h2 className="text-lg font-semibold text-blue-700">
                Catatan Penting:
              </h2>
              <ul className="mt-2 list-disc list-inside text-gray-700 space-y-1">
                <li>Pastikan data yang Anda masukkan sudah benar</li>
                <li>NIK yang dimasukkan harus sesuai dengan KTP</li>
                <li>Dokumentasi pelayanan bersifat opsional</li>
                <li>
                  Data Anda akan dijaga kerahasiaannya sesuai ketentuan yang
                  berlaku
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
