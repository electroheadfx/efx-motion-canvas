import motionCanvas from '@efxlab/motion-canvas-vite-plugin';
import {defineConfig} from 'vite';

export default defineConfig({
  plugins: [
    motionCanvas({
      project: './src/projects/*.ts',
    }),
  ],
});
