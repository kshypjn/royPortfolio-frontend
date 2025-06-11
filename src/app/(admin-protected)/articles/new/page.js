"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewArticlePage() {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [publication, setPublication] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [publishedDate, setPublishedDate] = useState("");
  const [tags, setTags] = useState("");
  const [status, setStatus] = useState("Draft");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    try {
      const response = await fetch("/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          url,
          publication,
          thumbnailUrl,
          publishedDate,
          tags,
          status,
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      setSuccessMessage("Article added successfully!");
      setTitle("");
      setUrl("");
      setPublication("");
      setThumbnailUrl("");
      setPublishedDate("");
      setTags("");
      setStatus("Draft");
      setTimeout(() => {
        router.push("/articles");
      }, 1500);
    } catch (e) {
      setError("Failed to add article: " + e.message);
      console.error("Add article error:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add New Article</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title Input */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., Two demands, Six hours: Security Workers and Students protest pay cuts"
          />
        </div>
        {/* Original Article URL Input */}
        <div>
          <label htmlFor="url" className="block text-sm font-medium text-gray-700">
            Original Article URL
          </label>
          <input
            type="url"
            id="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., https://www.your-news-site.com/article-slug"
          />
        </div>
        {/* Publication Input */}
        <div>
          <label htmlFor="publication" className="block text-sm font-medium text-gray-700">
            Publication (e.g., EDICT, The New York Times)
          </label>
          <input
            type="text"
            id="publication"
            value={publication}
            onChange={(e) => setPublication(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., EDICT"
          />
        </div>
        {/* Thumbnail Image URL Input */}
        <div>
          <label htmlFor="thumbnailUrl" className="block text-sm font-medium text-gray-700">
            Thumbnail Image URL (Optional)
          </label>
          <input
            type="url"
            id="thumbnailUrl"
            value={thumbnailUrl}
            onChange={(e) => setThumbnailUrl(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., https://example.com/thumbnail.jpg"
          />
        </div>
        {/* Published Date Input */}
        <div>
          <label htmlFor="publishedDate" className="block text-sm font-medium text-gray-700">
            Published Date
          </label>
          <input
            type="date"
            id="publishedDate"
            value={publishedDate}
            onChange={(e) => setPublishedDate(e.target.value)}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
        {/* Tags Input */}
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700">
            Tags (comma-separated, e.g., politics, protest, students)
          </label>
          <input
            type="text"
            id="tags"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            placeholder="e.g., news, current-affairs, education"
          />
        </div>
        {/* Status Dropdown */}
        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="Draft">Draft</option>
            <option value="Published">Published</option>
            <option value="Archived">Archived</option>
          </select>
        </div>
        {/* Error and Success Messages */}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        {successMessage && <p className="text-green-600 text-sm mt-2">{successMessage}</p>}
        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
          >
            {loading ? "Adding Article..." : "Add Article"}
          </button>
          <Link
            href="/articles"
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 font-semibold hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-colors duration-200"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
} 