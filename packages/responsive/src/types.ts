export type RatioId = '16x9' | '9x16' | '4x3' | '1x1' | 'fullwindow' | string;

export type RatioClass = 'landscape' | 'portrait' | 'square' | 'ultrawide';

export interface ResponsiveRatioConfig {
  aspect: string;
  ratioClass?: RatioClass;
}

export interface ResponsiveRatiosConfig {
  [ratioId: string]: ResponsiveRatioConfig;
}

export interface ResponsiveConfig<T> {
  base: T;
  portrait?: Partial<T>;
  landscape?: Partial<T>;
  square?: Partial<T>;
  ultrawide?: Partial<T>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '16x9'?: Partial<T>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '9x16'?: Partial<T>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '4x3'?: Partial<T>;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '1x1'?: Partial<T>;
  fullwindow?: Partial<T>;
  [key: string]: Partial<T> | undefined;
}

export interface ResponsiveState {
  ratio: RatioId;
  ratioClass: RatioClass;
  width: number;
  height: number;
}

export interface AnimationConfig {
  duration?: number;
  easing?: any;
  delay?: number;
  [key: string]: any;
}
