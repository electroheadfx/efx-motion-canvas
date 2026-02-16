import type {Scene2D} from '@efxlab/motion-canvas-2d';
import type {
  ThreadGenerator,
  ThreadGeneratorFactory,
} from '@efxlab/motion-canvas-core';
import {useResponsiveContext} from '../context/ResponsiveContext';

type SceneFactory = () => ThreadGenerator;

export interface ResponsiveSceneConfig {
  base: SceneFactory;
  portrait?: SceneFactory;
  landscape?: SceneFactory;
  square?: SceneFactory;
  ultrawide?: SceneFactory;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '16x9'?: SceneFactory;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '9x16'?: SceneFactory;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '4x3'?: SceneFactory;
  // eslint-disable-next-line @typescript-eslint/naming-convention
  '1x1'?: SceneFactory;
  fullwindow?: SceneFactory;
  [key: string]: SceneFactory | undefined;
}

export function makeResponsiveScene(
  config: ResponsiveSceneConfig,
): ThreadGeneratorFactory<Scene2D> {
  return function* (): ThreadGenerator {
    // Note: _view parameter is required by ThreadGeneratorFactory but scene is selected via config
    const state = useResponsiveContext();

    const specificFactory = config[state.ratio];
    if (specificFactory) {
      yield* specificFactory();
      return;
    }

    const classFactory = config[state.ratioClass];
    if (classFactory) {
      yield* classFactory();
      return;
    }

    yield* config.base();
  };
}
