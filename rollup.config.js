import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import scss from 'rollup-plugin-scss';
import json from '@rollup/plugin-json';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import image from '@rollup/plugin-image';
import copy from 'rollup-plugin-copy';

const PACKAGE_ROOT_PATH = process.cwd();
const { LERNA_PACKAGE_NAME } = process.env;

const pkg = LERNA_PACKAGE_NAME && require(`${PACKAGE_ROOT_PATH}/package.json`);

export default [
  {
    input: `${PACKAGE_ROOT_PATH}/index.ts`,
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: false
      },
      {
        file: pkg.module,
        format: 'esm',
        sourcemap: false
      },
      {
        external: ['react', 'react-dom', '@react-hook/window-size', 'axios', 'emoji-mart', 'hex-to-rgba', 'js-confetti', 'luxon', 'nanoid', 'parse-color', 'react-loading-skeleton'],
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          axios: 'axios',
          'emoji-mart': 'EmojiMart',
          'hex-to-rgba': 'hexToRgba',
          'js-confetti': 'JSConfetti',
          luxon: 'luxon',
          nanoid: 'nanoid',
          'parse-color': 'parseColor',
          'react-loading-skeleton': 'ReactLoadingSkeleton'
        },
        file: pkg.browser,
        format: 'umd',
        name: 'index',
        sourcemap: false
      },
      {
        external: ['react', 'react-dom', '@react-hook/window-size', 'axios', 'emoji-mart', 'hex-to-rgba', 'js-confetti', 'luxon', 'nanoid', 'parse-color', 'react-loading-skeleton'],
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          axios: 'axios',
          'emoji-mart': 'EmojiMart',
          'hex-to-rgba': 'hexToRgba',
          'js-confetti': 'JSConfetti',
          luxon: 'luxon',
          nanoid: 'nanoid',
          'parse-color': 'parseColor',
          'react-loading-skeleton': 'ReactLoadingSkeleton'
        },
        file: pkg.iife,
        format: 'iife',
        name: 'index',
        sourcemap: false
      }
    ],
    plugins: [
      peerDepsExternal(),
      resolve({
        browser: true,
      }),
      commonjs(),
      typescript({
        tsconfig: `${PACKAGE_ROOT_PATH}/tsconfig.json`
      }),
      copy({
        targets: [
            { src: "assets/fonts", dest: "dist" },
        ],
      }),
      scss({
        outputStyle: 'compressed'
      }),
      json(),
      nodePolyfills(),
      image()
    ]
  }
];
