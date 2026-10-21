import test from "node:test";
import assert from "node:assert/strict";
import {
  isWebView,
  wantsWebView,
  webViewUrl,
} from "../../src/domain/articles/webView.js";

const article = { id: 7, url: "https://example.com/issue", tags: ["web-view"] };

test("only http(s) pages can be shown in web view", () => {
  assert.equal(webViewUrl(article), "https://example.com/issue");
  assert.equal(webViewUrl({ url: "javascript:alert(1)" }), null);
  assert.equal(webViewUrl({ url: "" }), null);
  assert.equal(webViewUrl(null), null);
});

test("a feed asks for web view with the web-view tag", () => {
  assert.equal(wantsWebView(article), true);
  assert.equal(wantsWebView({ tags: ["Web-View"] }), true);
  assert.equal(wantsWebView({ tags: ["news"] }), false);
  assert.equal(wantsWebView({}), false);
});

test("a session choice wins over the feed's request", () => {
  assert.equal(isWebView(article, {}), true);
  assert.equal(isWebView(article, { 7: false }), false);
  assert.equal(isWebView({ ...article, tags: [] }, {}), false);
  assert.equal(isWebView({ ...article, tags: [] }, { 7: true }), true);
  assert.equal(isWebView({ ...article, url: "" }, { 7: true }), false);
});
