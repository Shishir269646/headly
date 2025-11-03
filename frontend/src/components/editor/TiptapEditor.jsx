'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { useState } from 'react';
import MediaLibraryModal from '@/components/media/MediaLibraryModal';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight } from 'lowlight';
import javascript from 'highlight.js/lib/languages/javascript';
import ImageUploadButton from './ImageUploadButton';

// Create lowlight instance and register languages
const lowlight = createLowlight();
lowlight.register('javascript', javascript);



export default function TiptapEditor({ content, onChange, placeholder = 'Start writing...' }) {
    const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);

    const handleSelectImage = (media) => {
        if (media && media.url) {
            editor.chain().focus().setImage({ src: media.url, alt: media.alt }).run();
        }
        setIsMediaModalOpen(false);
    };

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit.configure({
                heading: {
                    levels: [1, 2, 3, 4]
                }
            }),
            Image.configure({
                HTMLAttributes: {
                    class: 'rounded-lg max-w-full h-auto'
                }
            }),
            Link.configure({
                openOnClick: false,
                HTMLAttributes: {
                    class: 'text-blue-600 underline'
                }
            }),
            Underline,
            TextAlign.configure({
                types: ['heading', 'paragraph']
            }),
            Highlight.configure({
                multicolor: true
            }),
            CodeBlockLowlight.configure({
                lowlight
            })
        ],
        content: content || '',
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl focus:outline-none min-h-[300px] p-4'
            }
        },
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange(html);
        }
    });

    if (!editor) {
        return <div>Loading editor...</div>;
    }

    return (
        <div className="border rounded-lg overflow-hidden">
            <MenuBar editor={editor} onBrowseMedia={() => setIsMediaModalOpen(true)} />
            <EditorContent editor={editor} />
            <MediaLibraryModal
                isOpen={isMediaModalOpen}
                onClose={() => setIsMediaModalOpen(false)}
                onSelect={handleSelectImage}
            />
        </div>
    );
}

// Editor Menu Bar Component
function MenuBar({ editor, onBrowseMedia }) {
    if (!editor) return null;

    

    const setLink = () => {
        const url = window.prompt('Enter URL:');
        if (url) {
            editor.chain().focus().setLink({ href: url }).run();
        }
    };

    return (
        <div className="bg-gray-100 border-b p-2 flex flex-wrap gap-1">
            {/* Text Formatting */}
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`px-3 py-1 rounded hover:bg-gray-200 ${editor.isActive('bold') ? 'bg-gray-300' : ''
                    }`}
                title="Bold"
            >
                <strong>B</strong>
            </button>

            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`px-3 py-1 rounded hover:bg-gray-200 ${editor.isActive('italic') ? 'bg-gray-300' : ''
                    }`}
                title="Italic"
            >
                <em>I</em>
            </button>

            <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`px-3 py-1 rounded hover:bg-gray-200 ${editor.isActive('underline') ? 'bg-gray-300' : ''
                    }`}
                title="Underline"
            >
                <u>U</u>
            </button>

            <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={`px-3 py-1 rounded hover:bg-gray-200 ${editor.isActive('strike') ? 'bg-gray-300' : ''
                    }`}
                title="Strikethrough"
            >
                <s>S</s>
            </button>

            <div className="w-px bg-gray-300 mx-1"></div>

            {/* Headings */}
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={`px-3 py-1 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-300' : ''
                    }`}
                title="Heading 1"
            >
                H1
            </button>

            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={`px-3 py-1 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : ''
                    }`}
                title="Heading 2"
            >
                H2
            </button>

            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={`px-3 py-1 rounded hover:bg-gray-200 ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-300' : ''
                    }`}
                title="Heading 3"
            >
                H3
            </button>

            <div className="w-px bg-gray-300 mx-1"></div>

            {/* Lists */}
            <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`px-3 py-1 rounded hover:bg-gray-200 ${editor.isActive('bulletList') ? 'bg-gray-300' : ''
                    }`}
                title="Bullet List"
            >
                • List
            </button>

            <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`px-3 py-1 rounded hover:bg-gray-200 ${editor.isActive('orderedList') ? 'bg-gray-300' : ''
                    }`}
                title="Numbered List"
            >
                1. List
            </button>

            <div className="w-px bg-gray-300 mx-1"></div>

            {/* Alignment */}
            <button
                onClick={() => editor.chain().focus().setTextAlign('left').run()}
                className={`px-3 py-1 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'left' }) ? 'bg-gray-300' : ''
                    }`}
                title="Align Left"
            >
                ⬅
            </button>

            <button
                onClick={() => editor.chain().focus().setTextAlign('center').run()}
                className={`px-3 py-1 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'center' }) ? 'bg-gray-300' : ''
                    }`}
                title="Align Center"
            >
                ↔
            </button>

            <button
                onClick={() => editor.chain().focus().setTextAlign('right').run()}
                className={`px-3 py-1 rounded hover:bg-gray-200 ${editor.isActive({ textAlign: 'right' }) ? 'bg-gray-300' : ''
                    }`}
                title="Align Right"
            >
                ➡
            </button>

            <div className="w-px bg-gray-300 mx-1"></div>

            {/* Special */}
            <button
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={`px-3 py-1 rounded hover:bg-gray-200 ${editor.isActive('blockquote') ? 'bg-gray-300' : ''
                    }`}
                title="Quote"
            >
                "
            </button>

            <button
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={`px-3 py-1 rounded hover:bg-gray-200 ${editor.isActive('codeBlock') ? 'bg-gray-300' : ''
                    }`}
                title="Code Block"
            >
                {'</>'}
            </button>

            <button
                onClick={() => editor.chain().focus().toggleCode().run()}
                className={`px-3 py-1 rounded hover:bg-gray-200 ${editor.isActive('code') ? 'bg-gray-300' : ''
                    }`}
                title="Inline Code"
            >
                {'<code>'}
            </button>

            <button
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
                className="px-3 py-1 rounded hover:bg-gray-200"
                title="Horizontal Line"
            >
                ―
            </button>

            <div className="w-px bg-gray-300 mx-1"></div>

            {/* Link & Image */}
            <button
                onClick={setLink}
                className={`px-3 py-1 rounded hover:bg-gray-200 ${editor.isActive('link') ? 'bg-gray-300' : ''
                    }`}
                title="Add Link"
            >
                🔗
            </button>

            <ImageUploadButton editor={editor} />

            <button
                onClick={onBrowseMedia}
                className="px-3 py-1 rounded hover:bg-gray-200"
                title="Browse Media Library"
            >
                📚
            </button>

            <div className="w-px bg-gray-300 mx-1"></div>

            {/* Undo/Redo */}
            <button
                onClick={() => editor.chain().focus().undo().run()}
                disabled={!editor.can().undo()}
                className="px-3 py-1 rounded hover:bg-gray-200 disabled:opacity-50"
                title="Undo"
            >
                ↶
            </button>

            <button
                onClick={() => editor.chain().focus().redo().run()}
                disabled={!editor.can().redo()}
                className="px-3 py-1 rounded hover:bg-gray-200 disabled:opacity-50"
                title="Redo"
            >
                ↷
            </button>
        </div>
    );
}