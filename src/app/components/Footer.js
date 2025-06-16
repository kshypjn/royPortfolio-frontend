import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full mt-2 mb-2 text-center text-xs text-gray-600 font-[var(--font-playfair)]">
      made with ❤️ by <Link href="https://bento.me/kashyap" target="_blank" rel="noopener noreferrer" className="wavy-underline hover:text-gray-900 transition-colors">kshyp</Link>
      <style jsx global>{`
        .wavy-underline {
          text-decoration-line: underline;
          text-decoration-style: wavy;
          text-underline-offset: 2px;
          text-decoration-thickness: 2px;
          text-decoration-color: #b48a2f;
        }
      `}</style>
    </footer>
  );
} 