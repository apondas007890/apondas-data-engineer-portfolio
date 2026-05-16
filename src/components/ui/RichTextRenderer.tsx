"use client";

import DOMPurify from "isomorphic-dompurify";
import { cn } from "@/lib/utils";
import { normalizeRichTextHtml } from "@/src/lib/rich-text";

interface RichTextRendererProps {
  html?: string | null;
  content?: string | null;
  className?: string;
}

const SANITIZE_OPTIONS = {
  USE_PROFILES: { html: true },
  ALLOWED_TAGS: [
    "a",
    "b",
    "blockquote",
    "br",
    "code",
    "div",
    "em",
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    "i",
    "li",
    "ol",
    "p",
    "s",
    "span",
    "strong",
    "sub",
    "sup",
    "u",
    "ul",
  ],
  ALLOWED_ATTR: ["href", "target", "rel", "style", "class"],
  ALLOW_DATA_ATTR: false,
};

export function RichTextRenderer({ html, content, className }: RichTextRendererProps) {
  const normalized = normalizeRichTextHtml(html ?? content);
  const safeHtml = normalized
    ? DOMPurify.sanitize(normalized, SANITIZE_OPTIONS)
    : "<p>NULL</p>";

  return (
    <div
      className={cn("rich-text-content", className)}
      dangerouslySetInnerHTML={{ __html: safeHtml }}
    />
  );
}

export default RichTextRenderer;
