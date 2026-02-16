import React, {useMemo} from 'react';
import {
  detectRatioClass,
  useResponsiveContext,
} from '../context/ResponsiveContext';
import type {RatioClass, RatioId} from '../types';

type RatioCondition =
  | RatioId
  | RatioClass
  | 'portrait'
  | 'landscape'
  | 'square'
  | 'ultrawide';

export interface UseRatioElementOptions {
  only?: RatioCondition[];
  except?: RatioCondition[];
  element: () => React.ReactElement | null;
}

export function useRatioElement(
  options: UseRatioElementOptions,
): React.ReactElement | null {
  const state = useResponsiveContext();
  const aspectRatio = state.width / state.height;
  const ratioClass = detectRatioClass(aspectRatio);

  return useMemo(() => {
    const conditions = options.only ?? [];
    const exceptions = options.except ?? [];

    const matchesConditions =
      conditions.length === 0 ||
      conditions.some(cond => {
        if (cond === state.ratio) return true;
        if (cond === ratioClass) return true;
        if (cond === 'portrait' && ratioClass === 'portrait') return true;
        if (cond === 'landscape' && ratioClass === 'landscape') return true;
        if (cond === 'square' && ratioClass === 'square') return true;
        if (cond === 'ultrawide' && ratioClass === 'ultrawide') return true;
        return false;
      });

    const matchesExceptions = exceptions.some(cond => {
      if (cond === state.ratio) return true;
      if (cond === ratioClass) return true;
      if (cond === 'portrait' && ratioClass === 'portrait') return true;
      if (cond === 'landscape' && ratioClass === 'landscape') return true;
      if (cond === 'square' && ratioClass === 'square') return true;
      if (cond === 'ultrawide' && ratioClass === 'ultrawide') return true;
      return false;
    });

    if (matchesConditions && !matchesExceptions) {
      return options.element();
    }

    return null;
  }, [state.ratio, ratioClass, options]);
}
