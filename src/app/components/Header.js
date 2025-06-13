'use client';
import { FaLinkedin } from 'react-icons/fa';
import Link from 'next/link';
import HamburgerMenu from './HamburgerMenu';

export default function Header() {
  return (
    <header className="w-full flex items-center justify-between px-6 py-8 bg-transparent">
      <div className="sm:hidden flex items-center">
        <HamburgerMenu />
      </div>
      <div className="w-16 hidden sm:block"></div>
      
      <span className="text-2xl sm:text-4xl font-bold font-serif text-black mb-2 md:mb-0 text-center md:text-left">
        Aditya Anurag Roy
      </span>
      <div className="flex items-center gap-4">
        <nav className="hidden md:flex space-x-4">
          <Link href="/about" className="text-black hover:text-gray-600 transition-colors">About</Link>
          <Link href="/work" className="text-black hover:text-gray-600 transition-colors">Work</Link>
          <a href="https://www.linkedin.com/in/aditya-anurag-roy-868409214/?originalSubdomain=in" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FaLinkedin className="w-6 h-6 text-black hover:text-blue-700 transition-colors" />
          </a>
          <a href="https://x.com/adiroy_notkapur" target="_blank" rel="noopener noreferrer" aria-label="X">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-black hover:text-[#1da1f2] transition-colors">
              <path d="M17.53 3H21L13.47 12.19L22 21H15.66L10.61 15.49L4.97 21H1L9.04 11.27L0.75 3H7.24L11.77 8.04L17.53 3ZM16.34 19H18.19L6.52 4.98H4.56L16.34 19Z" fill="currentColor"/>
            </svg>
          </a>
        </nav>
      </div>
      <style jsx global>{`
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fade-in-down 1s cubic-bezier(0.4,0,0.2,1) both;
        }
      `}</style>
    </header>
  );
}
