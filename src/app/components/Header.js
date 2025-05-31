'use client';
import { FaLinkedin, FaTwitter } from 'react-icons/fa';
import HamburgerMenu from './HamburgerMenu';
import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full flex items-center justify-between px-6 py-8 bg-transparent">
      <div className="sm:hidden flex items-center">
        <HamburgerMenu />
      </div>
      <div className="w-16 hidden sm:block"></div>
      
      <span className="text-3xl font-bold tracking-tight animate-fade-in-down text-black text-center flex-1">
        Aditya Roy
      </span>
      <div className="flex items-center gap-4">
        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <FaLinkedin className="w-6 h-6 text-black hover:text-blue-700 transition-colors" />
        </a>
        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
          <FaTwitter className="w-6 h-6 text-black hover:text-blue-500 transition-colors" />
        </a>
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
