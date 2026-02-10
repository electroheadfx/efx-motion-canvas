import {makeProject} from '@efxlab/motion-canvas-core';

import example from './scenes/example?scene';

export default makeProject({
  experimentalFeatures: true,
  scenes: [example],
});
