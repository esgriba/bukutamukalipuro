export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-3">
              Kantor Kecamatan Kalipuro
            </h3>
            <p className="text-gray-300">
              Jl. Raya Kalipuro No. 123
              <br />
              Kabupaten Banyuwangi
              <br />
              Jawa Timur, Indonesia
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Kontak</h3>
            <p className="text-gray-300">
              Telepon: (0333) 123456
              <br />
              Email: kecamatan.kalipuro@banyuwangikab.go.id
              <br />
              Jam Pelayanan: 08:00 - 16:00 WIB
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-3">Tautan</h3>
            <ul className="text-gray-300">
              <li className="mb-1">
                <a
                  href="https://www.banyuwangikab.go.id"
                  className="hover:text-blue-400 transition-colors"
                >
                  Website Resmi Kabupaten Banyuwangi
                </a>
              </li>
              <li className="mb-1">
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Portal Layanan Publik
                </a>
              </li>
              <li className="mb-1">
                <a href="#" className="hover:text-blue-400 transition-colors">
                  Peta Lokasi
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-6 pt-6 text-center text-gray-400">
          <p>
            &copy; {currentYear} Kantor Kecamatan Kalipuro. Hak Cipta
            Dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
