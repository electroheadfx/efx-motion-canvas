export interface ScaleHelpers {
  from: (value: number) => {from: number; to: number};
  to: (value: number) => {from: number; to: number};
  pop: () => {
    from: number;
    to: number;
    keyframes: Array<{progress: number; scale: number}>;
  };
  pulse: (intensity: number) => {from: number; to: number};
}

export interface TransformHelpers {
  scaleX: (value: number) => number;
  scaleY: (value: number) => number;
  skewX: (degrees: number) => number;
  skewY: (degrees: number) => number;
}

export const scale: ScaleHelpers = {
  from: (value: number) => ({from: value, to: 1}),
  to: (value: number) => ({from: 1, to: value}),
  pop: () => ({
    from: 1,
    to: 1,
    keyframes: [
      {progress: 0, scale: 1},
      {progress: 0.5, scale: 1.1},
      {progress: 1, scale: 1},
    ],
  }),
  pulse: (intensity: number) => ({
    from: 1 - intensity * 0.1,
    to: 1 + intensity * 0.1,
  }),
};

export const transform: TransformHelpers = {
  scaleX: (value: number) => value,
  scaleY: (value: number) => value,
  skewX: (degrees: number) => degrees,
  skewY: (degrees: number) => degrees,
};
