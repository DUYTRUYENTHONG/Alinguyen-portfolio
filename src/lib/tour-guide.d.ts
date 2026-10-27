export interface TourGuide {
  open(content: { title?: string; text: string; actions?: { label: string; onClick: (guide: TourGuide) => void }[] }): void;
  close(): void;
  walkToElement(selector: string, gesture?: string): boolean;
  moveActorToDOMElement(selector: string, gesture?: string): boolean;
  getDOMCoords(selector: string): { element: Element; rect: DOMRect; center: { x: number; y: number }; ndc: { x: number; y: number } } | null;
  setSuspended(suspended: boolean): void;
  destroy(): void;
  playGesture(name: string): void;
}
export function createTourGuide(options?: {
  modelUrl?: string; name?: string; height?: number; pixelRatio?: number;
  walkStride?: number; sprintStride?: number; signal?: AbortSignal;
  onAsk?: (trigger: HTMLButtonElement) => void;
  onError?: (error: Error) => void;
}): Promise<TourGuide>;
export function registerTourGuide(tagName?: string): void;
