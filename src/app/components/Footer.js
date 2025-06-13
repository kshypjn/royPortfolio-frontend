import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full py-4 mt-2 text-center text-xs text-gray-600 font-[var(--font-playfair)]">
      made with ❤️ by <Link href="https://bento.me/kashyap" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">kshyp</Link>
    </footer>
  );
} 