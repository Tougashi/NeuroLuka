'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

const Navbar = () => {
  const [active, setActive] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user, logout } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
      // Close mobile menu when scrolling
      if (active) {
        setActive(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [active]); // Add active to dependency array

  const handleClick = () => {
    setActive(!active)
  }

  const handleLogout = async () => {
    await logout();
  }

  const isActive = (path) => {
    if (path === '/') {
      return pathname === path;
    }
    return pathname.startsWith(path);
  };

  return (
    <div className={`navbar fixed w-full top-0 transition-all duration-300 ${
      scrolled ? 'bg-white/95 backdrop-blur-sm shadow-lg py-2' : 'bg-white py-8'
    } z-50`}>
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 md:gap-3 group">
            <div className="relative w-8 h-8 md:w-10 md:h-10 transition-transform group-hover:scale-110">
              <Image 
                src='/logo.png'
                fill
                alt='neuro'
                className='object-contain'
              />
            </div>
            <h1 className='text-gray-900 font-semibold text-base md:text-2xl lg:text-3xl bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent'>
              Neuro Luka
            </h1>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <Link 
              href="/" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/') 
                  ? 'text-green-700 bg-green-50' 
                  : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
              }`}
            >
              Beranda
            </Link>
            <Link 
              href="/analisis" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/analisis') 
                  ? 'text-green-700 bg-green-50' 
                  : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
              }`}
            >
              Analisis
            </Link>
            <Link 
              href="/#tentang" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/#tentang') 
                  ? 'text-green-700 bg-green-50' 
                  : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
              }`}
            >
              Tentang
            </Link>
            <Link 
              href="/#cara-kerja" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/#cara-kerja') 
                  ? 'text-green-700 bg-green-50' 
                  : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
              }`}
            >
              Cara Kerja
            </Link>
            <Link 
              href="/history" 
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/history') 
                  ? 'text-green-700 bg-green-50' 
                  : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
              }`}
            >
              Riwayat
            </Link>
          </div>

          {/* Auth Button & Mobile Menu Toggle */}
          <div className='flex items-center gap-3'>
            <div className='hidden md:block'>
              {user ? (
                <button 
                  onClick={handleLogout}
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  Keluar
                </button>
              ) : (
                <Link 
                  href="/login"
                  className="px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  Masuk
                </Link>
              )}
            </div>

            <button 
              onClick={handleClick}
              className='md:hidden p-2 text-gray-600 hover:text-green-700 focus:outline-none transition-colors'
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                {active ? (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth="2" 
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div 
          className={`md:hidden absolute left-0 right-0 bg-white/95 backdrop-blur-sm shadow-lg transition-all duration-300 ease-in-out ${
            active 
              ? 'opacity-100 visible top-[72px]' 
              : 'opacity-0 invisible -top-4'
          }`}
        >
          <div className="px-4 py-2 space-y-1">
            <Link 
              href="/" 
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/') 
                  ? 'text-green-700 bg-green-50' 
                  : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
              }`}
              onClick={() => setActive(false)}
            >
              Beranda
            </Link>
            <Link 
              href="/analisis" 
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/analisis') 
                  ? 'text-green-700 bg-green-50' 
                  : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
              }`}
              onClick={() => setActive(false)}
            >
              Analisis
            </Link>
            <Link 
              href="/#tentang" 
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/#tentang') 
                  ? 'text-green-700 bg-green-50' 
                  : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
              }`}
              onClick={() => setActive(false)}
            >
              Tentang
            </Link>
            <Link 
              href="/#cara-kerja" 
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/#cara-kerja') 
                  ? 'text-green-700 bg-green-50' 
                  : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
              }`}
              onClick={() => setActive(false)}
            >
              Cara Kerja
            </Link>
            <Link 
              href="/history" 
              className={`block px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/history') 
                  ? 'text-green-700 bg-green-50' 
                  : 'text-gray-600 hover:text-green-700 hover:bg-green-50'
              }`}
              onClick={() => setActive(false)}
            >
              Riwayat
            </Link>

            {/* Mobile Auth Buttons */}
            <div className="pt-2 mt-2 border-t border-gray-100">
              {user ? (
                <button 
                  onClick={() => {
                    handleLogout();
                    setActive(false);
                  }}
                  className="w-full px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  Keluar
                </button>
              ) : (
                <div className="space-y-2">
                  <Link 
                    href="/login"
                    className="block w-full px-4 py-2 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white rounded-lg text-sm font-medium transition-all duration-300 shadow-sm hover:shadow-md text-center"
                    onClick={() => setActive(false)}
                  >
                    Masuk
                  </Link>
                  <Link 
                    href="/register"
                    className="block w-full px-4 py-2 bg-gray-100 hover:bg-gray-200 text-green-600 rounded-lg text-sm font-medium transition-all duration-300 text-center"
                    onClick={() => setActive(false)}
                  >
                    Daftar
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar