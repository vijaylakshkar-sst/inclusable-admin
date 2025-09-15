'use client';

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { useCallback } from 'react';
import { FaBold, FaItalic, FaUnderline, FaListUl, FaListOl } from 'react-icons/fa';

interface TiptapProps {
    content?: string;
    onUpdate?: (content: string) => void;
}

const Tiptap: React.FC<TiptapProps> = ({ content = '', onUpdate }) => {
    const editor = useEditor({
        extensions: [StarterKit],
        content,
        immediatelyRender: false, // ✅ Prevent SSR issues
        onUpdate: ({ editor }) => {
            if (onUpdate) onUpdate(editor.getHTML());
        },
        editorProps: {
            attributes: {
                class: 'border p-2 rounded min-h-[200px] h-full', // h-full allows container to control height
            },
        },
    });

    const toggleBold = useCallback(() => editor?.chain().focus().toggleBold().run(), [editor]);
    const toggleItalic = useCallback(() => editor?.chain().focus().toggleItalic().run(), [editor]);
    const toggleUnderline = useCallback(() => editor?.chain().focus().toggleUnderline().run(), [editor]);
    const toggleBulletList = useCallback(() => editor?.chain().focus().toggleBulletList().run(), [editor]);
    const toggleOrderedList = useCallback(() => editor?.chain().focus().toggleOrderedList().run(), [editor]);

    if (!editor) return null; // Wait until editor is ready

    return (
        <div>
            {/* Toolbar */}
            <div className="flex gap-2 mb-2">
                <button type="button" onClick={toggleBold} className="p-2 border rounded hover:bg-gray-100">
                    <FaBold />
                </button>
                <button type="button" onClick={toggleItalic} className="p-2 border rounded hover:bg-gray-100">
                    <FaItalic />
                </button>
                <button type="button" onClick={toggleUnderline} className="p-2 border rounded hover:bg-gray-100">
                    <FaUnderline />
                </button>
                <button type="button" onClick={toggleBulletList} className="p-2 border rounded hover:bg-gray-100">
                    <FaListUl />
                </button>
                <button type="button" onClick={toggleOrderedList} className="p-2 border rounded hover:bg-gray-100">
                    <FaListOl />
                </button>
            </div>

            {/* Editor */}
            <EditorContent editor={editor} />
        </div>
    );
};

export default Tiptap;
