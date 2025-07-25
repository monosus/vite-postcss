import { defineConfig, loadEnv } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import beautify from 'vite-plugin-beautify';
import nodeFs from 'node:fs';
import nodePath from 'node:path';
import pug from '@vituum/vite-plugin-pug';
import sizeOf from 'image-size';
import vituum from 'vituum';

export default defineConfig(({ mode }) => {
  process.env = { ...process.env, ...loadEnv(mode, process.cwd()) };
  const eol = process.env.VITE_CONFIG_EOL.toLowerCase() === 'crlf' ? '\r\n' : '\n';

  return {
    server: {
      host: '0.0.0.0',
    },
    css: {
      devSourcemap: true,
    },
    build: {
      assetsInlineLimit: 0,
      cssMinify: process.env.VITE_CONFIG_CSS_MINIFY,
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
        input: ['./src/styles/[^_]*/*.{css,scss}', './src/scripts/main.{js,ts}'],
        imports: {
          filenamePattern: {
            '+.css': [],
            'index.css': 'src/styles',
          },
          paths: ['./src/styles/_(?!mixin)*/**'],
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
        includePublic: true,
        png: { quality: Number(process.env.VITE_CONFIG_IMAGE_QUALITY) },
        jpeg: { quality: Number(process.env.VITE_CONFIG_IMAGE_QUALITY) },
        jpg: { quality: Number(process.env.VITE_CONFIG_IMAGE_QUALITY) },
      }),
      beautify({
        inDir: './dist',
        html: {
          enabled: true,
          glob: '**/*.html',
          options: {
            eol,
            indent_size: process.env.VITE_CONFIG_INDENT,
            indent_with_tabs: process.env.VITE_CONFIG_INDENT_WITH_TABS,
            content_unformatted: ['pre', 'textarea', 'script'],
            inline: [],
          },
        },
        css: {
          enabled: true,
          options: {
            eol,
            indent_size: process.env.VITE_INDENT,
            indent_with_tabs: process.env.VITE_CONFIG_INDENT_WITH_TABS,
          },
        },
        js: {
          enabled: false,
        },
      }),
    ],
  };
});
