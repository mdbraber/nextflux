// Web view: show an article as its own web page (in a frame) instead of the
// feed content. Feeds and categories can open in web view by default; any
// article can be switched either way for the current session.

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

/**
 * Whether the article shows in web view: a session choice wins over the
 * defaults, which are on when its feed or its feed's category is listed.
 */
export function isWebView(
  article,
  { webViewFeeds, webViewCategories, categoryId } = {},
  overrides,
) {
  if (!webViewUrl(article)) return false;
  if (overrides && Object.hasOwn(overrides, article.id)) {
    return overrides[article.id];
  }
  return (
    (Array.isArray(webViewFeeds) && webViewFeeds.includes(article.feedId)) ||
    (Array.isArray(webViewCategories) &&
      categoryId != null &&
      webViewCategories.includes(Number(categoryId)))
  );
}

/** A list of feed or category ids with id switched on or off. */
export function withWebViewId(ids, id, enabled) {
  const value = Number(id);
  const rest = (ids || []).filter((item) => item !== value);
  return enabled && Number.isInteger(value) && value > 0
    ? [...rest, value]
    : rest;
}
