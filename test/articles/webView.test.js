import test from "node:test";
import assert from "node:assert/strict";
import {
  isWebView,
  webViewUrl,
  withWebViewId,
} from "../../src/domain/articles/webView.js";

const article = { id: 7, feedId: 3, url: "https://example.com/issue" };

test("only http(s) pages can be shown in web view", () => {
  assert.equal(webViewUrl(article), "https://example.com/issue");
  assert.equal(webViewUrl({ url: "javascript:alert(1)" }), null);
  assert.equal(webViewUrl({ url: "" }), null);
  assert.equal(webViewUrl(null), null);
});

test("feeds and categories open in web view by default, a session choice wins", () => {
  const feed = { webViewFeeds: [3] };
  const category = { webViewCategories: [5], categoryId: 5 };
  assert.equal(isWebView(article, feed, {}), true);
  assert.equal(isWebView(article, category, {}), true);
  assert.equal(
    isWebView(article, { webViewCategories: [5], categoryId: 6 }, {}),
    false,
  );
  assert.equal(isWebView(article, {}, {}), false);
  assert.equal(isWebView(article, feed, { 7: false }), false);
  assert.equal(isWebView(article, {}, { 7: true }), true);
  assert.equal(isWebView({ ...article, url: "" }, feed, { 7: true }), false);
});

test("switching a feed or category on and off keeps the list unique", () => {
  assert.deepEqual(withWebViewId([1, 3], 3, true), [1, 3]);
  assert.deepEqual(withWebViewId([1], "3", true), [1, 3]);
  assert.deepEqual(withWebViewId([1, 3], 3, false), [1]);
  assert.deepEqual(withWebViewId(undefined, 0, true), []);
});
