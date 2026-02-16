import type {Vector2} from '@efxlab/motion-canvas-core';
import {initResponsiveFromSize} from '../context/ResponsiveContext';
import type {RatioId} from '../types';

export interface ResponsiveSetupOptions {
  ratio?: RatioId;
}

export function createResponsiveSetup(options: ResponsiveSetupOptions = {}) {
  return (size: Vector2) => {
    initResponsiveFromSize(size, options.ratio ?? '16x9');
  };
}
