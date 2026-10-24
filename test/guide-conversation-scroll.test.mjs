import test from "node:test";
import assert from "node:assert/strict";
import { conversationScrollTop } from "../src/app/guide-conversation-scroll.ts";

test("keeps the reply visible instead of jumping to preferences below it", () => {
  assert.equal(conversationScrollTop({ scrollTop: 200, scrollHeight: 1200,
    viewportTop: 100, viewportHeight: 300, targetTop: 500, targetHeight: 100 }), 412);
});

test("shows the beginning of a long reply in keyboard-height landscape", () => {
  assert.equal(conversationScrollTop({ scrollTop: 116, scrollHeight: 906,
    viewportTop: 71, viewportHeight: 55, targetTop: 508, targetHeight: 280 }), 549);
});

test("visual viewport panning does not change the conversation position", () => {
  const box = { scrollTop: 200, scrollHeight: 1200, viewportTop: 100,
    viewportHeight: 300, targetTop: 500, targetHeight: 100 };
  assert.equal(conversationScrollTop(box), conversationScrollTop({ ...box,
    viewportTop: box.viewportTop + 180, targetTop: box.targetTop + 180 }));
});

test("short greeting cannot produce a negative scroll position", () => {
  assert.equal(conversationScrollTop({ scrollTop: 0, scrollHeight: 300,
    viewportTop: 100, viewportHeight: 300, targetTop: 120, targetHeight: 100 }), 0);
});

test("clamps a final reply to the actual scrollable range", () => {
  assert.equal(conversationScrollTop({ scrollTop: 700, scrollHeight: 1000,
    viewportTop: 100, viewportHeight: 200, targetTop: 300, targetHeight: 100 }), 800);
});
