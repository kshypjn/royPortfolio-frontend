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
        className={`fixed top-0 left-0 h-full w-80 bg-white shadow-lg transform transition-transform duration-300 ease-in-out z-[100] ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <button
          className="absolute top-8 right-8 w-12 h-12 flex items-center justify-center text-black hover:bg-gray-100 rounded-full transition cursor-pointer`"
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
