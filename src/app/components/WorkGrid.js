"use client";
import { useState } from "react";
import Image from "next/image";
import ArticleCard from './ArticleCard';

// Locale-agnostic date formatter to avoid hydration errors
function formatDate(dateString) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.toLocaleString('en-US', { month: 'long' });
  const day = date.getDate();
  return `${month} ${day}, ${year}`;
}

// ArticleCardList: Renders a list of article cards in a horizontal scroll container on mobile, grid on desktop
function ArticleCardList({ articles, publicationName }) {
  return (
    <div
      className="flex gap-4 overflow-x-auto scroll-snap-x scroll-px-4 pb-4 md:grid md:grid-cols-3 md:gap-8 md:overflow-x-visible md:scroll-snap-type-none"
      aria-label={`Articles from ${publicationName}`}
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      {articles.map((article) => (
        <a
          key={article.id}
          href={article.URL || "#"}
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-3 min-h-[44px] group focus:outline-none focus:ring-2 focus:ring-black/10 cursor-pointer flex-shrink-0 w-[80vw] max-w-xs scroll-snap-align-start md:w-auto md:max-w-none"
          style={{ scrollSnapAlign: 'start' }}
        >
          {article.image && article.image.url && (
            <img
              src={article.image.url}
              alt={article.Title || 'Article Image'}
              className="w-full h-40 object-cover rounded-md mb-2 border border-gray-200"
              loading="lazy"
            />
          )}
          <div className="flex flex-col flex-1 justify-between">
            <h3 className="text-lg font-[var(--font-raleway)] font-semibold mb-1 group-hover:underline group-focus:underline transition-colors group-hover:text-[#b48a2f] group-focus:text-[#b48a2f]">
              {article.Title}
            </h3>
            <div className="flex flex-wrap gap-2 mb-1">
              {article.tags && article.tags.length > 0 &&
                article.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="bg-black/90 text-white text-[10px] font-sans uppercase px-3 py-1 rounded-full tracking-widest"
                  >
                    {tag.name}
                  </span>
                ))}
            </div>
            <div className="text-xs font-mono text-gray-500">
              {article.PublicationDate && formatDate(article.PublicationDate)}
            </div>
          </div>
        </a>
      ))}
      <style jsx global>{`
        @media (max-width: 767px) {
          .scroll-snap-x {
            scroll-snap-type: x mandatory;
          }
          .scroll-snap-align-start {
            scroll-snap-align: start;
          }
          .flex::-webkit-scrollbar {
            display: none;
          }
          .flex {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        }
      `}</style>
    </div>
  );
}

export default function WorkGrid({ publicationGroups }) {
  // For desktop filter (optional, keep as before)
  const [selectedPublication, setSelectedPublication] = useState("all");
  const publications = ["all", ...publicationGroups.map(group => group.publicationName)];
  const filteredGroups = selectedPublication === "all"
    ? publicationGroups
    : publicationGroups.filter(group => group.publicationName === selectedPublication);

  return (
    <main className="flex flex-col gap-6 py-8 px-2 sm:px-6 md:px-12 bg-white">
      {/* Heading and Filter Row */}
      <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between mb-2">
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-black mb-2 md:mb-0 text-center md:text-left">
          Featured Work
        </h1>
        <div className="hidden md:flex">
          <select
            value={selectedPublication}
            onChange={(e) => setSelectedPublication(e.target.value)}
            className="px-4 py-2 border border-gray-200 rounded-lg font-serif text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
          >
            {publications.map((pub) => (
              <option key={pub} value={pub}>
                {pub === "all" ? "All Publications" : pub}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Mobile: Publication sections with horizontal scroll */}
      <div className="md:hidden">
        {publicationGroups.map(({ publicationName, articles }) => (
          <section key={publicationName} className="w-full max-w-7xl mx-auto mb-8">
            <h2 className="text-xl font-semibold mb-2 font-serif text-black">
              {publicationName}
            </h2>
            <div className="w-full overflow-x-auto">
              <div className="flex space-x-4 pb-4">
                {articles.map((article) => (
                  <div key={article.id} className="flex-none w-64">
                    <ArticleCard article={article} />
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Desktop: All sections open, grid layout */}
      <div className="hidden md:block">
        {filteredGroups.map(({ publicationName, articles }) => (
          <section key={publicationName} className="w-full max-w-7xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 font-serif text-black border-b border-gray-200 pb-2">
              {publicationName}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="flex flex-col bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4 h-full group"
                >
                  {article.image && article.image.url && (
                    <div className="mb-3 w-full aspect-[4/3] relative rounded-md overflow-hidden bg-gray-50">
                      <img
                        src={article.image.url}
                        alt={article.Title || 'Article Image'}
                        className="object-cover w-full h-full rounded-md"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <a
                    href={article.URL || "#"}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg sm:text-xl font-[var(--font-raleway)] font-semibold mb-2 underline-offset-4 group-hover:underline group-focus:underline transition-colors group-hover:text-[#b48a2f] group-focus:text-[#b48a2f]"
                  >
                    {article.Title}
                  </a>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {article.tags &&
                      article.tags.length > 0 &&
                      article.tags.map((tag) => (
                        <span
                          key={tag.id}
                          className="bg-black/90 text-white text-[10px] font-sans uppercase px-3 py-1 rounded-full tracking-widest"
                        >
                          {tag.name}
                        </span>
                      ))}
                  </div>
                  <div className="text-xs font-mono text-gray-500 mt-auto">
                    {article.PublicationDate && formatDate(article.PublicationDate)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </main>
  );
} 