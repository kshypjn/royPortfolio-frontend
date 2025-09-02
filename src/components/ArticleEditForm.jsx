"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ArticleEditForm({ article }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    publication: '',
    thumbnailUrl: '',
    publishedDate: '',
    tags: '', // Will be comma-separated string for input
    status: 'Draft', // Default status
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    if (article) {
      // Pre-fill form with existing article data
      setFormData({
        title: article.title || '',
        url: article.url || '',
        publication: article.publication || '',
        thumbnailUrl: article.thumbnailUrl || '',
        // Format date to 'YYYY-MM-DD' for date input type
        publishedDate: article.publishedDate ? new Date(article.publishedDate).toISOString().split('T')[0] : '',
        tags: Array.isArray(article.tags) ? article.tags.join(', ') : '', // Join array to string
        status: article.status || 'Draft',
      });
    }
  }, [article]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    // Prepare data for API: split tags string into array
    const dataToSend = {
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag !== ''),
      // API expects YYYY-MM-DD for Supabase date column
      publishedDate: formData.publishedDate || null,
    };

    try {
      const response = await fetch(`/api/articles/${article.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update article');
      }

      setSuccess(true);
      // Optional: redirect to articles list after successful update
      router.push('/articles');
      router.refresh(); // Refresh the list page data
    } catch (err) {
      console.error('Failed to update article:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this article? This cannot be undone.')) return;
    setDeleting(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch(`/api/articles/${article.id}`, { method: 'DELETE' });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.message || 'Failed to delete article');
      }
      router.push('/articles');
      router.refresh();
    } catch (err) {
      console.error('Failed to delete article:', err);
      setError(err.message || 'An unexpected error occurred.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
        <input
          type="text"
          name="title"
          id="title"
          value={formData.title}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <div>
        <label htmlFor="url" className="block text-sm font-medium text-gray-700">URL</label>
        <input
          type="url"
          name="url"
          id="url"
          value={formData.url}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <div>
        <label htmlFor="publication" className="block text-sm font-medium text-gray-700">Publication</label>
        <input
          type="text"
          name="publication"
          id="publication"
          value={formData.publication}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <div>
        <label htmlFor="thumbnailUrl" className="block text-sm font-medium text-gray-700">Thumbnail URL (Optional)</label>
        <input
          type="url"
          name="thumbnailUrl"
          id="thumbnailUrl"
          value={formData.thumbnailUrl}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <div>
        <label htmlFor="publishedDate" className="block text-sm font-medium text-gray-700">Published Date</label>
        <input
          type="date" // Use type="date" for date picker
          name="publishedDate"
          id="publishedDate"
          value={formData.publishedDate}
          onChange={handleChange}
          required
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <div>
        <label htmlFor="tags" className="block text-sm font-medium text-gray-700">Tags (comma-separated)</label>
        <input
          type="text"
          name="tags"
          id="tags"
          value={formData.tags}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          placeholder="e.g., tech, AI, startups"
        />
      </div>
      <div>
        <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
        <select
          name="status"
          id="status"
          value={formData.status}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        >
          <option value="Draft">Draft</option>
          <option value="Published">Published</option>
          <option value="Archived">Archived</option>
        </select>
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      {success && <p className="text-green-600 text-sm mt-2">Article updated successfully!</p>}

      <button
        type="submit"
        disabled={loading}
        className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50"
      >
        {loading ? 'Updating...' : 'Update Article'}
      </button>
      <button
        type="button"
        onClick={handleDelete}
        disabled={deleting}
        className="ml-4 px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors duration-200 disabled:opacity-50"
      >
        {deleting ? 'Deleting...' : 'Delete'}
      </button>
      <button
        type="button"
        onClick={() => router.push('/articles')}
        className="ml-4 px-6 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 transition-colors duration-200"
      >
        Cancel
      </button>
    </form>
  );
} 