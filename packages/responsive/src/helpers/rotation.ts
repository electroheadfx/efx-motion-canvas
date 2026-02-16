export interface RotationHelpers {
  spin: (turns: number) => number;
  spinCW: (turns: number) => number;
  spinCCW: (turns: number) => number;
  pivot: {
    center: () => {x: number; y: number};
    topLeft: () => {x: number; y: number};
    topRight: () => {x: number; y: number};
    bottomLeft: () => {x: number; y: number};
    bottomRight: () => {x: number; y: number};
    custom: (x: number, y: number) => {x: number; y: number};
  };
}

export const rotate: RotationHelpers = {
  spin: (turns: number) => turns * 360,
  spinCW: (turns: number) => turns * 360,
  spinCCW: (turns: number) => -turns * 360,
  pivot: {
    center: () => ({x: 0, y: 0}),
    topLeft: () => ({x: -0.5, y: -0.5}),
    topRight: () => ({x: 0.5, y: -0.5}),
    bottomLeft: () => ({x: -0.5, y: 0.5}),
    bottomRight: () => ({x: 0.5, y: 0.5}),
    custom: (x: number, y: number) => ({x, y}),
  },
};
