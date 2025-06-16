'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function HamburgerMenu() {
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [open]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  if (!hydrated) return null;

  return (
    <>
      <button
        className="flex flex-col gap-1.5 group cursor-pointer transition-transform duration-300 transform group-hover:scale-110"
        aria-label="Open menu"
        onClick={() => setOpen(true)}
      >
        <span className="block w-8 h-0.5 bg-black rounded transition-all group-hover:scale-105"></span>
        <span className="block w-8 h-0.5 bg-black rounded transition-all group-hover:scale-105" ></span>
        <span className="block w-8 h-0.5 bg-black rounded transition-all group-hover:scale-105"></span>
      </button>

      <div 
        className={`fixed top-0 right-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-[100] ${
          open ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <button
          className="absolute top-8 left-8 w-12 h-12 flex items-center justify-center text-black hover:bg-gray-100 rounded-full transition cursor-pointer"
          aria-label="Close menu"
          onClick={() => setOpen(false)}
        >
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <line x1="8" y1="8" x2="24" y2="24" stroke="black" strokeWidth="2.5" />
            <line x1="24" y1="8" x2="8" y2="24" stroke="black" strokeWidth="2.5" />
          </svg>
        </button>

        <nav className="flex flex-1 flex-col items-start px-8 pt-24 gap-8">
          <Link 
            href="/about" 
            className={`text-2xl font-bold tracking-widest text-black sidebar-underline${pathname === '/about' ? ' sidebar-underline-active' : ''}`}
            onClick={() => setOpen(false)}
          >
            ABOUT
          </Link>
          <Link 
            href="/work" 
            className={`text-2xl font-bold tracking-widest text-black sidebar-underline${pathname === '/work' ? ' sidebar-underline-active' : ''}`}
            onClick={() => setOpen(false)}
          >
            WORK
          </Link>
        </nav>
        <div className="flex items-center gap-10 px-8 pb-8 mt-20">
          <a href="https://www.linkedin.com/in/aditya-anurag-roy-868409214/?originalSubdomain=in" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <svg className="w-7 h-7 text-black hover:text-blue-700 transition-colors" fill="currentColor" viewBox="0 0 24 24"><path d="M19 0h-14c-2.76 0-5 2.24-5 5v14c0 2.76 2.24 5 5 5h14c2.76 0 5-2.24 5-5v-14c0-2.76-2.24-5-5-5zm-11 19h-3v-9h3v9zm-1.5-10.28c-.97 0-1.75-.79-1.75-1.75s.78-1.75 1.75-1.75 1.75.79 1.75 1.75-.78 1.75-1.75 1.75zm15.5 10.28h-3v-4.5c0-1.08-.02-2.47-1.5-2.47-1.5 0-1.73 1.17-1.73 2.39v4.58h-3v-9h2.89v1.23h.04c.4-.75 1.38-1.54 2.84-1.54 3.04 0 3.6 2 3.6 4.59v4.72z"/></svg>
          </a>
          <a href="https://x.com/adiroy_notkapur" target="_blank" rel="noopener noreferrer" aria-label="X">
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 text-black hover:text-[#1da1f2] transition-colors">
              <path d="M17.53 3H21L13.47 12.19L22 21H15.66L10.61 15.49L4.97 21H1L9.04 11.27L0.75 3H7.24L11.77 8.04L17.53 3ZM16.34 19H18.19L6.52 4.98H4.56L16.34 19Z" fill="currentColor"/>
            </svg>
          </a>
        </div>
      </div>

      {open && (
        <div 
          className="fixed inset-0 bg-black/50 z-[90] transition-opacity duration-300"
          onClick={() => setOpen(false)}
        />
      )}
    </>
  );
}
