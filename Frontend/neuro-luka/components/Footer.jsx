import React from 'react'
import Link from 'next/link';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className=" bg-green-600 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-xl font-bold mb-4">Neuro Luka</h3>
            <p className="text-white mb-4">
               Aplikasi yang dirancang untuk membantu tenaga medis dan klien dalam menganalisis luka secara otomatis menggunakan teknologi pemrosesan citra digital dan kecerdasan buatan (AI).
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Link</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#" className="text-white hover:text-white transition duration-150">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/analisis" className="text-white hover:text-white transition duration-150">
                  Analisis
                </Link>
              </li>
              <li>
                <Link href="/#tentang" className="text-white hover:text-white transition duration-150">
                  Tentang
                </Link>
              </li>
              <li>
                <Link href="/#cara-kerja" className="text-white hover:text-white transition duration-150">
                  Cara Kerja
                </Link>
              </li>
              <li>
                <Link href="/hitory" className="text-white hover:text-white transition duration-150">
                  Riwayat
                </Link>
              </li>
            </ul>
          </div>
          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Kontak</h3>
            <address className="not-italic">
              <p className="flex items-start mb-2">
                <svg className="h-5 w-5 mr-2 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                Mugarsari, Tamansari<br />
                Tasikmalaya, Indonesia 46196
              </p>
              <p className="flex items-center">
                <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                neuroluka@gmail.com
              </p>
            </address>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-white">
              © {currentYear} Neuro Luka. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <ul className="flex space-x-4 text-sm">
                <li>
                  <Link href="/privacy" className="text-white hover:text-white transition duration-150">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-white hover:text-white transition duration-150">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/cookie-policy" className="text-white hover:text-white transition duration-150">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer