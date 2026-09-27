'use client'

import React, { useEffect, useRef } from 'react'
import { useEditor, EditorContent, useEditorState, type Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Youtube from '@tiptap/extension-youtube'
import TextAlign from '@tiptap/extension-text-align'
import { TableKit } from '@tiptap/extension-table'
import { Placeholder } from '@tiptap/extensions'
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  Heading2,
  Heading3,
  ImagePlus,
  Italic,
  Link2,
  List,
  ListOrdered,
  Minus,
  Pilcrow,
  Quote,
  Redo2,
  Strikethrough,
  Table2,
  Underline,
  Undo2,
  Unlink,
  Video as VideoIcon,
} from 'lucide-react'

// Rich-text editor for blog posts (Tiptap, MIT). What you see while writing
// is styled like the published post (.post-body). Output is HTML.
//
// Images: the parent decides where a picked file goes. `onPickImage` returns
// a src to show now (a local preview URL); the parent swaps it for the final
// /blog-images/ path when it saves.
export function RichEditor({
  initialHtml,
  onChange,
  onPickImage,
}: {
  initialHtml: string
  onChange: (html: string) => void
  onPickImage: (file: File) => Promise<{ src: string; alt: string }>
}) {
  const fileInput = useRef<HTMLInputElement>(null)
  const editor = useEditor({
    immediatelyRender: false, // Next.js renders on the server first
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3, 4] },
        link: {
          openOnClick: false,
          autolink: true,
          defaultProtocol: 'https',
          // Your own links: no "nofollow", so search engines follow them.
          HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
        },
      }),
      Image.configure({ inline: false }),
      Youtube.configure({ nocookie: true, modestBranding: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TableKit.configure({ table: { resizable: false } }),
      Placeholder.configure({ placeholder: 'Start writing… Paste links, press Enter for a new paragraph.' }),
    ],
    content: initialHtml,
    editorProps: {
      attributes: {
        class: 'post-body rich-editor min-h-[24rem] focus:outline-none',
        'aria-label': 'Post text',
      },
    },
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
  })

  // Load a different post into the same editor.
  useEffect(() => {
    if (editor && initialHtml !== editor.getHTML()) editor.commands.setContent(initialHtml, { emitUpdate: false })
  }, [editor, initialHtml])

  const pickImage = async (file: File | undefined) => {
    if (!file || !editor) return
    const { src, alt } = await onPickImage(file)
    editor.chain().focus().setImage({ src, alt }).run()
    moveBelowInsertedBlock(editor)
  }

  return (
    <div className="rounded-xl border border-zinc-700 bg-[#0B1120] focus-within:border-amber-500/70">
      {editor && <Toolbar editor={editor} onImage={() => fileInput.current?.click()} />}
      <div className="px-4 sm:px-6 py-5">
        <EditorContent editor={editor} />
      </div>
      <input
        ref={fileInput}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={(e) => {
          pickImage(e.target.files?.[0])
          e.target.value = ''
        }}
      />
    </div>
  )
}

// After inserting an image or video the new block is selected, so the next
// insert would replace it. Put the cursor in a paragraph below it instead.
function moveBelowInsertedBlock(editor: Editor) {
  const { selection } = editor.state
  if ('node' in selection && selection.node) editor.chain().focus().createParagraphNear().run()
}

