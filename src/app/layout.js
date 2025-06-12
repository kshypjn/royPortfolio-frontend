import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { Providers } from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

export const metadata = {
  title: {
    default: 'Aditya Roy - Journalism, Media & Economics Portfolio',
    template: '%s | Aditya Roy Portfolio',
  },
  description: 'Aditya Roy is a journalism, media, and economics student showcasing his writing portfolio, investigative journalism, and media analysis work.',
  keywords: [
    'Aditya Roy',
    'Journalism Portfolio',
    'Media Studies',
    'Economics Student',
    'Investigative Journalism',
    'Writing Portfolio',
    'Content Writing',
    'News Editor',
    'The Edict',
    'ThePrint',
    'The Reporters Collective',
    'Media Analysis',
    'Economic Analysis',
    'Student Journalist',
    'Writer',
    'Researcher',
  ],
  authors: [{ name: 'Aditya Roy' }],
  creator: 'Aditya Roy',
  publisher: 'Aditya Roy',
  openGraph: {
    title: 'Aditya Roy - Journalism, Media & Economics Portfolio',
    description: 'Aditya Roy is a journalism, media, and economics student showcasing his writing portfolio, investigative journalism, and media analysis work.',
    siteName: 'Aditya Roy Portfolio',
    images: [],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aditya Roy - Journalism, Media & Economics Portfolio',
    description: 'Aditya Roy is a journalism, media, and economics student showcasing his writing portfolio, investigative journalism, and media analysis work.',
    images: [],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/shortcut-icon.png',
    apple: '/apple-icon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased bg-white text-black min-h-screen">
        <Providers>
          <Sidebar />
          <Header />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
