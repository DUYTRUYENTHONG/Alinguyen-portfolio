type ConversationScroll = {
  scrollTop: number;
  scrollHeight: number;
  viewportTop: number;
  viewportHeight: number;
  targetTop: number;
  targetHeight: number;
};

// Read long replies from their beginning; keep short bubbles completely visible.
// All rectangles use viewport coordinates so visual-viewport panning cancels out.
export function conversationScrollTop(box: ConversationScroll) {
  const padding = box.viewportHeight < 100 ? 4 : 12;
  const movement = box.targetHeight > box.viewportHeight - padding * 2
    ? box.targetTop - box.viewportTop - padding
    : box.targetTop + box.targetHeight - box.viewportTop - box.viewportHeight + padding;
  return Math.max(0, Math.min(box.scrollHeight - box.viewportHeight, box.scrollTop + movement));
}
