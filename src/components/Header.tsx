import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <div className="mr-3">
            <Image
              src="https://ujjxluxutvyvzjwqrmxv.supabase.co/storage/v1/object/public/dokumentasi//logo-kalipuro.png"
              alt="Logo Kecamatan Kalipuro"
              width={50}
              height={50}
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              Kantor Kecamatan Kalipuro
            </h1>
            <p className="text-sm text-gray-600">
              Kabupaten Banyuwangi, Jawa Timur
            </p>
          </div>
        </div>

        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link
                href="/"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Beranda
              </Link>
            </li>
            <li>
              <Link
                href="/buku-tamu"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Buku Tamu
              </Link>
            </li>
            <li>
              <Link
                href="/admin"
                className="text-gray-700 hover:text-blue-600 transition-colors"
              >
                Admin
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
