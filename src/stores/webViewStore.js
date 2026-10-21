import { atom } from "nanostores";
import { settingsState, updateSettings } from "./settingsStore.js";
import { feeds } from "./feedsStore.js";
import { isWebView, withWebViewId } from "@/domain/articles/webView.js";

// Articles switched to or from web view in this session: { [articleId]: boolean }.
export const webViewOverrides = atom({});

/** The web view defaults that apply to an article (its feed and the feed's category). */
export const webViewPrefs = (
  article,
  settings = settingsState.get(),
  feedList = feeds.get(),
) => ({
  webViewFeeds: settings.webViewFeeds,
  webViewCategories: settings.webViewCategories,
  categoryId: feedList.find((feed) => feed.id === article?.feedId)?.categoryId,
});

export const toggleArticleWebView = (article) => {
  if (!article) return;
  const overrides = webViewOverrides.get();
  const current = isWebView(article, webViewPrefs(article), overrides);
  webViewOverrides.set({ ...overrides, [article.id]: !current });
};

export const setFeedWebView = (feedId, enabled) =>
  updateSettings({
    webViewFeeds: withWebViewId(
      settingsState.get().webViewFeeds,
      feedId,
      enabled,
    ),
  });

export const setCategoryWebView = (categoryId, enabled) =>
  updateSettings({
    webViewCategories: withWebViewId(
      settingsState.get().webViewCategories,
      categoryId,
      enabled,
    ),
  });
