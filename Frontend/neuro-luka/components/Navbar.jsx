'use client'
import React from 'react'
import Link from 'next/link'
import { useState } from 'react'

const Navbar = () => {

  const [active, setActive] = useState(false);
  console.log(active)

  const handleClick = () => {
    setActive(!active)
  }

  return (
    <div className='navbar py-4 shadow-md '>
      <div className="container mx-auto px-6">
        <div className="navbar-box flex items-center justify-between">
          <div className="logo flex gap-4">
            <svg  xmlns="http://www.w3.org/2000/svg" className='w-4 md:w-7' viewBox="0 0 256 414"><path fill="#45ad47" d="M256 75.206V.004h-75.203l-7.505 7.57l-35.485 67.624l-11.158 7.528H0V186h69.626l6.201 7.5L0 338.396V413.6h75.201l7.507-7.567l35.487-67.627l11.156-7.526H256V227.605h-69.626l-6.195-7.551z"/></svg>
            <h1 className='font-semibold text-lg md:text-3xl flex items-center'>Neuro Luka</h1>
          </div>
          <ul className={`menu flex items-center gap-12 md:static absolute left-1/2 -translate-x-1/2 ${active ? "top-24 opacity-100" : "top-20 opacity-0"} md:-translate-x-0 md:flex-row flex-col md:bg-transparent bg-green-900 w-full md:w-auto md:py-0 py-10 text-white md:text-black transition-all md:opacity-100 md:transition-none`}>
            <li>
              <Link href={"#home"}>Beranda</Link>
            </li>
            <li>
              <Link href={"#about"}>Tentang</Link>
            </li>
            <li>
              <Link href={"#service"}>Servis</Link>
            </li>
            <li>
              <Link href={"#contact"}>Kontak</Link>
            </li>
            
          </ul>
          <div className='flex'>
          <div className=' button flex items-center bg-green-900 hover:bg-green-600 px-3 py-0 md:px-5 md:py-3 rounded-3xl text-xs md:text-lg text-white'>
            <Link href={"#login"}>Masuk</Link>
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