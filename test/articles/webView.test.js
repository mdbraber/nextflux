import test from "node:test";
import assert from "node:assert/strict";
import {
  isWebView,
  webViewUrl,
  withWebViewFeed,
} from "../../src/domain/articles/webView.js";

const article = { id: 7, feedId: 3, url: "https://example.com/issue" };

test("only http(s) pages can be shown in web view", () => {
  assert.equal(webViewUrl(article), "https://example.com/issue");
  assert.equal(webViewUrl({ url: "javascript:alert(1)" }), null);
  assert.equal(webViewUrl({ url: "" }), null);
  assert.equal(webViewUrl(null), null);
});

test("feeds open in web view by default, a session choice wins", () => {
  assert.equal(isWebView(article, [3], {}), true);
  assert.equal(isWebView(article, [], {}), false);
  assert.equal(isWebView(article, [3], { 7: false }), false);
  assert.equal(isWebView(article, [], { 7: true }), true);
  assert.equal(isWebView({ ...article, url: "" }, [3], { 7: true }), false);
});

test("switching a feed on and off keeps the list unique", () => {
  assert.deepEqual(withWebViewFeed([1, 3], 3, true), [1, 3]);
  assert.deepEqual(withWebViewFeed([1], "3", true), [1, 3]);
  assert.deepEqual(withWebViewFeed([1, 3], 3, false), [1]);
  assert.deepEqual(withWebViewFeed(undefined, 0, true), []);
});
