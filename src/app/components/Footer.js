import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full mt-2 mb-2 text-center text-xs text-gray-600 font-[var(--font-playfair)]">
      made with ❤️ by <Link href="https://bento.me/kashyap" target="_blank" rel="noopener noreferrer" className="sexy-underline">kshyp</Link>
    </footer>
  );
} 