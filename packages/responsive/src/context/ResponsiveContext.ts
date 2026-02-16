import type {Vector2} from '@efxlab/motion-canvas-core';
import type {RatioClass, RatioId, ResponsiveState} from '../types';

const ResponsiveStack: ResponsiveState[] = [];

// eslint-disable-next-line @typescript-eslint/naming-convention
let globalResponsiveState: ResponsiveState = {
  ratio: '16x9',
  ratioClass: 'landscape',
  width: 1920,
  height: 1080,
};

export function startResponsive(state: ResponsiveState) {
  ResponsiveStack.push(state);
}

export function endResponsive(state: ResponsiveState) {
  if (ResponsiveStack.pop() !== state) {
    throw new Error('startResponsive/endResponsive called out of order.');
  }
}

export function useResponsiveContext(): ResponsiveState {
  const state = ResponsiveStack.at(-1);
  if (!state) {
    return globalResponsiveState;
  }
  return state;
}

export function getResponsiveState(): ResponsiveState | undefined {
  return ResponsiveStack.at(-1) ?? globalResponsiveState;
}

export function setGlobalRatio(ratio: RatioId, width: number, height: number) {
  const aspectRatio = width / height;
  const ratioClass = detectRatioClass(aspectRatio);
  globalResponsiveState = {ratio, ratioClass, width, height};
}

export function getGlobalRatio(): ResponsiveState {
  return globalResponsiveState;
}

export function initResponsiveFromSize(size: Vector2, ratio: RatioId = '16x9') {
  setGlobalRatio(ratio, size.x, size.y);
}

export function detectRatioClass(aspectRatio: number): RatioClass {
  if (aspectRatio > 2) {
    return 'ultrawide';
  }
  if (aspectRatio > 1) {
    return 'landscape';
  }
  if (aspectRatio === 1) {
    return 'square';
  }
  return 'portrait';
}

export function parseRatioString(ratio: string): number {
  const [w, h] = ratio.split(':').map(Number);
  if (w && h) {
    return w / h;
  }
  const parts = ratio.split('x').map(Number);
  if (parts.length === 2 && parts[0] && parts[1]) {
    return parts[0] / parts[1];
  }
  return 16 / 9;
}
