import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useMedia } from '@/hooks/useMedia';
import { useToast } from '@/hooks/useToast';

export default function MediaPickerModal({ isOpen, onClose, onSelect, defaultTab = 'upload', uploadFolder = 'general' }) {
	const toast = useToast();
	const { media, loading, upload, refetch } = useMedia({ limit: 60 });
	const [activeTab, setActiveTab] = useState(defaultTab || 'upload');
	const [file, setFile] = useState(null);
	const [preview, setPreview] = useState(null);
	const [altText, setAltText] = useState('');
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [searchTerm, setSearchTerm] = useState('');

	useEffect(() => {
		if (isOpen) {
			setActiveTab(defaultTab || 'upload');
		} else {
			setFile(null);
			setPreview(null);
			setAltText('');
			setSearchTerm('');
		}
	}, [isOpen, defaultTab]);

	const filteredMedia = useMemo(() => {
		const term = (searchTerm || '').toLowerCase();
		if (!term) return media;
		return media.filter(item => (item.originalName || '').toLowerCase().includes(term));
	}, [media, searchTerm]);

	if (!isOpen) return null;

	const handleFileChange = (e) => {
		const selected = e.target.files?.[0];
		if (!selected) return;

		if (!selected.type.startsWith('image/')) {
			toast.error('Please select an image file.');
			return;
		}
		const maxSize = 10 * 1024 * 1024;
		if (selected.size > maxSize) {
			toast.error('Image size must be less than 10MB.');
			return;
		}

		setFile(selected);
		const reader = new FileReader();
		reader.onloadend = () => setPreview(reader.result);
		reader.readAsDataURL(selected);
	};

	const handleUpload = async () => {
		if (!file) return;
		setIsSubmitting(true);
		try {
			const result = await upload(file, { alt: altText || '', folder: uploadFolder });
			const uploaded = result.payload || result;
			if (uploaded && uploaded._id) {
				toast.success('Uploaded!');
				onSelect(uploaded);
				onClose();
				setTimeout(() => refetch(), 0);
			} else {
				toast.error('Failed to upload media.');
			}
		} catch (err) {
			toast.error(err?.payload || err?.message || 'Upload failed');
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
			<div className="bg-base-100 w-full max-w-5xl rounded-xl shadow-xl">
				<div className="flex items-center justify-between px-5 py-4 border-b">
					<h3 className="text-lg font-semibold">Select Image</h3>
					<button onClick={onClose} className="btn btn-ghost btn-sm" aria-label="Close media picker">✕</button>
				</div>

				<div role="tablist" className="tabs tabs-bordered px-4 pt-3">
					<button role="tab" className={`tab ${activeTab === 'upload' ? 'tab-active' : ''}`} onClick={() => setActiveTab('upload')}>Upload New</button>
					<button role="tab" className={`tab ${activeTab === 'library' ? 'tab-active' : ''}`} onClick={() => setActiveTab('library')}>Media Library</button>
				</div>

				<div className="p-5">
					{activeTab === 'upload' ? (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div>
								<input type="file" accept="image/*" className="file-input file-input-bordered w-full" onChange={handleFileChange} aria-label="Choose image file" />
								{preview && (
									<div className="mt-4 border rounded-lg overflow-hidden">
										<img src={preview} alt="Preview" className="w-full h-64 object-cover" />
									</div>
								)}
							</div>
							<div className="space-y-4">
								<label className="form-control w-full">
									<div className="label"><span className="label-text">Alt text</span></div>
									<input type="text" value={altText || ''} onChange={(e) => setAltText(e.target.value)} placeholder="Describe the image for accessibility" className="input input-bordered w-full" />
								</label>
								<div className="pt-2">
									<button className="btn btn-primary" onClick={handleUpload} disabled={!file || isSubmitting}>
										{isSubmitting ? 'Uploading...' : 'Upload & Select'}
									</button>
								</div>
							</div>
						</div>
					) : (
						<div className="space-y-4">
							<div className="flex items-center justify-between gap-4">
								<input type="text" value={searchTerm || ''} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search media..." className="input input-bordered w-full" aria-label="Search media" />
							</div>
							<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 max-h-[60vh] overflow-y-auto">
								{loading ? (
									<div className="col-span-full flex items-center justify-center py-12">
										<span className="loading loading-spinner loading-md"></span>
									</div>
								) : (
									filteredMedia.map(item => (
										<button key={item._id} onClick={() => { onSelect(item); onClose(); }} className="group border rounded-lg overflow-hidden hover:shadow focus:outline-none">
											<div className="relative aspect-square">
												<Image src={item.url} alt={item.alt || item.originalName || 'Media item'} fill className="object-cover" />
											</div>
											<div className="p-2 text-left">
												<p className="text-xs truncate" title={item.originalName || ''}>{item.originalName || ''}</p>
											</div>
										</button>
									))
								)}
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
