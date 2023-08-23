import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import scss from 'rollup-plugin-scss';
import json from '@rollup/plugin-json';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import image from '@rollup/plugin-image';
import copy from 'rollup-plugin-copy';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';

const PACKAGE_ROOT_PATH = process.cwd();
const { LERNA_PACKAGE_NAME, NODE_ENV } = process.env;

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
        file: pkg.browser,
        format: 'umd',
        name: 'index',
        sourcemap: false,
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM'
        }
      }
    ],
    plugins: [
      peerDepsExternal(),
      resolve({
        browser: true,
        dedupe: ['react', 'react-dom']
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
      replace({
        'process.env.NODE_ENV': NODE_ENV,
      }),
      json(),
      nodePolyfills(),
      image(),
      terser()
    ]
  }
];
