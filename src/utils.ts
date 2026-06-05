export function resolvePhotoUrl(url: string): string {
  if (!url) return "";
  let clean = url.trim();
  if (clean.startsWith("url(")) {
    const match = clean.match(/^url\(['"]?([^'"]+)['"]?\)(.*)$/);
    if (match) {
      clean = match[1] + (match[2] || "");
    }
  }
  
  // Jika path mengandung 'images/', ubah menjadi path relatif 'images/...'
  // sehingga otomatis memanggil https://nugrahagiangn.my.id/wedding/images/... di server live
  // dan http://localhost:3000/images/... di server dev lokal (tanpa perantara folder lain / double wedding)
  const imagesIdx = clean.indexOf("images/");
  if (imagesIdx !== -1) {
    return clean.substring(imagesIdx);
  }
  
  return getApiUrl(clean);
}

export function copyToClipboard(text: string, onSuccess: () => void): void {
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text)
      .then(onSuccess)
      .catch(() => fallbackCopyToClipboard(text, onSuccess));
  } else {
    fallbackCopyToClipboard(text, onSuccess);
  }
}

function fallbackCopyToClipboard(text: string, onSuccess: () => void): void {
  const textArea = document.createElement("textarea");
  textArea.value = text;
  // Ensure the textarea is off-screen and does not cause scrolling jump on mobile iOS
  textArea.style.position = "fixed";
  textArea.style.top = "-9999px";
  textArea.style.left = "-9999px";
  textArea.style.width = "2em";
  textArea.style.height = "2em";
  textArea.style.padding = "0";
  textArea.style.border = "none";
  textArea.style.outline = "none";
  textArea.style.boxShadow = "none";
  textArea.style.background = "transparent";
  
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  // High compatibility setSelectionRange for mobile browsers
  try {
    textArea.setSelectionRange(0, 99999);
  } catch (e) {}

  try {
    const successful = document.execCommand("copy");
    if (successful) {
      onSuccess();
    }
  } catch (err) {
    console.warn("Clipboard copy fallback failed", err);
  }
  document.body.removeChild(textArea);
}

/**
 * Resolves full API URL with backend base URL support (VITE_API_URL).
 * Fallbacks to relative fetch if VITE_API_URL is omitted or is a local path.
 */
export function getApiUrl(pathStr: string): string {
  const baseUrl = import.meta.env.VITE_API_URL || "";
  const cleanPath = pathStr.startsWith("/") ? pathStr : `/${pathStr}`;
  if (baseUrl) {
    // If the path already has the base URL prefix, don't prepend it again
    if (cleanPath.startsWith(baseUrl)) {
      return cleanPath;
    }
    // If baseUrl ends with '/' and cleanPath starts with '/', avoid double slashes
    if (baseUrl.endsWith("/") && cleanPath.startsWith("/")) {
      return `${baseUrl}${cleanPath.substring(1)}`;
    }
    return `${baseUrl}${cleanPath}`;
  }
  return cleanPath;
}

