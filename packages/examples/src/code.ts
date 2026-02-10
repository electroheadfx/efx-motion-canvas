import {makeProject} from '@efxlab/motion-canvas-core';
import scene from './scenes/code?scene';

import {Code, LezerHighlighter} from '@efxlab/motion-canvas-2d';
import {parser} from '@lezer/javascript';

Code.defaultHighlighter = new LezerHighlighter(parser);

export default makeProject({
  scenes: [scene],
});
