import { atom } from "nanostores";
import { settingsState, updateSettings } from "./settingsStore.js";
import { isWebView, withWebViewFeed } from "@/domain/articles/webView.js";

// Articles switched to or from web view in this session: { [articleId]: boolean }.
export const webViewOverrides = atom({});

export const toggleArticleWebView = (article) => {
  if (!article) return;
  const overrides = webViewOverrides.get();
  const current = isWebView(
    article,
    overrides,
    settingsState.get().webViewFeeds,
  );
  webViewOverrides.set({ ...overrides, [article.id]: !current });
};

export const setFeedWebView = (feedId, enabled) =>
  updateSettings({
    webViewFeeds: withWebViewFeed(
      settingsState.get().webViewFeeds,
      feedId,
      enabled,
    ),
  });
