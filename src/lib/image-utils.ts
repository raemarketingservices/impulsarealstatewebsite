/**
 * Converts a Google Drive share link to a direct image URL.
 * Supports formats:
 * - https://drive.google.com/file/d/FILE_ID/view?usp=sharing
 * - https://drive.google.com/open?id=FILE_ID
 * - https://drive.google.com/uc?export=view&id=FILE_ID
 * - https://lh3.googleusercontent.com/d/FILE_ID
 *
 * Also passes through regular image URLs (unsplash, imgur, etc.) unchanged.
 */
export function convertImageUrl(url: string): string {
  if (!url) return ''

  const trimmed = url.trim()

  // Google Drive: /file/d/FILE_ID/view
  let match = trimmed.match(/drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/)
  if (match) {
    return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`
  }

  // Google Drive: open?id=FILE_ID
  match = trimmed.match(/drive\.google\.com\/open\?id=([a-zA-Z0-9_-]+)/)
  if (match) {
    return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`
  }

  // Google Drive: uc?export=view&id=FILE_ID
  match = trimmed.match(/drive\.google\.com\/uc\?[^]*id=([a-zA-Z0-9_-]+)/)
  if (match) {
    return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`
  }

  // Google Drive: lh3.googleusercontent.com/d/FILE_ID
  match = trimmed.match(/lh3?\.googleusercontent\.com\/d\/([a-zA-Z0-9_-]+)/)
  if (match) {
    return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`
  }

  // Regular URL — return as-is
  return trimmed
}