function Toolbar({ editor, onImage }: { editor: Editor; onImage: () => void }) {
  const s = useEditorState({
    editor,
    selector: ({ editor: e }) => ({
      bold: e.isActive('bold'),
      italic: e.isActive('italic'),
      underline: e.isActive('underline'),
      strike: e.isActive('strike'),
      h2: e.isActive('heading', { level: 2 }),
      h3: e.isActive('heading', { level: 3 }),
      paragraph: e.isActive('paragraph'),
      bullet: e.isActive('bulletList'),
      ordered: e.isActive('orderedList'),
      quote: e.isActive('blockquote'),
      code: e.isActive('codeBlock'),
      link: e.isActive('link'),
      left: e.isActive({ textAlign: 'left' }),
      center: e.isActive({ textAlign: 'center' }),
      right: e.isActive({ textAlign: 'right' }),
      canUndo: e.can().undo(),
      canRedo: e.can().redo(),
    }),
  })

  const setLink = () => {
    const previous = editor.getAttributes('link').href as string | undefined
    const url = window.prompt('Link address (https://…)', previous ?? 'https://')
    if (url === null) return
    if (url.trim() === '' || url.trim() === 'https://') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url.trim() }).run()
  }

  const addVideo = () => {
    const url = window.prompt('YouTube video link')
    if (!url) return
    if (!editor.chain().focus().setYoutubeVideo({ src: url.trim() }).run()) {
      window.alert('That does not look like a YouTube link.')
      return
    }
    moveBelowInsertedBlock(editor)
  }

  const c = () => editor.chain().focus() // a chain runs once; make a new one per click
  const groups: { label: string; icon: React.ReactNode; run: () => void; active?: boolean; disabled?: boolean }[][] = [
    [
      { label: 'Undo', icon: <Undo2 />, run: () => c().undo().run(), disabled: !s.canUndo },
      { label: 'Redo', icon: <Redo2 />, run: () => c().redo().run(), disabled: !s.canRedo },
    ],
    [
      { label: 'Paragraph', icon: <Pilcrow />, run: () => c().setParagraph().run(), active: s.paragraph },
      { label: 'Heading', icon: <Heading2 />, run: () => c().toggleHeading({ level: 2 }).run(), active: s.h2 },
      { label: 'Subheading', icon: <Heading3 />, run: () => c().toggleHeading({ level: 3 }).run(), active: s.h3 },
    ],
    [
      { label: 'Bold', icon: <Bold />, run: () => c().toggleBold().run(), active: s.bold },
      { label: 'Italic', icon: <Italic />, run: () => c().toggleItalic().run(), active: s.italic },
      { label: 'Underline', icon: <Underline />, run: () => c().toggleUnderline().run(), active: s.underline },
      { label: 'Strikethrough', icon: <Strikethrough />, run: () => c().toggleStrike().run(), active: s.strike },
    ],
    [
      { label: 'Add or edit link', icon: <Link2 />, run: setLink, active: s.link },
      { label: 'Remove link', icon: <Unlink />, run: () => c().unsetLink().run(), disabled: !s.link },
    ],
    [
      { label: 'Bulleted list', icon: <List />, run: () => c().toggleBulletList().run(), active: s.bullet },
      { label: 'Numbered list', icon: <ListOrdered />, run: () => c().toggleOrderedList().run(), active: s.ordered },
      { label: 'Quotation', icon: <Quote />, run: () => c().toggleBlockquote().run(), active: s.quote },
      { label: 'Code block', icon: <Code2 />, run: () => c().toggleCodeBlock().run(), active: s.code },
      { label: 'Divider', icon: <Minus />, run: () => c().setHorizontalRule().run() },
    ],
    [
      { label: 'Align left', icon: <AlignLeft />, run: () => c().setTextAlign('left').run(), active: s.left },
      { label: 'Center', icon: <AlignCenter />, run: () => c().setTextAlign('center').run(), active: s.center },
      { label: 'Align right', icon: <AlignRight />, run: () => c().setTextAlign('right').run(), active: s.right },
    ],
    [
      { label: 'Insert image', icon: <ImagePlus />, run: onImage },
      { label: 'Embed YouTube video', icon: <VideoIcon />, run: addVideo },
      { label: 'Insert table', icon: <Table2 />, run: () => c().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run() },
    ],
  ]

  return (
    <div
      role="toolbar"
      aria-label="Formatting"
      className="sticky top-0 z-10 flex flex-wrap items-center gap-1 px-2 py-1.5 border-b border-zinc-800 bg-[#0E1526]/95 backdrop-blur rounded-t-xl"
    >
      {groups.map((group, i) => (
        <div key={i} className="flex items-center gap-0.5 pr-1 mr-1 border-r border-zinc-800 last:border-r-0">
          {group.map((b) => (
            <button
              key={b.label}
              type="button"
              title={b.label}
              aria-label={b.label}
              aria-pressed={b.active}
              disabled={b.disabled}
              onMouseDown={(e) => e.preventDefault()} // keep the text selection
              onClick={b.run}
              className={`h-9 w-9 inline-flex items-center justify-center rounded-md [&_svg]:h-4 [&_svg]:w-4 transition-colors disabled:opacity-30 ${
                b.active ? 'bg-amber-500/20 text-amber-300' : 'text-zinc-300 hover:bg-zinc-800 hover:text-zinc-50'
              }`}
            >
              {b.icon}
            </button>
          ))}
        </div>
      ))}
    </div>
  )
}
