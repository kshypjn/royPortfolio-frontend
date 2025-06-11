"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';

export default function AboutForm({ initialData }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    introduction: '',
    mainContentJson: '[]',
    ctaText: '',
    ctaLink: '',
    sectionsJson: '[]',
    profileImageUrl: '',
    linkedinUrl: '',
    twitterUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isJsonValid, setIsJsonValid] = useState({ mainContentJson: true, sectionsJson: true });

  useEffect(() => {
    if (initialData) {
      setFormData({
        introduction: initialData.introduction || '',
        mainContentJson: JSON.stringify(initialData.mainContentJson || [], null, 2),
        ctaText: initialData.ctaText || '',
        ctaLink: initialData.ctaLink || '',
        sectionsJson: JSON.stringify(initialData.sectionsJson || [], null, 2),
        profileImageUrl: initialData.profileImageUrl || '',
        linkedinUrl: initialData.linkedinUrl || '',
        twitterUrl: initialData.twitterUrl || '',
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'mainContentJson' || name === 'sectionsJson') {
      try {
        JSON.parse(value);
        setIsJsonValid((prev) => ({ ...prev, [name]: true }));
      } catch (error) {
        setIsJsonValid((prev) => ({ ...prev, [name]: false }));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    let jsonValid = true;
    const dataToSend = { ...formData };
    try {
      dataToSend.mainContentJson = JSON.parse(formData.mainContentJson);
    } catch (error) {
      setIsJsonValid((prev) => ({ ...prev, mainContentJson: false }));
      jsonValid = false;
    }
    try {
      dataToSend.sectionsJson = JSON.parse(formData.sectionsJson);
    } catch (error) {
      setIsJsonValid((prev) => ({ ...prev, sectionsJson: false }));
      jsonValid = false;
    }
    if (!jsonValid) {
      setMessage('Error: Invalid JSON in content fields. Please correct them.');
      setLoading(false);
      return;
    }
    try {
      const response = await fetch('/api/admin/about', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update About Page');
      }
      setMessage('About Page updated successfully!');
      router.refresh();
    } catch (error) {
      setMessage(`Error: ${error.message}`);
      console.error('Submit Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-8 bg-white shadow-md rounded-lg max-w-4xl mx-auto my-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Edit About Page</h2>
      {message && (
        <div className={`p-3 mb-4 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {message}
        </div>
      )}
      <div className="mb-4">
        <label htmlFor="introduction" className="block text-sm font-medium text-gray-700">Introduction</label>
        <input
          type="text"
          id="introduction"
          name="introduction"
          value={formData.introduction}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
          required
        />
      </div>
      <div className="mb-4">
        <label htmlFor="mainContentJson" className="block text-sm font-medium text-gray-700">
          Main Content (JSON Blocks)
        </label>
        <textarea
          id="mainContentJson"
          name="mainContentJson"
          value={formData.mainContentJson}
          onChange={handleChange}
          rows="10"
          className={`mt-1 block w-full border ${isJsonValid.mainContentJson ? 'border-gray-300' : 'border-red-500'} rounded-md shadow-sm p-2 font-mono text-xs`}
          required
        ></textarea>
        {!isJsonValid.mainContentJson && (
          <p className="text-red-500 text-xs mt-1">Invalid JSON format. Please ensure it&apos;s a valid JSON array.</p>
        )}
        <div className="mt-2 p-2 border border-blue-200 rounded-md bg-blue-50 text-sm">
            <p className="font-semibold text-blue-800 mb-1">Preview Main Content:</p>
            {isJsonValid.mainContentJson && formData.mainContentJson ? (
                <BlocksRenderer content={JSON.parse(formData.mainContentJson)} />
            ) : (
                <p className="text-gray-500">Enter valid JSON to see preview.</p>
            )}
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="ctaText" className="block text-sm font-medium text-gray-700">CTA Button Text</label>
        <input
          type="text"
          id="ctaText"
          name="ctaText"
          value={formData.ctaText}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="ctaLink" className="block text-sm font-medium text-gray-700">CTA Button Link (URL)</label>
        <input
          type="url"
          id="ctaLink"
          name="ctaLink"
          value={formData.ctaLink}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="sectionsJson" className="block text-sm font-medium text-gray-700">
          Sections (Work, Education, etc. - JSON Array)
        </label>
        <textarea
          id="sectionsJson"
          name="sectionsJson"
          value={formData.sectionsJson}
          onChange={handleChange}
          rows="10"
          className={`mt-1 block w-full border ${isJsonValid.sectionsJson ? 'border-gray-300' : 'border-red-500'} rounded-md shadow-sm p-2 font-mono text-xs`}
        ></textarea>
        {!isJsonValid.sectionsJson && (
          <p className="text-red-500 text-xs mt-1">Invalid JSON format. Please ensure it&apos;s a valid JSON array.</p>
        )}
         <div className="mt-2 p-2 border border-blue-200 rounded-md bg-blue-50 text-sm">
            <p className="font-semibold text-blue-800 mb-1">Preview Sections:</p>
            {isJsonValid.sectionsJson && formData.sectionsJson ? (
                JSON.parse(formData.sectionsJson).map((section, idx) => (
                    <div key={idx} className="mb-2">
                        <h5 className="font-semibold">{section.title} ({section.tab})</h5>
                        {section.description && <BlocksRenderer content={section.description} />}
                    </div>
                ))
            ) : (
                <p className="text-gray-500">Enter valid JSON to see preview.</p>
            )}
        </div>
      </div>
      <div className="mb-4">
        <label htmlFor="profileImageUrl" className="block text-sm font-medium text-gray-700">Profile Image URL</label>
        <input
          type="url"
          id="profileImageUrl"
          name="profileImageUrl"
          value={formData.profileImageUrl}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
         {formData.profileImageUrl && (
            <img src={formData.profileImageUrl} alt="Profile Preview" className="mt-2 max-w-[100px] h-auto rounded-md" />
        )}
      </div>
      <div className="mb-4">
        <label htmlFor="linkedinUrl" className="block text-sm font-medium text-gray-700">LinkedIn URL</label>
        <input
          type="url"
          id="linkedinUrl"
          name="linkedinUrl"
          value={formData.linkedinUrl}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <div className="mb-6">
        <label htmlFor="twitterUrl" className="block text-sm font-medium text-gray-700">Twitter URL</label>
        <input
          type="url"
          id="twitterUrl"
          name="twitterUrl"
          value={formData.twitterUrl}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        disabled={loading || !isJsonValid.mainContentJson || !isJsonValid.sectionsJson}
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
} 