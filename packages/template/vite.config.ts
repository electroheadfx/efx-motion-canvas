import markdown from '@efxlab/motion-canvas-internal/vite/markdown-literals';
import preact from '@preact/preset-vite';
import {defineConfig} from 'vite';
import ffmpeg from '../ffmpeg/server';
import motionCanvas from '../vite-plugin/src/main';

export default defineConfig({
  resolve: {
    alias: [
      {
        find: '@efxlab/motion-canvas-ui',
        replacement: '@efxlab/motion-canvas-ui/src/main.tsx',
      },
      {
        find: '@efxlab/motion-canvas-2d/editor',
        replacement: '@efxlab/motion-canvas-2d/src/editor',
      },
      {
        find: '@efxlab/motion-canvas-ffmpeg/lib/client',
        replacement: '@efxlab/motion-canvas-ffmpeg/client',
      },
      {
        find: /@motion-canvas\/2d(\/lib)?/,
        replacement: '@efxlab/motion-canvas-2d/src/lib',
      },
      {
        find: '@efxlab/motion-canvas-core',
        replacement: '@efxlab/motion-canvas-core/src',
      },
    ],
  },
  plugins: [
    markdown(),
    preact({
      include: [
        /packages\/ui\/src\/(.*)\.tsx?$/,
        /packages\/2d\/src\/editor\/(.*)\.tsx?$/,
      ],
    }),
    motionCanvas({
      buildForEditor: true,
    }),
    ffmpeg(),
  ],
  build: {
    minify: false,
    rollupOptions: {
      output: {
        entryFileNames: '[name].js',
      },
    },
  },
});
