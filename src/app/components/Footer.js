import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="w-full py-4 text-center text-sm text-gray-600">
      Made with ❤️ by <Link href="https://bento.me/kashyap" target="_blank" rel="noopener noreferrer" className="hover:text-gray-900 transition-colors">kshyp</Link>
    </footer>
  );
} 