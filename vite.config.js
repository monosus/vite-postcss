import { defineConfig } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import nodeFs from 'node:fs';
import nodePath from 'node:path';
import pug from '@vituum/vite-plugin-pug';
import sizeOf from 'image-size';
import beautify from 'vite-plugin-beautify';
import vituum from 'vituum';

export default defineConfig({
  server: {
    host: '0.0.0.0',
  },
  css: {
    devSourcemap: true,
  },
  build: {
    assetsInlineLimit: 0,
    cssMinify: false,
    emptyOutDir: true,
    modulePreload: {
      polyfill: false,
    },
    rollupOptions: {
      output: {
        entryFileNames: 'assets/js/[name].js',
        assetFileNames: ({ names, originalFileNames }) => {
          if (originalFileNames?.length) {
            const originalPath = originalFileNames[0].match(/src\/(images|styles)\/(.*\/)[^/]*$/)?.[2] || '';
            if (/\.(css)$/.test(names)) {
              return `assets/css/${originalPath}[name][extname]`;
            }
            if (/\.(jpg|jpeg|svg|png|webp|gif)$/.test(names)) {
              return `assets/images/${originalPath}[name][extname]`;
            }
          }

          return 'assets/[name][extname]';
        },
      },
    },
  },
  plugins: [
    vituum({
      input: ['./src/styles/**/*.{css,scss}', './src/scripts/main.{js,ts}'],
      imports: {
        paths: [],
      },
    }),
    pug({
      globals: {
        _nodeFs: nodeFs,
        _nodePath: nodePath,
        _sizeOf: sizeOf,
      },
    }),
    ViteImageOptimizer({
      png: { quality: 75 },
      jpeg: { quality: 75 },
      jpg: { quality: 75 },
    }),
    beautify({
      inDir: './dist',
      html: {
        enabled: true,
        glob: '**/*.html',
        options: {
          indent_size: 2,
          inline: [],
          content_unformatted: ['pre', 'textarea', 'script'],
        },
      },
      js: {
        enabled: false,
      },
      css: {
        enabled: true,
      },
    }),
  ],
});
