'use client';
import { FaLinkedin } from 'react-icons/fa';
import Link from 'next/link';
import HamburgerMenu from './HamburgerMenu';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();
  return (
    <header className="w-full flex items-center justify-between px-4 py-6 bg-transparent">
      <span className="text-2xl sm:text-4xl font-bold font-serif text-black text-left whitespace-nowrap animate-fade-in-down">Aditya Anurag Roy</span>
      <nav className="hidden md:flex items-center space-x-8">
        <Link
          href="/about"
          className={`nav-link${pathname === '/about' ? ' nav-link-active' : ''}`}
        >
          About
        </Link>
        <Link
          href="/work"
          className={`nav-link${pathname === '/work' ? ' nav-link-active' : ''}`}
        >
          Work
        </Link>
        <a href="https://www.linkedin.com/in/aditya-anurag-roy-868409214/?originalSubdomain=in" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
          <FaLinkedin className="w-6 h-6 text-black hover:text-blue-700 transition-colors" />
        </a>
        <a href="https://x.com/adiroy_notkapur" target="_blank" rel="noopener noreferrer" aria-label="X">
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-black hover:text-[#1da1f2] transition-colors">
            <path d="M17.53 3H21L13.47 12.19L22 21H15.66L10.61 15.49L4.97 21H1L9.04 11.27L0.75 3H7.24L11.77 8.04L17.53 3ZM16.34 19H18.19L6.52 4.98H4.56L16.34 19Z" fill="currentColor"/>
          </svg>
        </a>
      </nav>
      <div className="md:hidden flex items-center">
        <HamburgerMenu />
      </div>
      <style jsx global>{`
        @keyframes fade-in-down {
          from { opacity: 0; transform: translateY(-24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-down {
          animation: fade-in-down 1s cubic-bezier(0.4,0,0.2,1) both;
        }
        .nav-link {
          position: relative;
          font-family: var(--font-playfair), serif;
          font-weight: bold;
          font-size: 1.125rem;
          color: #111;
          text-decoration: none;
          transition: color 0.2s;
          padding-bottom: 2px;
        }
        .nav-link::after {
          content: '';
          position: absolute;
          left: 0;
          right: 0;
          bottom: -2px;
          height: 2px;
          background: #b48a2f;
          width: 100%;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 0.35s cubic-bezier(.4,0,.2,1);
        }
        .nav-link:hover::after,
        .nav-link:focus::after {
          transform: scaleX(1);
        }
        .nav-link-active::after {
          transform: scaleX(1);
        }
      `}</style>
    </header>
  );
}
