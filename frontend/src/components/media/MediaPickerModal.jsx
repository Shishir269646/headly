import { useState, useMemo, useEffect } from 'react';
import Image from 'next/image';
import { useMedia } from '@/hooks/useMedia';
import { useToast } from '@/hooks/useToast';

// Icons placeholder (assuming lucide-react or similar is available)
// import { UploadCloud, Image as ImageIcon, Search } from 'lucide-react';

export default function MediaPickerModal({ isOpen, onClose, onSelect, defaultTab = 'upload', uploadFolder = 'general' }) {
	const toast = useToast();
	// Fetch a larger limit for a more useful media library experience
	const { media, loading, upload, refetch } = useMedia({ limit: 100 });
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
			// Reset states when closing
			setFile(null);
			setPreview(null);
			setAltText('');
			setSearchTerm('');
		}
	}, [isOpen, defaultTab]);

	// Memoized filtering for performance
	const filteredMedia = useMemo(() => {
		const term = (searchTerm || '').toLowerCase();
		if (!term) return media;
		return media.filter(item =>
			(item.originalName || '').toLowerCase().includes(term) ||
			(item.alt || '').toLowerCase().includes(term)
		);
	}, [media, searchTerm]);

	if (!isOpen) return null;

	const handleFileChange = (e) => {
		const selected = e.target.files?.[0];
		if (!selected) return;

		if (!selected.type.startsWith('image/')) {
			toast.error('Please select an image file (PNG, JPG, GIF, etc.).');
			return;
		}
		const maxSize = 10 * 1024 * 1024;
		if (selected.size > maxSize) {
			toast.error('Image size must be less than 10MB.');
			return;
		}

		setFile(selected);
		// Clear previous alt text if a new file is selected
		setAltText('');
		const reader = new FileReader();
		reader.onloadend = () => setPreview(reader.result);
		reader.readAsDataURL(selected);
	};

	const handleUpload = async () => {
		if (!file) {
			toast.error('Please select a file to upload.');
			return;
		}
		setIsSubmitting(true);
		try {
			const result = await upload(file, { alt: altText || '', folder: uploadFolder });
			const uploaded = result.payload || result;

			if (uploaded && uploaded._id) {
				toast.success('Image uploaded and selected!');
				onSelect(uploaded);
				onClose();
				// Refetch the library content asynchronously 
				setTimeout(() => refetch(), 0);
			} else {
				toast.error('Failed to upload media. Check file type and size.');
			}
		} catch (err) {
			console.error(err);
			toast.error(err?.payload || err?.message || 'Upload failed due to a server error.');
		} finally {
			setIsSubmitting(false);
		}
	};

	// Select item from library
	const handleSelectLibraryItem = (item) => {
		onSelect(item);
		onClose();
	};

	// Use a basic overlay structure for the modal
	return (
		<div
			className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm transition-opacity duration-300"
			onClick={onClose}
		>
			<div
				className="bg-base-100 w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl transition-all duration-300 transform scale-100 opacity-100"
				onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
			>
				<div className="flex items-center justify-between p-6 border-b border-base-200">
					<h3 className="text-2xl font-bold text-primary flex items-center">
						{/* <ImageIcon size={24} className="mr-2" /> */}
						Media Manager
					</h3>
					<button
						onClick={onClose}
						className="btn btn-ghost btn-sm btn-circle"
						aria-label="Close media picker"
					>
						✕
					</button>
				</div>

				<div role="tablist" className="tabs tabs-bordered tabs-lg px-6 pt-3">
					<button
						role="tab"
						className={`tab ${activeTab === 'upload' ? 'tab-active font-semibold' : ''}`}
						onClick={() => setActiveTab('upload')}
					>
						{/* <UploadCloud size={20} className="mr-2 hidden sm:inline" /> */}
						Upload New File
					</button>
					<button
						role="tab"
						className={`tab ${activeTab === 'library' ? 'tab-active font-semibold' : ''}`}
						onClick={() => setActiveTab('library')}
					>
						{/* <ImageIcon size={20} className="mr-2 hidden sm:inline" /> */}
						Media Library
					</button>
				</div>

				<div className="p-6 overflow-y-auto max-h-[70vh]">
					{activeTab === 'upload' && (
						<div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
							{/* Upload Area (lg:col-span-2) */}
							<div className="lg:col-span-2 space-y-5">
								<div className="border-2 border-dashed border-base-300 p-6 rounded-xl hover:border-primary transition duration-200">
									<input
										type="file"
										accept="image/*"
										className="file-input file-input-primary file-input-bordered w-full"
										onChange={handleFileChange}
										aria-label="Choose image file"
									/>
									<p className="text-sm text-base-content/60 mt-3">Max file size: 10MB. Formats: JPG, PNG, GIF, SVG.</p>
								</div>

								{preview && (
									<div className="card shadow-lg border">
										<div className="card-body p-4">
											<h4 className="font-semibold mb-2">Image Preview</h4>
											<div className="relative w-full h-64 rounded-lg overflow-hidden bg-base-200">
												<img
													src={preview}
													alt="Preview"
													className="w-full h-full object-contain"
												/>
											</div>
										</div>
									</div>
								)}
							</div>

							{/* Options and Action (lg:col-span-1) */}
							<div className="lg:col-span-1 space-y-4 pt-4 lg:pt-0">
								<label className="form-control w-full">
									<div className="label"><span className="label-text font-medium">Alt text (for SEO & accessibility)</span></div>
									<input
										type="text"
										value={altText || ''}
										onChange={(e) => setAltText(e.target.value)}
										placeholder="Descriptive text for the image"
										className="input input-bordered w-full"
									/>
								</label>

								<div className="pt-4">
									<button
										className="btn btn-primary btn-block"
										onClick={handleUpload}
										disabled={!file || isSubmitting}
									>
										{/* <UploadCloud size={20} className="mr-2" /> */}
										{isSubmitting ? 'Uploading...' : 'Upload & Select'}
									</button>
								</div>
							</div>
						</div>
					)}

					{activeTab === 'library' && (
						<div className="space-y-4">
							<div className="flex items-center gap-4">
								{/* Search Bar with Icon */}
								<div className="input-group">
									<span className="bg-base-200 border-r-0 rounded-l-lg p-3">
										{/* <Search size={20} /> */}
										🔍
									</span>
									<input
										type="text"
										value={searchTerm || ''}
										onChange={(e) => setSearchTerm(e.target.value)}
										placeholder="Search by file name or alt text..."
										className="input input-bordered w-full focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
										aria-label="Search media library"
									/>
								</div>
							</div>

							{/* Media Grid */}
							<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 py-2">
								{loading ? (
									<div className="col-span-full flex flex-col items-center justify-center py-12">
										<span className="loading loading-spinner loading-lg text-primary"></span>
										<p className="mt-3 text-base-content/60">Loading media library...</p>
									</div>
								) : filteredMedia.length === 0 ? (
									<div className="col-span-full text-center py-12 text-base-content/60">
										No images found matching your search term.
									</div>
								) : (
									filteredMedia.map(item => (
										<button
											key={item._id}
											onClick={() => handleSelectLibraryItem(item)}
											className="group card bg-base-100 border border-base-300 rounded-lg overflow-hidden shadow-md hover:shadow-lg hover:border-primary focus:outline-none focus:ring-2 focus:ring-primary transition duration-200"
											title={item.originalName || 'Click to select'}
										>
											<div className="relative aspect-square">
												{/* Replaced 'next/image' with basic img tag for simplicity in this single-file context */}
												<img
													src={item.url}
													alt={item.alt || item.originalName || 'Media item'}
													className="object-cover w-full h-full transition duration-300 group-hover:scale-[1.02]"
													onError={(e) => e.target.src = 'https://placehold.co/150x150/EEEEEE/AAAAAA?text=Error'}
												/>
												<div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
													<span className="badge badge-lg badge-primary text-white font-bold">SELECT</span>
												</div>
											</div>
											<div className="p-2 text-left">
												<p className="text-xs truncate font-medium text-base-content/80">{item.originalName || 'Untitled File'}</p>
											</div>
										</button>
									))
								)}
							</div>
						</div>
					)}
				</div>

				{/* Footer (Optional, useful for quick actions) */}
				<div className="flex justify-end p-4 border-t border-base-200">
					<button onClick={onClose} className="btn btn-ghost">Close</button>
				</div>
			</div>
		</div>
	);
}