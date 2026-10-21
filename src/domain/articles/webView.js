// Web view: show an article as its own web page (in a frame) instead of the
// feed content. Feeds can open in web view by default; any article can be
// switched either way for the current session.

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

/** Whether the article shows in web view: a session choice wins over the feed default. */
export function isWebView(article, webViewFeeds, overrides) {
  if (!webViewUrl(article)) return false;
  if (overrides && Object.hasOwn(overrides, article.id)) {
    return overrides[article.id];
  }
  return Array.isArray(webViewFeeds) && webViewFeeds.includes(article.feedId);
}

/** webViewFeeds with feedId switched on or off. */
export function withWebViewFeed(webViewFeeds, feedId, enabled) {
  const id = Number(feedId);
  const rest = (webViewFeeds || []).filter((item) => item !== id);
  return enabled && Number.isInteger(id) && id > 0 ? [...rest, id] : rest;
}
