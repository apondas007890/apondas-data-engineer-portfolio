"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Heading from "@tiptap/extension-heading";
import HardBreak from "@tiptap/extension-hard-break";
import Gapcursor from "@tiptap/extension-gapcursor";
import { ChevronDown, Eraser, Indent, Link2, List, ListOrdered, Outdent } from "lucide-react";
import { cn } from "@/lib/utils";

type HeadingValue = "paragraph" | "1" | "2" | "3";

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    fontSize: {
      setFontSize: (size: string) => ReturnType;
      unsetFontSize: () => ReturnType;
    };
  }
}

const FontSize = TextStyle.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      fontSize: {
        default: null,
        parseHTML: (element) => element.style.fontSize || null,
        renderHTML: (attributes) => {
          if (!attributes.fontSize) return {};
          return { style: `font-size: ${attributes.fontSize}` };
        },
      },
    };
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain }) =>
          chain().setMark("textStyle", { fontSize }).run(),
      unsetFontSize:
        () =>
        ({ chain }) =>
          chain().setMark("textStyle", { fontSize: null }).removeEmptyTextStyle().run(),
    };
  },
});

const COLOR_OPTIONS = ["#f5f5f5", "#00eeff", "#d6be73", "#ff6b6b", "#7dd3fc", "#8af5b2"];
const FONT_SIZE_OPTIONS = ["14px", "16px", "18px", "20px", "24px", "30px"];

function ToolbarButton({
  active,
  onClick,
  children,
  title,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className={cn(
        "inline-flex h-9 min-w-9 items-center justify-center rounded-xl border border-transparent px-2 text-[13px] text-[rgba(245,245,245,0.55)] transition-all",
        "hover:bg-[rgba(214,190,115,0.08)] hover:text-[#f5f5f5]",
        active && "bg-[rgba(0,238,255,0.08)] text-[#00eeff]"
      )}
    >
      {children}
    </button>
  );
}

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        bulletList: false,
        orderedList: false,
        listItem: false,
        heading: false,
        hardBreak: false,
      }),
      Heading.configure({ levels: [1, 2, 3] }),
      Underline,
      Link.configure({
        openOnClick: false,
        autolink: true,
        defaultProtocol: "https",
      }),
      TextStyle,
      FontSize,
      Color,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      BulletList.configure({ keepMarks: true, keepAttributes: true }),
      OrderedList.configure({ keepMarks: true, keepAttributes: true }),
      ListItem,
      HardBreak,
      Gapcursor,
    ],
    content: value || "",
    onUpdate: ({ editor: currentEditor }) => {
      onChange(currentEditor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "rich-text-content min-h-[220px] px-4 py-4 text-[15px] leading-7 text-[#f5f5f5] focus:outline-none",
      },
      handleKeyDown(_view, event) {
        if (!editor) return false;

        if (event.key === "Tab") {
          if (editor.isActive("listItem")) {
            event.preventDefault();
            if (event.shiftKey) {
              return editor.chain().focus().liftListItem("listItem").run();
            }
            return editor.chain().focus().sinkListItem("listItem").run();
          }

          if (event.shiftKey) return false;
          return false;
        }

        return false;
      },
    },
  });

  useEffect(() => {
    if (!editor) return;
    const currentHtml = editor.getHTML();
    if (value !== currentHtml) {
      editor.commands.setContent(value || "", { emitUpdate: false });
    }
  }, [editor, value]);

  if (!editor) {
    return (
      <div className="overflow-hidden rounded-2xl border border-[#2d2d30] bg-[#0a0e0f]">
        <div className="h-[278px] animate-pulse bg-[rgba(255,255,255,0.02)]" />
      </div>
    );
  }

  const currentHeading = ((): HeadingValue => {
    if (editor.isActive("heading", { level: 1 })) return "1";
    if (editor.isActive("heading", { level: 2 })) return "2";
    if (editor.isActive("heading", { level: 3 })) return "3";
    return "paragraph";
  })();

  const currentFontSize = editor.getAttributes("textStyle").fontSize || "16px";
  const currentColor = editor.getAttributes("textStyle").color || "#f5f5f5";

  return (
    <div className="overflow-hidden rounded-2xl border border-[#2d2d30] bg-[#0a0e0f] text-white transition-colors focus-within:border-[#00eeff]/50">
      <div className="flex flex-wrap items-center gap-2 border-b border-[#2d2d30] bg-[rgba(255,255,255,0.02)] px-3 py-3">
        <div className="relative">
          <select
            value={currentHeading}
            onChange={(event) => {
              const next = event.target.value as HeadingValue;
              if (next === "paragraph") {
                editor.chain().focus().setParagraph().run();
              } else {
                editor.chain().focus().toggleHeading({ level: Number(next) as 1 | 2 | 3 }).run();
              }
            }}
            className="h-9 appearance-none rounded-xl border border-[#3c3c3c] bg-[#111517] px-3 pr-8 text-sm text-[#f5f5f5] outline-none transition-colors hover:border-[#d6be73]/40 focus:border-[#00eeff]/50"
          >
            <option value="paragraph">Normal</option>
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
            <option value="3">Heading 3</option>
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgba(245,245,245,0.55)]" />
        </div>

        <div className="relative">
          <select
            value={currentFontSize}
            onChange={(event) => editor.chain().focus().setFontSize(event.target.value).run()}
            className="h-9 appearance-none rounded-xl border border-[#3c3c3c] bg-[#111517] px-3 pr-8 text-sm text-[#f5f5f5] outline-none transition-colors hover:border-[#d6be73]/40 focus:border-[#00eeff]/50"
          >
            {FONT_SIZE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[rgba(245,245,245,0.55)]" />
        </div>

        <ToolbarButton title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
          <span className="font-bold">B</span>
        </ToolbarButton>
        <ToolbarButton title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
          <span className="italic">I</span>
        </ToolbarButton>
        <ToolbarButton title="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}>
          <span className="underline">U</span>
        </ToolbarButton>
        <ToolbarButton title="Strike" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}>
          <span className="line-through">S</span>
        </ToolbarButton>

        <div className="flex items-center gap-1 rounded-xl border border-[#3c3c3c] bg-[#111517] px-2 py-1">
          {COLOR_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              title={`Set color ${option}`}
              onClick={() => editor.chain().focus().setColor(option).run()}
              className={cn(
                "h-5 w-5 rounded-full border transition-transform hover:scale-105",
                currentColor === option ? "border-white/80" : "border-white/15"
              )}
              style={{ backgroundColor: option }}
            />
          ))}
        </div>

        <ToolbarButton
          title="Add link"
          active={editor.isActive("link")}
          onClick={() => {
            const previousUrl = editor.getAttributes("link").href as string | undefined;
            const url = window.prompt("Enter URL", previousUrl || "https://");
            if (url === null) return;
            if (!url.trim()) {
              editor.chain().focus().unsetLink().run();
              return;
            }
            editor.chain().focus().extendMarkRange("link").setLink({ href: url.trim() }).run();
          }}
        >
          <Link2 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarButton title="Ordered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Indent" onClick={() => editor.chain().focus().sinkListItem("listItem").run()}>
          <Indent className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Outdent" onClick={() => editor.chain().focus().liftListItem("listItem").run()}>
          <Outdent className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton title="Clear formatting" onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}>
          <Eraser className="h-4 w-4" />
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} />
      {!editor.getText().trim() && placeholder ? (
        <div className="pointer-events-none px-4 pb-3 text-sm text-[rgba(245,245,245,0.32)]">
          {placeholder}
        </div>
      ) : null}
    </div>
  );
}
