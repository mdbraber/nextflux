import test from "node:test";
import assert from "node:assert/strict";
import {
  fitToWidth,
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

test("narrow panes lay the page out at the minimum width and scale it down", () => {
  assert.deepEqual(fitToWidth(900, 800, 800), {
    width: 900,
    height: 800,
    scale: 1,
  });
  assert.deepEqual(fitToWidth(600, 900, 800), {
    width: 800,
    height: 1200,
    scale: 0.75,
  });
  assert.deepEqual(fitToWidth(600, 900, 0), {
    width: 600,
    height: 900,
    scale: 1,
  });
});
