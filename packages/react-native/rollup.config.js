import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { string } from 'rollup-plugin-string';
import copy from 'rollup-plugin-copy';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      sourcemap: true,
    },
    {
      file: 'dist/index.esm.js',
      format: 'esm',
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    string({
      include: '**/*.html',
    }),
    typescript({
      tsconfig: './tsconfig.json',
      exclude: ['**/__tests__', '**/*.test.tsx'],
      declaration: true,
      declarationDir: 'dist',
      rootDir: 'src',
    }),
    copy({
      targets: [
        { src: 'src/*.html', dest: 'dist' }
      ]
    })
  ],
  external: ['react', 'react-native', 'react-native-webview'],
}; 