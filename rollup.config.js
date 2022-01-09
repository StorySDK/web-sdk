import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import scss from 'rollup-plugin-scss';
import json from '@rollup/plugin-json';
import nodePolyfills from 'rollup-plugin-polyfill-node';

const PACKAGE_ROOT_PATH = process.cwd();
const { LERNA_PACKAGE_NAME } = process.env;

// eslint-disable-next-line
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
      }
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript({
        tsconfig: `${PACKAGE_ROOT_PATH}/tsconfig.json`
      }),
      scss(),
      json(),
      nodePolyfills()
    ]
  }
];
