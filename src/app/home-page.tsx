import Link from "next/link";
import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex min-h-screen flex-col">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-black opacity-30"></div>
          </div>

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Selamat Datang di Kantor Kecamatan Kalipuro
              </h1>
              <p className="text-xl mb-8">
                Sistem Buku Tamu Digital untuk Pelayanan yang Lebih Baik
              </p>
              <Link
                href="/buku-tamu"
                className="inline-block px-6 py-3 bg-white text-blue-700 font-bold rounded-full hover:bg-blue-50 transition-colors"
              >
                Isi Buku Tamu
              </Link>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
                Tentang Kecamatan Kalipuro
              </h2>
              <p className="text-lg text-gray-600 mb-8 text-center">
                Kecamatan Kalipuro adalah salah satu kecamatan di Kabupaten
                Banyuwangi, Provinsi Jawa Timur. Kami berkomitmen memberikan
                pelayanan terbaik kepada masyarakat dengan mengedepankan
                transparansi, efisiensi, dan kepuasan masyarakat.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Pelayanan Cepat
                  </h3>
                  <p className="text-gray-600">
                    Proses administrasi yang cepat dan efisien untuk memenuhi
                    kebutuhan masyarakat.
                  </p>
                </div>

                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Terpercaya</h3>
                  <p className="text-gray-600">
                    Pelayanan yang dapat diandalkan dengan integritas dan
                    transparansi tinggi.
                  </p>
                </div>

                <div className="text-center p-6 bg-blue-50 rounded-lg">
                  <div className="inline-block p-3 bg-blue-100 rounded-full mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-10 w-10 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Responsif</h3>
                  <p className="text-gray-600">
                    Tanggap terhadap kebutuhan dan masukan dari masyarakat untuk
                    peningkatan layanan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Guest Book Section */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-6">
                Buku Tamu Digital
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                Untuk meningkatkan kualitas pelayanan kami, setiap pengunjung
                dimohon untuk mengisi buku tamu digital. Ini membantu kami
                melacak dan memperbaiki layanan kami kepada masyarakat.
              </p>
              <div className="mt-8">
                <Link
                  href="/buku-tamu"
                  className="inline-block px-6 py-3 bg-blue-600 text-white font-bold rounded-md hover:bg-blue-700 transition-colors"
                >
                  Isi Buku Tamu Sekarang
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-gray-800 mb-12 text-center">
              Pelayanan Kami
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Administrasi Kependudukan
                </h3>
                <p className="text-gray-600 mb-4">
                  Pengurusan dokumen kependudukan, surat pindah, dan informasi
                  kependudukan lainnya.
                </p>
                <span className="text-blue-600 font-medium">
                  Senin-Jumat, 08:00-15:00 WIB
                </span>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Perizinan
                </h3>
                <p className="text-gray-600 mb-4">
                  Pengurusan berbagai jenis izin tingkat kecamatan untuk
                  kegiatan masyarakat.
                </p>
                <span className="text-blue-600 font-medium">
                  Senin-Jumat, 08:00-15:00 WIB
                </span>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Legalisasi Dokumen
                </h3>
                <p className="text-gray-600 mb-4">
                  Legalisasi dan pengesahan dokumen-dokumen penting tingkat
                  kecamatan.
                </p>
                <span className="text-blue-600 font-medium">
                  Senin-Jumat, 08:00-15:00 WIB
                </span>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Konsultasi Masyarakat
                </h3>
                <p className="text-gray-600 mb-4">
                  Layanan konsultasi untuk berbagai permasalahan di tingkat
                  masyarakat.
                </p>
                <span className="text-blue-600 font-medium">
                  Senin-Jumat, 08:00-15:00 WIB
                </span>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Pemberdayaan Masyarakat
                </h3>
                <p className="text-gray-600 mb-4">
                  Program dan kegiatan untuk meningkatkan kesejahteraan dan
                  pemberdayaan masyarakat.
                </p>
                <span className="text-blue-600 font-medium">
                  Jadwal Menyesuaikan
                </span>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  Informasi Publik
                </h3>
                <p className="text-gray-600 mb-4">
                  Pelayanan informasi publik dan data terkait wilayah kecamatan.
                </p>
                <span className="text-blue-600 font-medium">
                  Senin-Jumat, 08:00-15:00 WIB
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="py-16 bg-gray-100">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
                Hubungi Kami
              </h2>

              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                  <div className="p-6 md:p-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Informasi Kontak
                    </h3>
                    <div className="space-y-4">
                      <div className="flex items-start">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-blue-600 mr-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <div>
                          <p className="text-gray-600">
                            Jl. Raya Kalipuro No. 123
                          </p>
                          <p className="text-gray-600">
                            Kabupaten Banyuwangi, Jawa Timur
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-blue-600 mr-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                          />
                        </svg>
                        <div>
                          <p className="text-gray-600">(0333) 123456</p>
                          <p className="text-gray-600">08123456789</p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-blue-600 mr-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <div>
                          <p className="text-gray-600">
                            kecamatan.kalipuro@banyuwangikab.go.id
                          </p>
                        </div>
                      </div>

                      <div className="flex items-start">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-blue-600 mr-3"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                        <div>
                          <p className="text-gray-600">
                            Senin - Jumat: 08:00 - 16:00 WIB
                          </p>
                          <p className="text-gray-600">Sabtu - Minggu: Tutup</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-100 p-6 md:p-8">
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      Kirim Pesan
                    </h3>
                    <form>
                      <div className="mb-4">
                        <input
                          type="text"
                          placeholder="Nama Lengkap"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="mb-4">
                        <input
                          type="email"
                          placeholder="Email"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="mb-4">
                        <textarea
                          rows={4}
                          placeholder="Pesan"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        ></textarea>
                      </div>
                      <button
                        type="submit"
                        className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                      >
                        Kirim Pesan
                      </button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
