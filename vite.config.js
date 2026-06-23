import { defineConfig } from 'vite';
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer';
import beautify from 'vite-plugin-beautify';
import nodeFs from 'node:fs';
import nodePath from 'node:path';
import pug from '@vituum/vite-plugin-pug';
import sizeOf from 'image-size';
import vituum from 'vituum';

// Build output formatting config.
const buildConfig = {
  eol: 'crlf', // 'crlf' | 'lf'
  indentSize: 2,
  indentWithTabs: false,
  imageQuality: 80,
  cssMinify: false,
};

function wrapModule(mod) {
  class ModuleProto {}
  const wrapped = Object.create(ModuleProto.prototype);
  return Object.assign(wrapped, mod);
}

export default defineConfig(() => {
  const eol = buildConfig.eol === 'crlf' ? '\r\n' : '\n';

  return {
    server: {
      host: '0.0.0.0',
    },
    css: {
      devSourcemap: true,
    },
    build: {
      assetsInlineLimit: 0,
      cssMinify: buildConfig.cssMinify,
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
          _nodeFs: wrapModule(nodeFs),
          _nodePath: wrapModule(nodePath),
          _sizeOf: sizeOf,
        },
      }),
      ViteImageOptimizer({
        includePublic: true,
        png: { quality: buildConfig.imageQuality },
        jpeg: { quality: buildConfig.imageQuality },
        jpg: { quality: buildConfig.imageQuality },
      }),
      beautify({
        inDir: './dist',
        html: {
          enabled: true,
          glob: '**/*.html',
          options: {
            eol,
            indent_size: buildConfig.indentSize,
            indent_with_tabs: buildConfig.indentWithTabs,
            content_unformatted: ['pre', 'textarea', 'script'],
            inline: ['br'],
          },
        },
        css: {
          enabled: !buildConfig.cssMinify,
          options: {
            eol,
            indent_size: buildConfig.indentSize,
            indent_with_tabs: buildConfig.indentWithTabs,
          },
        },
        js: {
          enabled: false,
        },
      }),
    ],
  };
});
