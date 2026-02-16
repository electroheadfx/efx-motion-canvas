import React from 'react';
import {
  useRatioElement,
  UseRatioElementOptions,
} from '../hooks/useRatioElement';

export interface RatioLayerProps extends UseRatioElementOptions {
  children?: React.ReactElement | null;
}

export function RatioLayer({
  children,
  ...options
}: RatioLayerProps): React.ReactElement | null {
  return useRatioElement({
    ...options,
    element: () => children ?? null,
  });
}
