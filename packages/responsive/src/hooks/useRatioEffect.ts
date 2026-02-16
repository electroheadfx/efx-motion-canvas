import {useEffect} from 'react';
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

export function useRatioEffect(
  condition: RatioCondition | RatioCondition[],
  callback: () => void | (() => void),
  deps: any[] = [],
) {
  const state = useResponsiveContext();
  const aspectRatio = state.width / state.height;
  const ratioClass = detectRatioClass(aspectRatio);

  const conditions = Array.isArray(condition) ? condition : [condition];

  const matches = conditions.some(cond => {
    if (cond === state.ratio) return true;
    if (cond === ratioClass) return true;
    if (cond === 'portrait' && ratioClass === 'portrait') return true;
    if (cond === 'landscape' && ratioClass === 'landscape') return true;
    if (cond === 'square' && ratioClass === 'square') return true;
    if (cond === 'ultrawide' && ratioClass === 'ultrawide') return true;
    return false;
  });

  useEffect(() => {
    if (matches) {
      return callback();
    }
  }, [matches, ...deps]);
}
