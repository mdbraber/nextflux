// Web view: show an article as its own web page (in a frame) instead of the
// feed content. A feed asks for it by tagging its entries "web-view" (an Atom
// category / RSS category, which Miniflux keeps as entry tags), so the choice
// lives with the feed and holds on every device. Any article can be switched
// either way for the current session.

export const WEB_VIEW_TAG = "web-view";

/** The article's page URL, if it is one a frame can show. */
export function webViewUrl(article) {
  if (!article?.url) return null;
  try {
    const url = new URL(article.url);
    return url.protocol === "https:" || url.protocol === "http:"
      ? url.href
      : null;
  } catch {
    return null;
  }
}

/** Whether the feed asked for web view for this article. */
export function wantsWebView(article) {
  return (
    Array.isArray(article?.tags) &&
    article.tags.some((tag) => String(tag).toLowerCase() === WEB_VIEW_TAG)
  );
}

/** Whether the article shows in web view: a session choice wins over the feed's request. */
export function isWebView(article, overrides) {
  if (!webViewUrl(article)) return false;
  if (overrides && Object.hasOwn(overrides, article.id)) {
    return overrides[article.id];
  }
  return wantsWebView(article);
}

/**
 * How to show a page in a box of width × height so it is laid out at least
 * minWidth wide: the frame size before scaling and the scale that fits it.
 */
export function fitToWidth(width, height, minWidth) {
  if (!minWidth || !width || width >= minWidth) {
    return { width, height, scale: 1 };
  }
  const scale = width / minWidth;
  return { width: minWidth, height: Math.ceil(height / scale), scale };
}
