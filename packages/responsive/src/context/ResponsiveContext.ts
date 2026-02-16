import type {Vector2} from '@efxlab/motion-canvas-core';
import type {
  RatioClass,
  RatioId,
  ResponsiveRatioConfig,
  ResponsiveRatiosConfig,
  ResponsiveState,
} from '../types';

const ResponsiveStack: ResponsiveState[] = [];

// Custom ratio registry
const CustomRatios: ResponsiveRatiosConfig = {};

// Default built-in ratios
const RATIO_16X9 = '16x9';
const RATIO_9X16 = '9x16';
const RATIO_4X3 = '4x3';
const RATIO_1X1 = '1x1';

const DefaultRatios: ResponsiveRatiosConfig = {
  [RATIO_16X9]: {aspect: '16:9'},
  [RATIO_9X16]: {aspect: '9:16'},
  [RATIO_4X3]: {aspect: '4:3'},
  [RATIO_1X1]: {aspect: '1:1'},
  fullwindow: {aspect: 'auto'},
};

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

/**
 * Register custom ratios for the responsive system.
 * This allows templates to define custom aspect ratios beyond the defaults.
 *
 * @param ratios - Object mapping ratio IDs to their configuration
 *
 * @example
 * ```typescript
 * registerCustomRatios({
 *   'cinema': { aspect: '21:9' },
 *   'story': { aspect: '9:18' },
 *   'portrait2': { aspect: '3:4' },
 * });
 * ```
 */
export function registerCustomRatios(ratios: ResponsiveRatiosConfig): void {
  Object.assign(CustomRatios, ratios);
}

/**
 * Get all registered custom ratios.
 */
export function getCustomRatios(): ResponsiveRatiosConfig {
  return {...CustomRatios};
}

/**
 * Get ratio configuration for a specific ratio ID.
 * Checks custom ratios first, then falls back to defaults.
 */
export function getRatioConfig(
  ratioId: string,
): ResponsiveRatioConfig | undefined {
  return CustomRatios[ratioId] ?? DefaultRatios[ratioId];
}

/**
 * Get all available ratio configurations (custom + default).
 */
export function getAllRatioConfigs(): ResponsiveRatiosConfig {
  return {...DefaultRatios, ...CustomRatios};
}

/**
 * Clear all custom ratios.
 */
export function clearCustomRatios(): void {
  Object.keys(CustomRatios).forEach(key => delete CustomRatios[key]);
}
