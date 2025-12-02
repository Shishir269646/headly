'use client';

import { useMedia } from '@/hooks/useMedia';
import Image from 'next/image';
import { useState } from 'react';
import Loader from '../common/Loader';

export default function MediaLibraryModal({ isOpen, onClose, onSelect }) {
    const { media, loading } = useMedia({ limit: 50 }); // Fetch more items for the modal
    const [searchTerm, setSearchTerm] = useState('');

    if (!isOpen) return null;

    const filteredMedia = media.filter(item =>
        item.originalName.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full h-3/4 flex flex-col">
                <div className="flex justify-between items-center mb-4">
                    <h3 className="text-xl font-bold text-gray-900">Select from Media Library</h3>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-800">&times;</button>
                </div>

                <input
                    type="text"
                    placeholder="Search media..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border rounded-lg mb-4"
                />

                {loading ? (
                    <Loader />
                ) : (
                    <div className="flex-1 overflow-y-auto grid grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
                        {filteredMedia.map((item) => (
                            <div
                                key={item._id}
                                className="group relative bg-white rounded-lg shadow overflow-hidden cursor-pointer"
                                onClick={() => onSelect(item)}
                            >
                                <div className="aspect-square relative">
                                    <Image
                                        src={item.url}
                                        alt={item.alt || item.originalName}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all flex items-center justify-center">
                                        <p className="text-white text-xs text-center p-1 opacity-0 group-hover:opacity-100">
                                            {item.originalName}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
