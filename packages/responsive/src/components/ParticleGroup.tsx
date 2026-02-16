import {cloneElement, isValidElement, ReactElement} from 'react';
import {useRatio} from '../layout/ResponsiveLayout';

export interface ParticleGroupProps {
  count: number;
  compositeOperation?: GlobalCompositeOperation;
  opacity?: number;
  children: (index: number) => ReactElement;
}

export function ParticleGroup({
  count,
  compositeOperation = 'source-over',
  opacity = 1,
  children,
}: ParticleGroupProps): ReactElement[] {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _layout = useRatio();
  const elements: ReactElement[] = [];

  for (let i = 0; i < count; i++) {
    const child = children(i);
    if (isValidElement(child)) {
      const childOpacity = (child.props as any).opacity ?? 1;
      elements.push(
        cloneElement(child, {
          key: i,
          compositeOperation,
          opacity: childOpacity * opacity,
        } as any),
      );
    }
  }

  return elements;
}
