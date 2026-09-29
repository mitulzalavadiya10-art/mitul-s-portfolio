import { useRef, useEffect, useState } from "react"
import {
  Bold, Italic, Underline, List, ListOrdered, 
  Heading1, Heading2, Heading3, Link as LinkIcon,
  Code, Quote, Strikethrough, Undo, Redo, Type
} from "lucide-react"

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  minHeight?: string
}

export function RichTextEditor({ 
  value, 
  onChange, 
  placeholder = "Start writing your article content...",
  minHeight = "450px"
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [isFocused, setIsFocused] = useState(false)
  const [selection, setSelection] = useState<Range | null>(null)

  // Initialize editor content safely
  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || ""
    }
  }, [value])

  // Handle content changes
  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML
      onChange(html)
    }
  }

  // Save selection before toolbar action
  const saveSelection = () => {
    const sel = window.getSelection()
    if (sel && sel.rangeCount > 0) {
      setSelection(sel.getRangeAt(0))
    }
  }

  // Restore selection after toolbar action
  const restoreSelection = () => {
    if (selection) {
      const sel = window.getSelection()
      sel?.removeAllRanges()
      sel?.addRange(selection)
    }
  }

  // Execute text formatting command
  const execCommand = (command: string, val?: string) => {
    restoreSelection()
    document.execCommand(command, false, val)
    editorRef.current?.focus()
    handleInput()
  }

  // Insert hyperLink
  const insertLink = () => {
    const url = prompt("Enter Target URL (e.g. https://klenzo.app):")
    if (url) {
      execCommand("createLink", url)
    }
  }

  // Check command active state
  const isActive = (command: string, val?: string) => {
    try {
      if (val) {
        return document.queryCommandValue(command) === val
      }
      return document.queryCommandState(command)
    } catch {
      return false
    }
  }

  const toolbarButtons = [
    { icon: Undo, command: "undo", title: "Undo" },
    { icon: Redo, command: "redo", title: "Redo" },
    { type: "separator" },
    { icon: Bold, command: "bold", title: "Bold" },
    { icon: Italic, command: "italic", title: "Italic" },
    { icon: Underline, command: "underline", title: "Underline" },
    { icon: Strikethrough, command: "strikeThrough", title: "Strikethrough" },
    { type: "separator" },
    { icon: Heading1, command: "formatBlock", value: "h1", title: "Heading 1" },
    { icon: Heading2, command: "formatBlock", value: "h2", title: "Heading 2" },
    { icon: Heading3, command: "formatBlock", value: "h3", title: "Heading 3" },
    { icon: Type, command: "formatBlock", value: "p", title: "Paragraph" },
    { type: "separator" },
    { icon: List, command: "insertUnorderedList", title: "Bullet List" },
    { icon: ListOrdered, command: "insertOrderedList", title: "Numbered List" },
    { type: "separator" },
    { icon: Quote, command: "formatBlock", value: "blockquote", title: "Quote" },
    { icon: Code, command: "formatBlock", value: "pre", title: "Code Block" },
    { type: "separator" },
    { icon: LinkIcon, command: "link", title: "Insert Link" },
  ]

  return (
    <div className="flex flex-col gap-2">
      {/* Toolbar */}
      <div 
        className="flex items-center gap-1 flex-wrap bg-zinc-950/90 border border-zinc-800 rounded-2xl p-2 backdrop-blur-md sticky top-0 z-20 shadow-md"
        onMouseDown={saveSelection}
      >
        {toolbarButtons.map((btn, idx) => {
          if (btn.type === "separator") {
            return <div key={`sep-${idx}`} className="w-px h-5 bg-zinc-800/80 mx-1" />
          }

          const Icon = btn.icon
          const active = isActive(btn.command, btn.value)

          return (
            <button
              key={btn.title}
              type="button"
              onClick={() => {
                if (btn.command === "link") {
                  insertLink()
                } else {
                  execCommand(btn.command, btn.value)
                }
              }}
              onMouseDown={(e) => e.preventDefault()}
              title={btn.title}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                active 
                  ? "bg-white text-black shadow-sm font-bold scale-105" 
                  : "text-zinc-400 hover:text-white hover:bg-zinc-800/80"
              }`}
            >
              <Icon className="w-4 h-4" />
            </button>
          )
        })}
      </div>

      {/* Editor Content Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        onMouseUp={saveSelection}
        onKeyUp={saveSelection}
        className={`w-full bg-zinc-950 border rounded-2xl p-5 text-sm text-zinc-200 outline-none transition-all overflow-y-auto prose prose-invert prose-sm max-w-none shadow-inner leading-relaxed ${
          isFocused ? "border-zinc-500 ring-1 ring-zinc-500/20" : "border-zinc-800"
        }`}
        style={{ minHeight }}
        data-placeholder={placeholder}
      />

      {/* Footer stats */}
      <div className="flex items-center justify-between text-zinc-500 text-[11px] px-1 font-semibold">
        <span>Rich Text Editor</span>
        <span>{editorRef.current?.innerText?.length || 0} characters</span>
      </div>

      {/* Custom Scoped CSS Styles for Rich Editor Content */}
      <style>{`
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: rgb(113 113 122); /* zinc-500 */
          pointer-events: none;
        }

        [contenteditable] h1 {
          font-size: 2.2em;
          font-weight: 900;
          letter-spacing: -0.03em;
          line-height: 1.2;
          margin-top: 1.2em;
          margin-bottom: 0.6em;
          color: #ffffff;
        }

        [contenteditable] h2 {
          font-size: 1.6em;
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.3;
          margin-top: 1.1em;
          margin-bottom: 0.5em;
          color: #ffffff;
        }

        [contenteditable] h3 {
          font-size: 1.3em;
          font-weight: 700;
          line-height: 1.4;
          margin-top: 1em;
          margin-bottom: 0.4em;
          color: #f4f4f5;
        }

        [contenteditable] p {
          margin-bottom: 1.2em;
          line-height: 1.8;
          color: #d4d4d8;
        }

        [contenteditable] ul, [contenteditable] ol {
          margin-left: 1.6em;
          margin-bottom: 1.2em;
        }

        [contenteditable] li {
          margin-bottom: 0.4em;
          line-height: 1.7;
        }

        [contenteditable] blockquote {
          border-left: 3px solid #71717a;
          padding-left: 1.2em;
          margin-left: 0;
          margin-bottom: 1.2em;
          font-style: italic;
          color: #a1a1aa;
        }

        [contenteditable] pre {
          background: #09090b;
          border: 1px solid #27272a;
          border-radius: 0.75rem;
          padding: 1em 1.2em;
          margin-bottom: 1.2em;
          overflow-x: auto;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 0.88em;
          line-height: 1.6;
          color: #e4e4e7;
        }

        [contenteditable] code {
          background: #27272a;
          padding: 0.2em 0.4em;
          border-radius: 0.35em;
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
          font-size: 0.88em;
          color: #f4f4f5;
        }

        [contenteditable] a {
          color: #60a5fa;
          text-decoration: underline;
          text-underline-offset: 3px;
        }

        [contenteditable] a:hover {
          color: #93c5fd;
        }

        [contenteditable] strong, [contenteditable] b {
          font-weight: 800;
          color: #ffffff;
        }

        [contenteditable] em, [contenteditable] i {
          font-style: italic;
        }

        [contenteditable]:focus {
          outline: none;
        }
      `}</style>
    </div>
  )
}
