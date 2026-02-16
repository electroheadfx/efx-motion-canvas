import {
  detectRatioClass,
  useResponsiveContext,
} from '../context/ResponsiveContext';
import type {ResponsiveConfig} from '../types';

export function useResponsive<T>(config: ResponsiveConfig<T>): T {
  const state = useResponsiveContext();
  const aspectRatio = state.width / state.height;
  const ratioClass = detectRatioClass(aspectRatio);

  let result: any = {...config.base};

  const classOverrides: Partial<T>[] = [];

  if (config.portrait && ratioClass === 'portrait') {
    classOverrides.push(config.portrait);
  } else if (config.landscape && ratioClass === 'landscape') {
    classOverrides.push(config.landscape);
  } else if (config.square && ratioClass === 'square') {
    classOverrides.push(config.square);
  } else if (config.ultrawide && ratioClass === 'ultrawide') {
    classOverrides.push(config.ultrawide);
  }

  const specificOverride = config[state.ratio];
  if (specificOverride) {
    classOverrides.push(specificOverride);
  }

  for (const override of classOverrides) {
    result = {...result, ...override};
  }

  return result as T;
}
