export * from './components';
export * from './context/ResponsiveContext';
export * from './helpers';
export * from './hooks/useRatio';
export * from './hooks/useRatioEffect';
export * from './hooks/useRatioElement';
export * from './hooks/useResponsive';
export * from './hooks/useResponsiveAnimation';
export * from './layout/ResponsiveLayout';
export * from './scene';
export * from './types';

declare module '@efxlab/motion-canvas-core' {
  interface Scene {
    setResponsiveSetup(callback: (size: {x: number; y: number}) => void): void;
  }
}
