// ============================================
// 📝 NEW: Content Form with Tiptap
// components/content/ContentForm.jsx
// ============================================



'use client';

import { useState, useEffect } from 'react';
import { useContent } from '@/hooks/useContent';
import { useMedia } from '@/hooks/useMedia';
import { useToast } from '@/hooks/useToast';
import { useRouter } from 'next/navigation';
import TiptapEditor from '@/components/editor/TiptapEditor';
import { generateSlug } from '@/libs/utils';

export default function ContentForm({ contentId = null }) {
  const router = useRouter();
  const toast = useToast();
  const { create, update, currentContent, loading } = useContent(null, contentId);
  const { media, upload, uploading } = useMedia({ folder: 'content-images' });

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    body: '',
    featuredImage: null,
    status: 'draft',
    categories: [],
    tags: [],
    seo: {
      metaTitle: '',
      metaDescription: '',
      metaKeywords: []
    }
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [categoryInput, setCategoryInput] = useState('');
  const [tagInput, setTagInput] = useState('');

  // Load existing content for edit
  useEffect(() => {
    if (currentContent && contentId) {
      setFormData({
        title: currentContent.title || '',
        slug: currentContent.slug || '',
        excerpt: currentContent.excerpt || '',
        body: currentContent.body || '',
        featuredImage: currentContent.featuredImage?.url || null, // Use URL for preview
        status: currentContent.status || 'draft',
        categories: currentContent.categories || [],
        tags: currentContent.tags || [],
        seo: currentContent.seo || {
          metaTitle: '',
          metaDescription: '',
          metaKeywords: []
        }
      });
    }
  }, [currentContent, contentId]);

  // Auto-generate slug from title
  useEffect(() => {
    if (!contentId && formData.title) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(formData.title)
      }));
    }
  }, [formData.title, contentId]);

  const handleTitleChange = (e) => {
    setFormData({ ...formData, title: e.target.value });
  };

  const handleEditorChange = (html) => {
    setFormData({ ...formData, body: html });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file.');
      e.target.value = ''; // Clear the input
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      toast.error('Image size must be less than 10MB.');
      e.target.value = ''; // Clear the input
      return;
    }

    setSelectedFile(file);
    setFormData(prev => ({ ...prev, featuredImage: URL.createObjectURL(file) })); // Set temporary URL for preview
  };

  const handleRemoveFeaturedImage = () => {
    setSelectedFile(null);
    setFormData(prev => ({ ...prev, featuredImage: null }));
  };

  const addCategory = () => {
    if (categoryInput.trim() && !formData.categories.includes(categoryInput.trim())) {
      setFormData({
        ...formData,
        categories: [...formData.categories, categoryInput.trim()]
      });
      setCategoryInput('');
    }
  };

  const removeCategory = (category) => {
    setFormData({
      ...formData,
      categories: formData.categories.filter(c => c !== category)
    });
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()]
      });
      setTagInput('');
    }
  };

  const removeTag = (tag) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(t => t !== tag)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataToSend = new FormData();

    // Append all form data fields
    for (const key in formData) {
      if (key === 'featuredImage') {
        // Skip featuredImage here, handle it separately
        continue;
      } else if (key === 'seo') {
        dataToSend.append(key, JSON.stringify(formData[key]));
      } else if (Array.isArray(formData[key])) {
        formData[key].forEach(item => dataToSend.append(`${key}[]`, item));
      } else {
        dataToSend.append(key, formData[key]);
      }
    }

    // Handle featured image
    if (selectedFile) {
      dataToSend.append('featuredImage', selectedFile);
    } else if (formData.featuredImage && typeof formData.featuredImage === 'string') {
      // If no new file selected, but an existing image is referenced by URL/ID
      dataToSend.append('featuredImage', formData.featuredImage);
    } else if (formData.featuredImage === null) {
      // Explicitly send null if image was cleared
      dataToSend.append('featuredImage', ''); // Send empty string for null
    }

    try {
      if (contentId) {
        await update(contentId, dataToSend);
        toast.success('Content updated successfully!');
      } else {
        await create(dataToSend);
        toast.success('Content created successfully!');
      }
      router.push('/dashboard/contents');
    } catch (error) {
      toast.error(contentId ? 'Failed to update content' : 'Failed to create content');
    }
  };

  const handleSaveDraft = async () => {
    setFormData({ ...formData, status: 'draft' });
    handleSubmit(new Event('submit'));
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">
        {contentId ? 'Edit Content' : 'Create New Content'}
      </h1>

      {/* Title */}
      <div>
        <label className="block text-sm font-medium mb-2">Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={handleTitleChange}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter content title"
          required
        />
      </div>

      {/* Slug */}
      <div>
        <label className="block text-sm font-medium mb-2">Slug</label>
        <input
          type="text"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="url-friendly-slug"
        />
      </div>

      {/* Excerpt */}
      <div>
        <label className="block text-sm font-medium mb-2">Excerpt</label>
        <textarea
          value={formData.excerpt}
          onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
          className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="3"
          placeholder="Short description"
        />
      </div>

      {/* Tiptap Editor */}
      <div>
        <label className="block text-sm font-medium mb-2">Content *</label>
        <TiptapEditor
          content={formData.body}
          onChange={handleEditorChange}
          placeholder="Start writing your content..."
        />
      </div>

      {/* Featured Image */}
      <div>
        <label className="block text-sm font-medium mb-2">Featured Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="block w-full"
        />
        {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
        {formData.featuredImage && (
          <div className="mt-4 relative w-48 h-32 border rounded overflow-hidden">
            <img
              src={typeof formData.featuredImage === 'string' ? formData.featuredImage : `/api/media/${formData.featuredImage}`}
              alt="Featured Preview"
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={() => setFormData({ ...formData, featuredImage: null })}
              className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 text-xs leading-none"
              aria-label="Remove featured image"
            >
              &times;
            </button>
          </div>
        )}
      </div>

      {/* Categories */}
      <div>
        <label className="block text-sm font-medium mb-2">Categories</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={categoryInput}
            onChange={(e) => setCategoryInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
            className="flex-1 px-4 py-2 border rounded"
            placeholder="Add category"
          />
          <button
            type="button"
            onClick={addCategory}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.categories.map(category => (
            <span
              key={category}
              className="bg-blue-100 px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              {category}
              <button
                type="button"
                onClick={() => removeCategory(category)}
                className="text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm font-medium mb-2">Tags</label>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            className="flex-1 px-4 py-2 border rounded"
            placeholder="Add tag"
          />
          <button
            type="button"
            onClick={addTag}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.tags.map(tag => (
            <span
              key={tag}
              className="bg-green-100 px-3 py-1 rounded-full text-sm flex items-center gap-2"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="text-red-600 hover:text-red-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* SEO Section */}
      <div className="border-t pt-6">
        <h2 className="text-xl font-semibold mb-4">SEO Settings</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Meta Title</label>
            <input
              type="text"
              value={formData.seo.metaTitle}
              onChange={(e) => setFormData({
                ...formData,
                seo: { ...formData.seo, metaTitle: e.target.value }
              })}
              className="w-full px-4 py-2 border rounded"
              maxLength={60}
              placeholder="SEO title (max 60 characters)"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.seo.metaTitle.length}/60 characters
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Meta Description</label>
            <textarea
              value={formData.seo.metaDescription}
              onChange={(e) => setFormData({
                ...formData,
                seo: { ...formData.seo, metaDescription: e.target.value }
              })}
              className="w-full px-4 py-2 border rounded"
              maxLength={160}
              rows="3"
              placeholder="SEO description (max 160 characters)"
            />
            <p className="text-xs text-gray-500 mt-1">
              {formData.seo.metaDescription.length}/160 characters
            </p>
          </div>
        </div>
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-4 pt-6 border-t">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : (contentId ? 'Update' : 'Create')}
        </button>

        <button
          type="button"
          onClick={handleSaveDraft}
          disabled={loading}
          className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
        >
          Save as Draft
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 border rounded hover:bg-gray-100"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}