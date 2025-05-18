'use client'
import React from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

const Navbar = () => {
  const [active, setActive] = useState(false);
  const router = useRouter();
  const { user, logout } = useAuth();

  const handleClick = () => {
    setActive(!active)
  }

  const handleLogout = async () => {
    await logout();
  }

  return (
    <div className='navbar py-4 shadow-md sticky top-0 bg-white z-100'>
      <div className="container mx-auto px-6">
        <div className="navbar-box flex items-center justify-between">
          <div className="logo flex gap-4">
            <Image src='/logo.png'
            width='50'
            height='50'
            alt='neuro'
            color='#16a34a'/>
            <h1 className='text-gray-900 font-semibold text-lg md:text-3xl flex items-center'>Neuro Luka</h1>
          </div>
          <ul className={`menu flex items-center gap-12 md:static absolute left-1/2 -translate-x-1/2 ${active ? "top-20 opacity-100" : "top-20 opacity-0"} md:-translate-x-0 md:flex-row flex-col md:bg-transparent bg-green-900 w-full md:w-auto md:py-0 py-10 text-white md:text-gray-900 text-lg transition-all md:opacity-100 md:transition-none`}>
            <li>
              <Link href={"/"}>Beranda</Link>
            </li>
            <li>
              <Link href={"/analisis"}>Analisis</Link>
            </li>
            <li>
              <Link href={"/#tentang"}>Tentang</Link>
            </li>
            <li>
              <Link href={"/#cara-kerja"}>Cara Kerja</Link>
            </li>
            <li>
              <Link href={"/history"}>Riwayat</Link>
            </li>
          </ul>          <div className='flex'>
          <div className='button flex items-center bg-green-600 hover:bg-green-800 px-3 py-0 md:px-5 md:py-3 rounded-3xl text-xs md:text-lg text-white'>
            {user ? (
              <button onClick={handleLogout}>Keluar</button>
            ) : (
              <Link href={"/login"}>Masuk</Link>
            )}
          </div>

          <div className='md:hidden block' onClick={() => handleClick()}>
            <i className="ri-menu-3-line ri-2x font-bold"></i>
          </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar