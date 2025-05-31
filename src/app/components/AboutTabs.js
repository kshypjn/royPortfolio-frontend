"use client";
import { useState, useEffect } from "react";
import { BlocksRenderer } from '@strapi/blocks-react-renderer';

export default function AboutTabs({ sections }) {
  const tabNames = sections.map(s => s.title);
  const [activeTab, setActiveTab] = useState(tabNames[0]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  const activeSection = sections.find(s => s.title === activeTab);

  return (
    <div>
      <div className="flex items-center gap-0 mb-4 mt-2 text-xs sm:text-sm font-mono tracking-widest uppercase text-gray-900 border-b border-gray-200 relative" style={{letterSpacing: '0.15em'}}>
        {tabNames.map((tab, idx) => (
          <span key={tab} className="flex items-center">
            <button
              className={`relative px-4 py-2 transition font-semibold bg-transparent focus:outline-none ${activeTab === tab ? 'text-yellow-700 font-bold' : 'text-gray-400 hover:text-yellow-800'}`}
              style={{
                border: 'none',
                outline: 'none',
                background: 'none',
                cursor: 'pointer',
                marginBottom: '-2px',
                fontWeight: activeTab === tab ? 700 : 500,
                letterSpacing: '0.15em',
              }}
              onClick={() => setActiveTab(tab)}
              type="button"
            >
              {tab}
            </button>
            {idx < tabNames.length - 1 && (
              <span className="h-5 w-px bg-gray-300 mx-1" aria-hidden="true" />
            )}
          </span>
        ))}
      </div>
      <div className="mb-8">
        {activeSection && (
          <div className="mb-6">
            {activeSection.description && <BlocksRenderer content={activeSection.description} />}
          </div>
        )}
      </div>
    </div>
  );
} 