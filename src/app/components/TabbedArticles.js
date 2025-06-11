"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export default function TabbedArticles({ publications, articles }) {
  const [activeTab, setActiveTab] = useState(publications[0]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  if (!hydrated) return null;

  const filtered = articles.filter((a) => a.publication === activeTab);
  return (
    <main className="flex min-h-screen flex-col items-center bg-white px-2 sm:px-6 md:px-12">
      <nav className="w-full max-w-3xl mx-auto flex border-b border-gray-200 mb-8 overflow-x-auto whitespace-nowrap">
        {publications.map((pub) => (
          <button
            key={pub}
            className={`px-4 py-3 text-lg font-serif tracking-wide focus:outline-none transition border-b-2 ${
              activeTab === pub
                ? "border-black text-black"
                : "border-transparent text-gray-400 hover:text-black"
            }`}
            onClick={() => setActiveTab(pub)}
            type="button"
          >
            {pub}
          </button>
        ))}
      </nav>
      <section className="w-full max-w-3xl mx-auto flex flex-col gap-6">
        {filtered.length === 0 ? (
          <p className="text-center text-lg">No articles for this publication.</p>
        ) : (
          <ul className="flex flex-col gap-6">
            {filtered.map((article) => (
              <li key={article.id} className="flex flex-col gap-1 p-0">
                {article.image && article.image.url && (
                  <Image
                    src={article.image.url}
                    alt={article.Title || 'Article Image'}
                    width={640}
                    height={240}
                    className="w-full h-40 object-cover rounded-md mb-2 border border-gray-200"
                    style={{ objectFit: "cover" }}
                    loading="lazy"
                  />
                )}
                <a
                  href={article.URL || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xl font-serif font-semibold underline underline-offset-4 hover:text-[#8a7c54] focus:text-[#8a7c54] transition-colors"
                >
                  {article.Title}
                </a>
                <div className="flex flex-wrap gap-2 text-xs font-mono text-gray-500">
                  {article.tags &&
                    article.tags.length > 0 &&
                    article.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="bg-gray-100 rounded-full px-2 py-0.5 uppercase tracking-widest"
                      >
                        {tag.name}
                      </span>
                    ))}
                  <span className="ml-auto text-xs font-sans italic text-gray-400">
                    {article.PublicationDate &&
                      new Date(article.PublicationDate).toLocaleDateString(
                        "en-US",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
} 