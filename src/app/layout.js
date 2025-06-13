import { Geist, Geist_Mono } from "next/font/google";
import { Raleway, Playfair_Display } from "next/font/google";
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

const raleway = Raleway({
  variable: "--font-raleway",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: 'swap',
  preload: true,
});

export const metadata = {
  title: {
    default: 'Aditya Anurag Roy | Portfolio',
    template: '%s | Aditya Anurag Roy Portfolio',
  },
  description: 'Portfolio website of Aditya Anurag Roy, showcasing his work and projects.',
  keywords: [
    'Aditya Anurag Roy',
    'Portfolio',
    'Web Development',
    'Projects',
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
  authors: [{ name: 'Aditya Anurag Roy' }],
  creator: 'Aditya Anurag Roy',
  publisher: 'Aditya Anurag Roy',
  openGraph: {
    title: 'Aditya Anurag Roy | Portfolio',
    description: 'Portfolio website of Aditya Anurag Roy, showcasing his work and projects.',
    siteName: 'Aditya Anurag Roy Portfolio',
    images: [],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Aditya Anurag Roy | Portfolio',
    description: 'Portfolio website of Aditya Anurag Roy, showcasing his work and projects.',
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
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} ${raleway.variable} ${playfair.variable}`}>
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
