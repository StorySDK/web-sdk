import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import json from '@rollup/plugin-json';
import nodePolyfills from 'rollup-plugin-polyfill-node';
import image from '@rollup/plugin-image';
import copy from 'rollup-plugin-copy';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';

const PACKAGE_ROOT_PATH = process.cwd();
const { LERNA_PACKAGE_NAME, NODE_ENV } = process.env;

const pkg = LERNA_PACKAGE_NAME && require(`${PACKAGE_ROOT_PATH}/package.json`);

const isCore = LERNA_PACKAGE_NAME === '@storysdk/core';
console.log(`Building package: ${LERNA_PACKAGE_NAME}, isCore: ${isCore}`);

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
        name: isCore ? 'StorySDK' : 'Story',
        sourcemap: true,
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-dom/client': 'ReactDOMClient',
          'hls.js': 'Hls'
        },
        ...(isCore && {
          footer: "if(typeof window !== 'undefined' && typeof StorySDK !== 'undefined') { window.Story = StorySDK.Story; }"
        })
      }
    ],
    external: ['react', 'react-dom', 'react-dom/client'],
    plugins: [
      peerDepsExternal(),
      resolve({
        browser: true,
        dedupe: ['react', 'react-dom'],
        extensions: ['.ts', '.tsx', '.js', '.jsx'],
        preferBuiltins: false
      }),
      commonjs(),
      typescript({
        tsconfig: `${PACKAGE_ROOT_PATH}/tsconfig.json`,
        clean: true,
        useTsconfigDeclarationDir: false,
        check: true,
        tsconfigOverride: {
          compilerOptions: {
            skipLibCheck: true,
            declaration: false
          }
        }
      }),
      copy({
        targets: [
          { src: "assets/fonts", dest: "dist" },
          ...(LERNA_PACKAGE_NAME === '@storysdk/react' ? [
            { src: "dist/react/index.d.ts", dest: "dist/", hook: 'writeBundle' }
          ] : [])
        ],
      }),
      ...(!isCore ? [
        postcss({
          extract: 'bundle.css',
          minimize: true,
          modules: false,
          sourceMap: false,
          inject: false,
          use: ['sass'],
          plugins: [
            require('postcss-nested'),
            require('autoprefixer')({
              overrideBrowserslist: ['last 2 versions', '> 1%', 'not dead']
            })
          ],
          parser: require('postcss-scss')
        })
      ] : [
        copy({
          targets: [
            { 
              src: "../react/dist/bundle.css", 
              dest: "dist/",
              hook: 'writeBundle'
            }
          ],
        })
      ]),
      replace({
        'process.env.NODE_ENV': NODE_ENV,
        preventAssignment: true,
        values: {
          IS_UMD: JSON.stringify(pkg.browser ? true : false),
          ...(pkg.browser && {
            // Remove react-dom/client imports for UMD builds
            "require('react-dom/client')": 'null',
            "import('react-dom/client')": 'Promise.resolve(null)'
          })
        }
      }),
      json(),
      nodePolyfills(),
      image(),
      terser()
    ]
  }
];
