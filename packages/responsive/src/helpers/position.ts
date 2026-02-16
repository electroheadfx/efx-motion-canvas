import {useResponsiveContext} from '../context/ResponsiveContext';

export interface PositionHelpers {
  offLeft: (margin?: number) => number;
  offRight: (margin?: number) => number;
  offTop: (margin?: number) => number;
  offBottom: (margin?: number) => number;
  fromLeft: (margin?: number) => number;
  fromRight: (margin?: number) => number;
  fromTop: (margin?: number) => number;
  fromBottom: (margin?: number) => number;
}

export function createPositionHelpers(
  elementWidth: number = 0,
  elementHeight: number = 0,
): PositionHelpers {
  const state = useResponsiveContext();
  const {width, height} = state;
  const hw = width / 2;
  const hh = height / 2;
  const elHalfW = elementWidth / 2;
  const elHalfH = elementHeight / 2;

  return {
    offLeft: (margin = 0) => -hw - elHalfW - margin,
    offRight: (margin = 0) => hw + elHalfW + margin,
    offTop: (margin = 0) => -hh - elHalfH - margin,
    offBottom: (margin = 0) => hh + elHalfH + margin,
    fromLeft: (margin = 0) => -hw + elHalfW + margin,
    fromRight: (margin = 0) => hw - elHalfW - margin,
    fromTop: (margin = 0) => -hh + elHalfH + margin,
    fromBottom: (margin = 0) => hh - elHalfH - margin,
  };
}

export const offLeft = (margin = 0, elementWidth = 0): number => {
  const state = useResponsiveContext();
  return -state.width / 2 - elementWidth / 2 - margin;
};

export const offRight = (margin = 0, elementWidth = 0): number => {
  const state = useResponsiveContext();
  return state.width / 2 + elementWidth / 2 + margin;
};

export const offTop = (margin = 0, elementHeight = 0): number => {
  const state = useResponsiveContext();
  return -state.height / 2 - elementHeight / 2 - margin;
};

export const offBottom = (margin = 0, elementHeight = 0): number => {
  const state = useResponsiveContext();
  return state.height / 2 + elementHeight / 2 + margin;
};

export const fromLeft = (margin = 0, elementWidth = 0): number => {
  const state = useResponsiveContext();
  return -state.width / 2 + elementWidth / 2 + margin;
};

export const fromRight = (margin = 0, elementWidth = 0): number => {
  const state = useResponsiveContext();
  return state.width / 2 - elementWidth / 2 - margin;
};

export const fromTop = (margin = 0, elementHeight = 0): number => {
  const state = useResponsiveContext();
  return -state.height / 2 + elementHeight / 2 + margin;
};

export const fromBottom = (margin = 0, elementHeight = 0): number => {
  const state = useResponsiveContext();
  return state.height / 2 - elementHeight / 2 - margin;
};
