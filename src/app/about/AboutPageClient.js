"use client";
import { useState } from 'react';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import Image from "next/image";
import Link from "next/link";
import Footer from '../components/Footer';

export default function AboutPageClient({ aboutMe }) {
 
  const data = aboutMe.data || {};

  const introduction = data.introduction;
  const EMPTY_DOC = { type: 'doc', content: [] };
  const mainContent = data.mainContentJson || [];
  const CTAtext = data.ctaText;
  const CTAlink = data.ctaLink;
  const sections = data.sectionsJson || [];
  const profilePictureUrl = data.profileImageUrl;

  // Tab logic for sections (dynamic from Supabase/Prisma via transformation)
  const tabNames = Array.from(new Set(sections.map(s => (s.tab || 'WORK').toUpperCase())));
  const [activeTab, setActiveTab] = useState(tabNames[0] || 'WORK');
  const filteredSections = sections.filter(
    (section) => (section.tab || 'WORK').toUpperCase() === activeTab
  );

  return (
    <main className="bg-white min-h-screen flex flex-col items-center py-10 px-2 sm:px-0">
      <div className="mb-8 w-full sm:max-w-4xl sm:bg-white sm:rounded-2xl sm:shadow-xl sm:border sm:border-gray-100 sm:p-8 flex flex-col gap-0 sm:gap-4 relative p-0">
        <div className="w-full flex flex-col sm:flex-row gap-8 items-start">
          <div className="flex-1 flex flex-col justify-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold mb-4 text-gray-900 leading-tight">
              {introduction || "Hello, I'm Aditya!"}
            </h1>
            {/* Main Content Blocks */}
            {mainContent && (
              <div className="mb-8 text-lg font-serif leading-relaxed text-gray-800 max-w-2xl">
                <BlocksRenderer content={mainContent} />
              </div>
            )}
          </div>
          {/* Right: Profile Image (always visible on desktop, above text on mobile) */}
          {profilePictureUrl && (
            <div className="flex-shrink-0 flex justify-center items-start sm:items-center w-full sm:w-auto mb-6 sm:mb-0">
              <img
                src={profilePictureUrl}
                alt="Profile"
                className="w-40 h-40 sm:w-56 sm:h-56 rounded-full object-cover border-4 border-white shadow-lg bg-gray-100 crazy-hover"
                style={{ objectPosition: 'center top' }}
              />
            </div>
          )}
        </div>
        {/* Tabbed Sections (Work/Education) - full width below the flex row */}
        {sections.length > 0 && (
          <div className="w-full mt-4">
            <div className="flex gap-6 mb-4 mt-2 text-xs sm:text-sm font-mono tracking-widest uppercase text-gray-600">
              {tabNames.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-1 border-b-2 transition-colors duration-200 ${
                    activeTab === tab ? 'border-[#b48a2f] text-black' : 'border-transparent text-gray-500 hover:text-black'
                  }`}
                >
                  {tab.charAt(0) + tab.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
            <hr className="border-t border-gray-300 mb-6" />
            <div className="mb-4">
              {filteredSections.map((section, idx) => (
                <div key={idx} className="mb-6">
                  {section.description && (
                    <div className="font-serif">
                      <BlocksRenderer content={section.description} />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        {/* Contact Info - added below sections and above CTA */}
        <div className="w-full flex justify-center my-4">
          <span className="text-center text-base font-serif text-gray-700">
            Open to tips, co-writing pitches, and journalism related conversations: <a href="mailto:aditya.anurag.roy@gmail.com" className="underline text-blue-700">aditya.anurag.roy@gmail.com</a>
          </span>
        </div>
        {/* CTA Section - moved below sections */}
        <div className="mt-2 flex justify-center gap-4 mb-2">
          <Link href="/work" className="cta-btn">
            <span>MY WORK</span>
          </Link>
          <a href="mailto:aditya.anurag.roy@gmail.com" className="cta-btn">
            <span>REACH OUT TO ME</span>
          </a>
        </div>
      </div>
      <Footer />
      <style jsx global>{`
        @keyframes crazy-wobble {
          0% { transform: rotate(0deg) scale(1) skew(0deg, 0deg); }
          10% { transform: rotate(10deg) scale(1.1) skew(5deg, 2deg); }
          20% { transform: rotate(-10deg) scale(0.95) skew(-5deg, -2deg); }
          30% { transform: rotate(15deg) scale(1.15) skew(8deg, 4deg); }
          40% { transform: rotate(-15deg) scale(0.9) skew(-8deg, -4deg); }
          50% { transform: rotate(20deg) scale(1.2) skew(10deg, 5deg); }
          60% { transform: rotate(-20deg) scale(0.85) skew(-10deg, -5deg); }
          70% { transform: rotate(10deg) scale(1.1) skew(5deg, 2deg); }
          80% { transform: rotate(-10deg) scale(0.95) skew(-5deg, -2deg); }
          90% { transform: rotate(5deg) scale(1.05) skew(2deg, 1deg); }
          100% { transform: rotate(0deg) scale(1) skew(0deg, 0deg); }
        }
        .crazy-hover:hover {
          animation: crazy-wobble 0.8s cubic-bezier(.36,.07,.19,.97) both;
        }
        .cta-btn {
          position: relative;
          display: inline-block;
          padding: 0.5rem 1.5rem;
          font-family: var(--font-raleway), serif;
          font-size: 0.75rem;
          font-weight: 600;
          border: 2px solid #111;
          border-radius: 0.5rem;
          background: #fff;
          color: #111;
          box-shadow: 0 2px 8px 0 rgba(0,0,0,0.04);
          overflow: hidden;
          transition: color 0.3s cubic-bezier(.4,0,.2,1), border-color 0.3s, box-shadow 0.3s, transform 0.2s;
          z-index: 0;
        }
        @media (min-width: 640px) {
          .cta-btn {
            font-size: 0.875rem;
          }
        }
        .cta-btn::before {
          content: '';
          position: absolute;
          left: 0; top: 0; right: 0; bottom: 0;
          width: 0%;
          height: 100%;
          background: #111;
          z-index: 1;
          transition: width 0.35s cubic-bezier(.4,0,.2,1);
        }
        .cta-btn:hover::before, .cta-btn:focus::before {
          width: 100%;
        }
        .cta-btn:hover, .cta-btn:focus {
          color: #fff !important;
          border-color: #111;
          box-shadow: 0 4px 16px 0 rgba(0,0,0,0.10);
          transform: translateY(-2px) scale(1.03);
        }
        .cta-btn span {
          position: relative;
          z-index: 2;
        }
        .cta-btn {
          transition-property: color, background, border, box-shadow, transform;
        }
        .cta-btn:active {
          transform: scale(0.98);
        }
      `}</style>
    </main>
  );
}