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
import MediaPickerModal from '@/components/media/MediaPickerModal';

export default function ContentForm({ contentId = null }) {
  const router = useRouter();
  const toast = useToast();
  const { create, update, currentContent, loading } = useContent(null, contentId);
  const { uploading } = useMedia({ folder: 'content-images' });

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

  const [featuredPreviewUrl, setFeaturedPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [categoryInput, setCategoryInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaModalTab, setMediaModalTab] = useState('upload');

  useEffect(() => {
    if (currentContent && contentId) {
      setFormData({
        title: currentContent.title || '',
        slug: currentContent.slug || '',
        excerpt: currentContent.excerpt || '',
        body: currentContent.body || '',
        featuredImage: currentContent.featuredImage?._id || null,
        status: currentContent.status || 'draft',
        categories: currentContent.categories || [],
        tags: currentContent.tags || [],
        seo: currentContent.seo || {
          metaTitle: '',
          metaDescription: '',
          metaKeywords: []
        }
      });
      setFeaturedPreviewUrl(currentContent.featuredImage?.url || null);
    }
  }, [currentContent, contentId]);

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

  const handleRemoveFeaturedImage = () => {
    setFormData(prev => ({ ...prev, featuredImage: null }));
    setFeaturedPreviewUrl(null);
    setSelectedFile(null);
  };

  const addCategory = () => {
    const value = (categoryInput || '').trim();
    if (!value) return;
    setFormData(prev => ({ ...prev, categories: [...prev.categories, value] }));
    setCategoryInput('');
  };

  const removeCategory = (category) => {
    setFormData(prev => ({ ...prev, categories: prev.categories.filter(c => c !== category) }));
  };

  const addTag = () => {
    const value = (tagInput || '').trim();
    if (!value) return;
    setFormData(prev => ({ ...prev, tags: [...prev.tags, value] }));
    setTagInput('');
  };

  const removeTag = (tag) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const performSubmit = async (statusOverride = null) => {
    const dataToSend = new FormData();
    dataToSend.append('title', formData.title || '');
    dataToSend.append('slug', formData.slug || '');
    dataToSend.append('excerpt', formData.excerpt || '');
    dataToSend.append('body', formData.body || '');
    dataToSend.append('status', statusOverride || formData.status || 'draft');

    // Send arrays as JSON strings to satisfy backend Joi schemas
    dataToSend.append('categories', JSON.stringify(formData.categories || []));
    dataToSend.append('tags', JSON.stringify(formData.tags || []));

    // Send SEO as JSON string per validator
    const seoPayload = {
      metaTitle: formData.seo?.metaTitle || '',
      metaDescription: formData.seo?.metaDescription || '',
      metaKeywords: formData.seo?.metaKeywords || []
    };
    dataToSend.append('seo', JSON.stringify(seoPayload));

    if (formData.featuredImage) {
      dataToSend.append('featuredImage', formData.featuredImage);
    }

    if (contentId) {
      await update(contentId, dataToSend);
    } else {
      await create(dataToSend);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await performSubmit();
      toast.success(contentId ? 'Content updated successfully!' : 'Content created successfully!');
      router.push('/dashboard/contents');
    } catch (error) {
      toast.error(contentId ? 'Failed to update content' : 'Failed to create content');
    }
  };

  const handleSaveDraft = async () => {
    try {
      await performSubmit('draft');
      toast.success('Draft saved!');
      router.push('/dashboard/contents');
    } catch {
      toast.error('Failed to save draft');
    }
  };

  const handlePublish = async () => {
    try {
      await performSubmit('published');
      toast.success('Published successfully!');
      router.push('/dashboard/contents');
    } catch {
      toast.error('Failed to publish');
    }
  };

  const openMediaModal = (tab) => {
    setMediaModalTab(tab);
    setIsMediaModalOpen(true);
  };

  const handleSelectFeatured = (media) => {
    if (!media) return;
    setFormData(prev => ({ ...prev, featuredImage: media._id }));
    setFeaturedPreviewUrl(media.url);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-5xl mx-auto p-4 sm:p-6">
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="card-title text-2xl sm:text-3xl">{contentId ? 'Edit Content' : 'Create New Content'}</h1>
              <p className="text-base-content/60">Write and publish your content</p>
            </div>
          </div>

          {/* Title */}
          <div className="form-control">
            <label className="label"><span className="label-text">Title *</span></label>
            <input
              type="text"
              value={formData.title || ''}
              onChange={handleTitleChange}
              className="input input-bordered w-full"
              placeholder="Enter content title"
              required
            />
          </div>

          {/* Slug */}
          <div className="form-control">
            <label className="label"><span className="label-text">Slug</span></label>
            <input
              type="text"
              value={formData.slug || ''}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              className="input input-bordered w-full"
              placeholder="url-friendly-slug"
            />
          </div>

          {/* Excerpt */}
          <div className="form-control">
            <label className="label"><span className="label-text">Excerpt</span></label>
            <textarea
              value={formData.excerpt || ''}
              onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
              className="textarea textarea-bordered w-full"
              rows={3}
              placeholder="Short description"
            />
          </div>

          {/* Tiptap Editor */}
          <div className="form-control">
            <label className="label"><span className="label-text">Content *</span></label>
            <div className="rounded-box border">
              <TiptapEditor
                content={formData.body || ''}
                onChange={handleEditorChange}
                placeholder="Start writing your content..."
              />
            </div>
          </div>

          {/* Featured Image */}
          <div className="form-control">
            <label className="label"><span className="label-text">Featured Image</span></label>
            <div className="flex items-center gap-3">
              <button type="button" className="btn btn-primary btn-sm" onClick={() => openMediaModal('upload')} disabled={uploading}>
                Upload New
              </button>
              <button type="button" className="btn btn-outline btn-sm" onClick={() => openMediaModal('library')}>
                Media Library
              </button>
            </div>
            {featuredPreviewUrl && (
              <div className="mt-4 relative w-48 h-32 border rounded overflow-hidden">
                <img src={featuredPreviewUrl} alt="Featured Preview" className="w-full h-full object-cover" />
                <button
                  type="button"
                  onClick={handleRemoveFeaturedImage}
                  className="btn btn-error btn-xs absolute top-1 right-1"
                  aria-label="Remove featured image"
                >
                  Remove
                </button>
              </div>
            )}
          </div>

          {/* Categories */}
          <div className="form-control">
            <label className="label"><span className="label-text">Categories</span></label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={categoryInput || ''}
                onChange={(e) => setCategoryInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addCategory())}
                className="input input-bordered w-full"
                placeholder="Add category"
              />
              <button type="button" onClick={addCategory} className="btn btn-primary">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(formData.categories || []).map(category => (
                <div key={category} className="badge badge-primary gap-2 p-3">
                  {category}
                  <button type="button" onClick={() => removeCategory(category)} className="btn btn-xs btn-ghost">✕</button>
                </div>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="form-control">
            <label className="label"><span className="label-text">Tags</span></label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={tagInput || ''}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                className="input input-bordered w-full"
                placeholder="Add tag"
              />
              <button type="button" onClick={addTag} className="btn btn-secondary">Add</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {(formData.tags || []).map(tag => (
                <div key={tag} className="badge badge-secondary gap-2 p-3">
                  {tag}
                  <button type="button" onClick={() => removeTag(tag)} className="btn btn-xs btn-ghost">✕</button>
                </div>
              ))}
            </div>
          </div>

          {/* SEO Section */}
          <div className="divider" />
          <div>
            <h2 className="text-lg font-semibold mb-2">SEO Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label"><span className="label-text">Meta Title</span></label>
                <input
                  type="text"
                  value={formData.seo?.metaTitle || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    seo: { ...formData.seo, metaTitle: e.target.value }
                  })}
                  className="input input-bordered w-full"
                  maxLength={60}
                  placeholder="SEO title (max 60 characters)"
                />
                <span className="label-text-alt">{(formData.seo?.metaTitle || '').length}/60</span>
              </div>

              <div className="form-control md:col-span-2">
                <label className="label"><span className="label-text">Meta Description</span></label>
                <textarea
                  value={formData.seo?.metaDescription || ''}
                  onChange={(e) => setFormData({
                    ...formData,
                    seo: { ...formData.seo, metaDescription: e.target.value }
                  })}
                  className="textarea textarea-bordered w-full"
                  maxLength={160}
                  rows={3}
                  placeholder="SEO description (max 160 characters)"
                />
                <span className="label-text-alt">{(formData.seo?.metaDescription || '').length}/160</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="card-actions justify-end pt-2">
            <button type="button" onClick={handleSaveDraft} disabled={loading} className="btn">
              Save as Draft
            </button>
            <button type="button" onClick={() => router.back()} className="btn btn-ghost">
              Cancel
            </button>
            <button type="button" onClick={handlePublish} disabled={loading} className="btn btn-success">
              Publish
            </button>
            <button type="submit" disabled={loading} className="btn btn-primary">
              {loading ? 'Saving...' : (contentId ? 'Update' : 'Create')}
            </button>
          </div>
        </div>
      </div>

      <MediaPickerModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={handleSelectFeatured}
        defaultTab={mediaModalTab}
        uploadFolder="featured-images"
      />
    </form>
  );
}