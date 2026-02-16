import {
  detectRatioClass,
  useResponsiveContext,
} from '../context/ResponsiveContext';
import type {RatioClass, RatioId} from '../types';

export interface ResponsiveLayout {
  ratio: RatioId;
  ratioClass: RatioClass;
  width: number;
  height: number;
  w: number;
  h: number;
  hw: number;
  hh: number;
  ar: number;
  isPortrait: boolean;
  isLandscape: boolean;
  isSquare: boolean;
  isUltrawide: boolean;
  px: (frac: number) => number;
  py: (frac: number) => number;
  sz: (base: number) => number;
  sx: (frac: number) => number;
  sy: (frac: number) => number;
  pad: (frac: number) => number;
  topPad: (basePadding: number) => number;
  bottomPad: (basePadding: number) => number;
  leftPad: (basePadding: number) => number;
  rightPad: (basePadding: number) => number;
}

export function createResponsiveLayout(
  width: number,
  height: number,
  ratio: RatioId = '16x9',
): ResponsiveLayout {
  const aspectRatio = width / height;
  const ratioClass = detectRatioClass(aspectRatio);
  const scale = Math.min(width, height) / 1080;

  return {
    ratio,
    ratioClass,
    width,
    height,
    w: width,
    h: height,
    hw: width / 2,
    hh: height / 2,
    ar: aspectRatio,
    isPortrait: ratioClass === 'portrait',
    isLandscape: ratioClass === 'landscape',
    isSquare: ratioClass === 'square',
    isUltrawide: ratioClass === 'ultrawide',
    px: (frac: number) => frac * width,
    py: (frac: number) => frac * height,
    sz: (base: number) => base * scale,
    sx: (frac: number) => frac * width,
    sy: (frac: number) => frac * height,
    pad: (frac: number) => frac * Math.min(width, height),
    topPad: (basePadding: number) => -(height / 2) + basePadding * scale,
    bottomPad: (basePadding: number) => height / 2 - basePadding * scale,
    leftPad: (basePadding: number) => -(width / 2) + basePadding * scale,
    rightPad: (basePadding: number) => width / 2 - basePadding * scale,
  };
}

export function useRatio(): ResponsiveLayout {
  const state = useResponsiveContext();
  return createResponsiveLayout(state.width, state.height, state.ratio);
}

/**
 * Create a responsive layout from width and height values.
 * This is a standalone version that doesn't require the responsive context,
 * useful for creating layouts from raw values.
 *
 * @param width - The width of the view
 * @param height - The height of the view
 * @param ratio - Optional ratio ID (default: '16x9')
 */
export function viewLayout(
  width: number,
  height: number,
  ratio: RatioId = '16x9',
): ResponsiveLayout {
  return createResponsiveLayout(width, height, ratio);
}
