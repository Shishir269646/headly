// ============================================
// 📝 REFACTORED: Content Form with Tiptap (Professional DaisyUI)
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
import { useCategories } from '@/hooks/useCategories';

import { Save, Send, Image, LayoutList, Tag, ChevronDown } from 'lucide-react';

// --- Component Start ---

export default function ContentForm({ contentId = null }) {
  const router = useRouter();
  const toast = useToast();
  const { categories: availableCategories, loading: categoriesLoading } = useCategories();

  // Renamed 'loading' to 'isSubmitting' for clarity on form-level loading state
  const { create, update, currentContent, loading: isSubmitting } = useContent(null, contentId);
  const { uploading } = useMedia({ folder: 'content-images' });

  // --- State Initialization ---
  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    body: '',
    // This holds the Media ObjectId (string)
    featuredImage: null,
    status: 'draft',
    category: '',
    tags: [],
    seo: {
      metaTitle: '',
      metaDescription: '',
      metaKeywords: []
    }
  });

  const [featuredPreviewUrl, setFeaturedPreviewUrl] = useState(null);
  const [tagInput, setTagInput] = useState('');
  const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
  const [mediaModalTab, setMediaModalTab] = useState('upload');
  const [isSeoOpen, setIsSeoOpen] = useState(false);

  // --- Effects ---

  // 1. Load existing content data for editing
  useEffect(() => {
    if (currentContent && contentId) {
      setFormData({
        title: currentContent.title || '',
        slug: currentContent.slug || '',
        excerpt: currentContent.excerpt || '',
        body: currentContent.body || '',
        // Use the Media object ID for the form field
        featuredImage: currentContent.featuredImage?._id || null,
        status: currentContent.status || 'draft',
        category: currentContent.category?._id || '',
        tags: currentContent.tags || [],
        seo: currentContent.seo || {
          metaTitle: '',
          metaDescription: '',
          metaKeywords: []
        }
      });
      // Use the Media URL for the image preview
      setFeaturedPreviewUrl(currentContent.featuredImage?.url || null);
    }
  }, [currentContent, contentId]);

  // 2. Auto-generate slug on title change for new content
  useEffect(() => {
    // Only auto-generate slug if we are creating new content (no contentId)
    // AND if the user hasn't started editing the slug manually (optional refinement)
    if (!contentId && formData.title) {
      setFormData(prev => ({
        ...prev,
        slug: generateSlug(formData.title)
      }));
    }
  }, [formData.title, contentId]);

  // --- Handlers ---

  const handleTitleChange = (e) => {
    setFormData({ ...formData, title: e.target.value });
  };

  const handleEditorChange = (html) => {
    setFormData({ ...formData, body: html });
  };



  const handleRemoveFeaturedImage = () => {
    setFormData(prev => ({ ...prev, featuredImage: null }));
    setFeaturedPreviewUrl(null);
  };

  const addTag = () => {
    const value = (tagInput || '').trim();
    if (!value || formData.tags.includes(value)) return;
    setFormData(prev => ({ ...prev, tags: [...prev.tags, value] }));
    setTagInput('');
  };

  const removeTag = (tag) => {
    setFormData(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const handleSeoChange = (key, value) => {
    setFormData(prev => ({
      ...prev,
      seo: { ...prev.seo, [key]: value }
    }));
  };


  const performSubmit = async (statusOverride = null) => {
    // Input validation check
    if (!formData.title || !formData.body) {
      toast.error('Title and Content body are required!');
      return;
    }

    const dataToSend = new FormData();

    // Append simple fields
    dataToSend.append('title', formData.title || '');
    // Ensure slug is sent, either custom or generated
    dataToSend.append('slug', formData.slug || generateSlug(formData.title));
    dataToSend.append('excerpt', formData.excerpt || '');
    dataToSend.append('body', formData.body || '');
    dataToSend.append('status', statusOverride || formData.status || 'draft');
    dataToSend.append('category', formData.category || '');

    // Append complex fields as JSON strings (CRITICAL for multipart/form-data)
    dataToSend.append('tags', JSON.stringify(formData.tags || []));

    // Prepare and append SEO object as a JSON string
    const seoPayload = {
      metaTitle: formData.seo?.metaTitle || '',
      metaDescription: formData.seo?.metaDescription || '',
      metaKeywords: formData.seo?.metaKeywords || [] // Ensure it's an array
    };
    dataToSend.append('seo', JSON.stringify(seoPayload));

    // Append featuredImage ID if present
    if (formData.featuredImage) {
      dataToSend.append('featuredImage', formData.featuredImage);
    }



    let result;
    if (contentId) {
      result = await update(contentId, dataToSend);
    } else {
      result = await create(dataToSend);
    }
    return result;
  };

  const handleAction = async (e, status) => {
    if (e) e.preventDefault();
    try {
      await performSubmit(status);

      let successMessage = '';
      if (status === 'published') {
        successMessage = 'Content successfully published!';
      } else if (status === 'draft') {
        successMessage = 'Draft saved!';
      } else {
        successMessage = contentId ? 'Content updated successfully!' : 'Content created successfully!';
      }

      toast.success(successMessage);
      router.push('/dashboard/contents');

    } catch (error) {
      console.error('Submission Error:', error);
      // Display a more general error if the specific error is not available
      const errorMessage = error?.response?.data?.message || `Failed to ${status === 'published' ? 'publish' : 'save content'}.`;
      toast.error(errorMessage);
    }
  };


  const openMediaModal = (tab) => {
    setMediaModalTab(tab);
    setIsMediaModalOpen(true);
  };

  // Called when a media item is selected from the MediaPickerModal
  const handleSelectFeatured = (media) => {
    if (!media) return;
    // Save the Media ID to the form data
    setFormData(prev => ({ ...prev, featuredImage: media._id }));
    // Save the Media URL for instant preview
    setFeaturedPreviewUrl(media.url);
    setIsMediaModalOpen(false);
  };

  // --- Render ---

  // Calculate remaining characters for SEO
  const metaTitleLength = (formData.seo?.metaTitle || '').length;
  const metaDescriptionLength = (formData.seo?.metaDescription || '').length;

  return (
    <div className="p-4 sm:p-6 lg:p-8">

      {/* Header and Actions Panel */}
      <div className="flex justify-between items-center mb-6 top-0 bg-base-100 z-10 py-4 border-b">
        <h1 className="text-3xl font-bold text-primary">
          {contentId ? "Edit Content" : 'Create New Content'}
        </h1>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => handleAction(null, 'draft')}
            disabled={isSubmitting}
            className="btn btn-outline"
          >
            <Save size={18} />
            {isSubmitting ? 'Saving...' : 'Save Draft'}
          </button>
          <button
            type="button"
            onClick={() => handleAction(null, 'published')}
            disabled={isSubmitting || !formData.title || !formData.body}
            className="btn btn-success"
          >
            <Send size={18} />
            {isSubmitting ? 'Publishing...' : 'Publish'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="btn btn-ghost ml-2"
          >
            Cancel
          </button>
        </div>
      </div>

      <form onSubmit={(e) => handleAction(e, formData.status)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* Main Content Column (2/3 width) */}
        <div className="lg:col-span-2 space-y-6">

          {/* Title and Slug Card */}
          <div className="card bg-base-100 shadow-xl border">
            <div className="card-body p-6">
              <div className="form-control">
                <label className="label"><span className="label-text font-semibold">Title *</span></label>
                <input
                  type="text"
                  value={formData.title || ''}
                  onChange={handleTitleChange}
                  className="input input-bordered input-lg w-full text-xl font-bold"
                  placeholder="Enter an engaging title"
                  required
                />
              </div>
              <div className="form-control mt-2">
                <label className="label pt-0"><span className="label-text text-sm">Slug:</span></label>
                <input
                  type="text"
                  value={formData.slug || ''}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  className="input input-bordered w-full text-sm"
                  placeholder="url-friendly-slug"
                />
              </div>
            </div>
          </div>

          {/* Excerpt Card */}
          <div className="card bg-base-100 shadow-xl border">
            <div className="card-body p-6">
              <div className="form-control">
                <label className="label"><span className="label-text font-semibold">Excerpt / Summary</span></label>
                <textarea
                  value={formData.excerpt || ''}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="textarea textarea-bordered w-full"
                  rows={3}
                  placeholder="A short description for listings and previews"
                />
              </div>
            </div>
          </div>

          {/* Tiptap Editor Card */}
          <div className="card bg-base-100 shadow-xl border">
            <div className="card-body p-6">
              <label className="label p-0 mb-3"><span className="label-text font-semibold">Content Body *</span></label>
              <div className="border rounded-lg overflow-hidden">
                {contentId && !currentContent ? (
                  <div className="flex justify-center items-center min-h-[300px]">
                    <span className="loading loading-spinner loading-lg"></span>
                  </div>
                ) : (
                  <TiptapEditor
                    content={formData.body || ''}
                    onChange={handleEditorChange}
                    onSave={(editorHtml) => {
                        setFormData(prev => ({ ...prev, body: editorHtml }));
                        performSubmit('draft');
                    }}
                    placeholder="Start writing your content..."
                  />
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Column (1/3 width) */}
        <div className="lg:col-span-1 space-y-6">

          {/* Status Card */}
          <div className="card bg-base-100 shadow-xl border">
            <div className="card-body p-6">
              <h2 className="card-title text-lg">Status & Visibility</h2>
              <div className="form-control">
                <label className="label cursor-pointer">
                  <span className="label-text font-medium">Current Status:</span>
                  <span className={`badge badge-lg ${formData.status === 'published' ? 'badge-success' : 'badge-warning'}`}>
                    {formData.status.charAt(0).toUpperCase() + formData.status.slice(1)}
                  </span>
                </label>

                <select
                  className="select select-bordered select-sm w-full mt-2"
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                >
                  <option value="draft">Draft</option>
                  <option value="published">Published</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* Featured Image Card */}
          <div className="card bg-base-100 shadow-xl border">
            <div className="card-body p-6">
              <h2 className="card-title text-lg">Featured Image</h2>
              <div className="flex flex-col gap-3">
                <div className="flex gap-2">
                  <button type="button" className="btn btn-primary btn-sm" onClick={() => openMediaModal('upload')} disabled={uploading}>
                    <Image size={16} />
                    Upload
                  </button>
                  <button type="button" className="btn btn-outline btn-sm" onClick={() => openMediaModal('library')}>
                    <LayoutList size={16} />
                    Library
                  </button>
                </div>

                {featuredPreviewUrl ? (
                  <div className="relative w-full h-40 border rounded-lg overflow-hidden shadow-md">
                    <img
                      src={featuredPreviewUrl}
                      alt="Featured Preview"
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveFeaturedImage}
                      className="btn btn-error btn-xs absolute top-2 right-2 z-10"
                      aria-label="Remove featured image"
                    >
                      ✕ Remove
                    </button>
                  </div>
                ) : (
                  <div className="h-40 flex items-center justify-center border-2 border-dashed rounded-lg text-base-content/50">
                    No image selected
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Categories & Tags Card */}
          <div className="card bg-base-100 shadow-xl border">
            <div className="card-body p-6 space-y-4">
              <h2 className="card-title text-lg">Organization</h2>

              {/* Categories Section */}
              <div className="form-control">
                <label className="label p-0"><span className="label-text font-medium">Category</span></label>
                <select
                  className="select select-bordered w-full"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  disabled={categoriesLoading}
                  required
                >
                  <option value="" disabled>
                    {categoriesLoading ? 'Loading categories...' : 'Select a category'}
                  </option>
                  {availableCategories.map(cat => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              {/* Tags Section */}
              <div className="form-control pt-2 border-t mt-4">
                <label className="label p-0"><span className="label-text font-medium flex items-center">
                  <Tag size={16} className="mr-1" />
                  Tags
                </span></label>
                <div className="input-.group">
                  <input
                    type="text"
                    value={tagInput || ''}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="input input-bordered input-sm w-full"
                    placeholder="e.g. javascript, nextjs"
                  />
                  <button type="button" onClick={addTag} className="btn btn-secondary btn-sm">Add</button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {(formData.tags || []).map(tag => (
                    <div key={tag} className="badge badge-secondary gap-1 p-3 font-medium">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="btn btn-xs btn-ghost text-white ml-1">✕</button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* SEO Settings Card (DaisyUI Collapse) */}
          <div
            className={`collapse bg-base-100 shadow-xl border ${isSeoOpen ? 'collapse-open' : 'collapse-close'
              }`}
          >
            <input
              type="checkbox"
              checked={isSeoOpen}
              onChange={() => setIsSeoOpen(!isSeoOpen)}
            />

            <div className="collapse-title flex items-center gap-3 text-xl font-medium">
              <ChevronDown size={20} className="mr-2" />
              SEO Settings
            </div>

            <div className="collapse-content">
              {/* your form controls */}
              <div className="space-y-4 pt-2">
                {/* Meta Title */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Meta Title</span>
                  </label>
                  <input
                    type="text"
                    value={formData.seo?.metaTitle || ''}
                    onChange={(e) => handleSeoChange('metaTitle', e.target.value)}
                    className="input input-bordered w-full"
                    maxLength={60}
                    placeholder="SEO title (max 60 characters)"
                  />
                </div>

                {/* Meta Description */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Meta Description</span>
                  </label>
                  <textarea
                    value={formData.seo?.metaDescription || ''}
                    onChange={(e) => handleSeoChange('metaDescription', e.target.value)}
                    className="textarea textarea-bordered w-full"
                    maxLength={160}
                    rows={3}
                    placeholder="SEO description (max 160 characters)"
                  />
                </div>
              </div>
            </div>
          </div>





        </div>

      </form>

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isMediaModalOpen}
        onClose={() => setIsMediaModalOpen(false)}
        onSelect={handleSelectFeatured}
        defaultTab={mediaModalTab}
        uploadFolder="featured-images"
      />
    </div>
  );
}
