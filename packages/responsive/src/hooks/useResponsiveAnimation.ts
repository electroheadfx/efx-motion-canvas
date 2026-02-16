import type {AnimationConfig, ResponsiveConfig} from '../types';
import {useResponsive} from './useResponsive';

export function useResponsiveAnimation(
  config: ResponsiveConfig<AnimationConfig>,
): AnimationConfig {
  return useResponsive(config);
}
