const HTML_TAG_RE = /<[^>]*>/g;
const HTML_ENTITY_RE = /&(?:nbsp|amp|lt|gt|quot|#39);/gi;

export function looksLikeHtml(value: string | null | undefined) {
  if (!value) return false;
  return /<\/?[a-z][\s\S]*>/i.test(value);
}

export function decodeBasicEntities(value: string) {
  return value
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
}

export function stripHtml(value: string | null | undefined) {
  if (!value) return "";
  return decodeBasicEntities(
    value
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|li|h[1-6])>/gi, "\n")
      .replace(HTML_TAG_RE, "")
      .replace(HTML_ENTITY_RE, (entity) => decodeBasicEntities(entity))
  );
}

export function isRichTextBlank(value: string | null | undefined) {
  return stripHtml(value).replace(/\s+/g, "").length === 0;
}

export function plainTextToHtml(value: string | null | undefined) {
  if (!value) return "";

  const normalized = decodeBasicEntities(value).replace(/\r\n/g, "\n");
  if (!normalized) return "";

  return normalized
    .split("\n")
    .map((paragraph) => {
      if (paragraph.length === 0) return "<p><br /></p>";
      return `<p>${paragraph}</p>`;
    })
    .join("");
}

export function normalizeRichTextHtml(value: string | null | undefined) {
  if (!value) return "";
  if (looksLikeHtml(value)) return value;
  return plainTextToHtml(value);
}
