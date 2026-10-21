import { atom } from "nanostores";
import { isWebView } from "@/domain/articles/webView.js";

// Articles switched to or from web view in this session: { [articleId]: boolean }.
export const webViewOverrides = atom({});

export const toggleArticleWebView = (article) => {
  if (!article) return;
  const overrides = webViewOverrides.get();
  webViewOverrides.set({
    ...overrides,
    [article.id]: !isWebView(article, overrides),
  });
};
