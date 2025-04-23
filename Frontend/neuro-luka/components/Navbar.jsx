import React from 'react'
import Link from 'next/link'

const Navbar = () => {
  return (
    <div className='navbar py-6'>
      <div className="container mx-auto px-4">
        <div className="navbar-box flex items-center justify-between">
          <div className="logo flex gap-4 ">
            <svg  xmlns="http://www.w3.org/2000/svg" width="25" height="auto" viewBox="0 0 256 414"><path fill="#45ad47" d="M256 75.206V.004h-75.203l-7.505 7.57l-35.485 67.624l-11.158 7.528H0V186h69.626l6.201 7.5L0 338.396V413.6h75.201l7.507-7.567l35.487-67.627l11.156-7.526H256V227.605h-69.626l-6.195-7.551z"/></svg>
            <h1 className='font-bold text-3xl'>Neuro Luka</h1>
          </div>
          <ul className=''>
            <li className='menu flex items-center gap-12 text-xl left-1/2 -translate-x-1/2 md:translate-x-0 md:flex-row flex-col md:bg-transparent bg-green-500 w-full md:w-auto md:py-0 py-10 text-white md:text-black transition-all md:opacity-100 md:transition-none'>
              <Link href={"#home"}>Home</Link>
              <Link href={"#about"}>About</Link>
              <Link href={"#service"}>Service</Link>
              <Link href={"#contact"}>Contact</Link>
            </li>
            
          </ul>
          <div className='button bg-green-400 px-5 py-3 rounded-2xl text-md'>
            <Link href={"#login"}>Get Started</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar