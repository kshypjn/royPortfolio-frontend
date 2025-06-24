"use client";
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { BlocksRenderer } from '@strapi/blocks-react-renderer';
import TipTapEditor from '../../components/TipTapEditor';

export default function AboutForm({ initialData }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    introduction: '',
    mainContentJson: {},
    ctaText: '',
    ctaLink: '',
    sections: [],
    profileImageUrl: '',
    linkedinUrl: '',
    twitterUrl: '',
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        introduction: initialData.introduction || '',
        mainContentJson: initialData.mainContentJson || {},
        ctaText: initialData.ctaText || '',
        ctaLink: initialData.ctaLink || '',
        sections: Array.isArray(initialData.sectionsJson) ? initialData.sectionsJson : [],
        profileImageUrl: initialData.profileImageUrl || '',
        linkedinUrl: initialData.linkedinUrl || '',
        twitterUrl: initialData.twitterUrl || '',
      });
    }
  }, [initialData]);

  const handleSectionChange = (idx, field, value) => {
    setFormData((prev) => {
      const updatedSections = [...prev.sections];
      updatedSections[idx] = { ...updatedSections[idx], [field]: value };
      return { ...prev, sections: updatedSections };
    });
  };

  const addSection = () => {
    setFormData((prev) => ({
      ...prev,
      sections: [
        ...prev.sections,
        { title: '', tab: '', description: {} },
      ],
    }));
  };

  const removeSection = (idx) => {
    setFormData((prev) => {
      const updatedSections = [...prev.sections];
      updatedSections.splice(idx, 1);
      return { ...prev, sections: updatedSections };
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    try {
      const dataToSend = {
        ...formData,
        sectionsJson: formData.sections,
      };
      delete dataToSend.sections;
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
        <div className={`p-3 mb-4 rounded ${message.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>{message}</div>
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
      <TipTapEditor
        value={formData.mainContentJson}
        onChange={(val) => setFormData((prev) => ({ ...prev, mainContentJson: val }))}
        label="Main Content (Rich Text)"
      />
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">Sections (Work, Education, etc.)</label>
        {formData.sections.map((section, idx) => (
          <div key={idx} className="border border-gray-200 rounded-md p-4 mb-4 bg-gray-50">
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                placeholder="Title"
                value={section.title}
                onChange={(e) => handleSectionChange(idx, 'title', e.target.value)}
                className="flex-1 border border-gray-300 rounded-md p-2"
              />
              <input
                type="text"
                placeholder="Tab (e.g. Work, Education)"
                value={section.tab}
                onChange={(e) => handleSectionChange(idx, 'tab', e.target.value)}
                className="flex-1 border border-gray-300 rounded-md p-2"
              />
              <button type="button" onClick={() => removeSection(idx)} className="text-red-500 font-bold px-2">Remove</button>
            </div>
            <TipTapEditor
              value={section.description}
              onChange={(val) => handleSectionChange(idx, 'description', val)}
              label="Description (Rich Text)"
            />
          </div>
        ))}
        <button type="button" onClick={addSection} className="bg-blue-100 text-blue-700 px-4 py-2 rounded-md font-semibold">Add Section</button>
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
        disabled={loading}
      >
        {loading ? 'Saving...' : 'Save Changes'}
      </button>
    </form>
  );
} 