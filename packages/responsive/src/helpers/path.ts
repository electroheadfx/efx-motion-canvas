import {Vector2} from '@efxlab/motion-canvas-core';

export interface PathHelpers {
  arc: (
    startAngle: number,
    endAngle: number,
    radius: number,
  ) => {startAngle: number; endAngle: number; radius: number};
  bezier: (controlPoints: Vector2[]) => {controlPoints: Vector2[]};
  orbit: (
    centerX: number,
    centerY: number,
    radius: number,
  ) => {centerX: number; centerY: number; radius: number; duration: number};
  wave: (
    amplitude: number,
    frequency: number,
  ) => {amplitude: number; frequency: number; duration: number};
  shake: (intensity: number) => {intensity: number; duration: number};
  wobble: (intensity: number) => {intensity: number; duration: number};
}

export const path: PathHelpers = {
  arc: (startAngle: number, endAngle: number, radius: number) => ({
    startAngle,
    endAngle,
    radius,
  }),
  bezier: (controlPoints: Vector2[]) => ({controlPoints}),
  orbit: (centerX: number, centerY: number, radius: number) => ({
    centerX,
    centerY,
    radius,
    duration: 2,
  }),
  wave: (amplitude: number, frequency: number) => ({
    amplitude,
    frequency,
    duration: 1,
  }),
  shake: (intensity: number) => ({
    intensity,
    duration: 0.5,
  }),
  wobble: (intensity: number) => ({
    intensity,
    duration: 1,
  }),
};
