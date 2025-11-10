'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { useState, useEffect } from 'react';
import MediaPickerModal from '@/components/media/MediaPickerModal';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight';
import { createLowlight } from 'lowlight';
import javascript from 'highlight.js/lib/languages/javascript';

const lowlight = createLowlight();
lowlight.register('javascript', javascript);

export default function TiptapEditor({ content, onChange, placeholder = 'Start writing...' }) {
    const [isMediaModalOpen, setIsMediaModalOpen] = useState(false);
    const [mediaModalTab, setMediaModalTab] = useState('upload');

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
                heading: { levels: [1, 2, 3, 4] },
                codeBlock: false,
            }),
            Image.configure({ HTMLAttributes: { class: 'rounded-lg max-w-full h-auto' } }),
            Underline,
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
            Highlight.configure({ multicolor: true }),
            CodeBlockLowlight.configure({ lowlight })
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

    // Effect to update editor content when the 'content' prop changes
    useEffect(() => {
        if (editor && content !== editor.getHTML()) {
            editor.commands.setContent(content || '', false, { preserveCursor: true });
        }
    }, [content, editor]);

    if (!editor) {
        return <div>Loading editor...</div>;
    }

    return (
        <div className="rounded-box border overflow-hidden">
            <MenuBar
                editor={editor}
                onBrowseMedia={(tab) => { setMediaModalTab(tab); setIsMediaModalOpen(true); }}
            />
            <EditorContent editor={editor} />
            <MediaPickerModal
                isOpen={isMediaModalOpen}
                onClose={() => setIsMediaModalOpen(false)}
                onSelect={handleSelectImage}
                defaultTab={mediaModalTab}
                uploadFolder="content-images"
            />
        </div>
    );
}

function MenuBar({ editor, onBrowseMedia }) {
    if (!editor) return null;

    const setLink = () => {
        const url = window.prompt('Enter URL:');
        if (url) editor.chain().focus().setLink({ href: url }).run();
    };

    const btn = (active) => `btn btn-sm ${active ? 'btn-active' : ''}`;

    return (
        <div className="bg-base-200 border-b p-2 flex flex-wrap gap-2">
            <button onClick={() => editor.chain().focus().toggleBold().run()} className={btn(editor.isActive('bold'))}>B</button>
            <button onClick={() => editor.chain().focus().toggleItalic().run()} className={btn(editor.isActive('italic'))}>I</button>
            <button onClick={() => editor.chain().focus().toggleUnderline().run()} className={btn(editor.isActive('underline'))}>U</button>
            <button onClick={() => editor.chain().focus().toggleStrike().run()} className={btn(editor.isActive('strike'))}>S</button>

            <div className="divider divider-horizontal m-0"></div>

            <button onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btn(editor.isActive('heading', { level: 1 }))}>H1</button>
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btn(editor.isActive('heading', { level: 2 }))}>H2</button>
            <button onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btn(editor.isActive('heading', { level: 3 }))}>H3</button>

            <div className="divider divider-horizontal m-0"></div>

            <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={btn(editor.isActive('bulletList'))}>•</button>
            <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btn(editor.isActive('orderedList'))}>1.</button>

            <div className="divider divider-horizontal m-0"></div>

            <button onClick={() => editor.chain().focus().setTextAlign('left').run()} className={btn(editor.isActive({ textAlign: 'left' }))}>⟸</button>
            <button onClick={() => editor.chain().focus().setTextAlign('center').run()} className={btn(editor.isActive({ textAlign: 'center' }))}>↔</button>
            <button onClick={() => editor.chain().focus().setTextAlign('right').run()} className={btn(editor.isActive({ textAlign: 'right' }))}>⟹</button>

            <div className="divider divider-horizontal m-0"></div>

            <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btn(editor.isActive('blockquote'))}>“”</button>
            <button onClick={() => editor.chain().focus().toggleCodeBlock().run()} className={btn(editor.isActive('codeBlock'))}>{'</>'}</button>
            <button onClick={() => editor.chain().focus().toggleCode().run()} className={btn(editor.isActive('code'))}>{'<>'}</button>
            <button onClick={() => editor.chain().focus().setHorizontalRule().run()} className="btn btn-sm">―</button>

            <div className="divider divider-horizontal m-0"></div>

            <button onClick={setLink} className={btn(editor.isActive('link'))}>Link</button>
            <button onClick={() => onBrowseMedia('upload')} className="btn btn-sm">Upload Img</button>
            <button onClick={() => onBrowseMedia('library')} className="btn btn-sm">Library</button>

            <div className="divider divider-horizontal m-0"></div>

            <button onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className="btn btn-sm" aria-disabled={!editor.can().undo()}>Undo</button>
            <button onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className="btn btn-sm" aria-disabled={!editor.can().redo()}>Redo</button>
        </div>
    );
}