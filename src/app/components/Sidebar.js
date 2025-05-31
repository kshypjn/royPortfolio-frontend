'use client';
import HamburgerMenu from './HamburgerMenu';
import Link from 'next/link';

export default function Sidebar() {
  return (
    <div className="fixed left-0 top-0 h-full z-50 flex flex-col items-center hidden sm:flex" style={{width: '72px'}}>
      {/* Hamburger menu at top */}
      <div className="pt-8">
        <HamburgerMenu />
      </div>
      {/* Vertical division line */}
      <div className="absolute right-0 top-0 h-full w-px bg-gray-400 transition-transform hover:translate-x-1 hidden sm:block" style={{opacity: 0.5}} />
      {/* 'A' Logo positioned at bottom */}
      <div className="flex-1 flex flex-col justify-end items-center hidden sm:flex ">
        <Link href="/" className="mb-12 pointer-events-auto transform rotate-270 hover:cursor-pointer hover:animate-cute-bounce " aria-label="Home">
          <span className="text-xl md:text-2xl lg:text-3xl font-serif text-black" style={{lineHeight: 1}}>A</span>
        </Link>
      </div>
    </div>
  );
} 