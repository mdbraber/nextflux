// Web view: show an article as its own web page (in a frame) instead of the
// feed content. A feed asks for it by tagging its entries "web-view" (an Atom
// category / RSS category, which Miniflux keeps as entry tags), or it is turned
// on for the feed in the feed dialog. Any article can be switched either way
// for the current session.

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

/**
 * Whether the article shows in web view: a session choice wins over the
 * defaults (the feed's web-view tag, or web view turned on for the feed).
 */
export function isWebView(article, overrides, webViewFeeds) {
  if (!webViewUrl(article)) return false;
  if (overrides && Object.hasOwn(overrides, article.id)) {
    return overrides[article.id];
  }
  return (
    wantsWebView(article) ||
    (Array.isArray(webViewFeeds) && webViewFeeds.includes(article.feedId))
  );
}

/** webViewFeeds with feedId switched on or off. */
export function withWebViewFeed(webViewFeeds, feedId, enabled) {
  const id = Number(feedId);
  const rest = (webViewFeeds || []).filter((item) => item !== id);
  return enabled && Number.isInteger(id) && id > 0 ? [...rest, id] : rest;
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
