import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';

export default {
  input: 'src/index.ts',
  external: ['react', 'react-dom'],
  output: [
    {
      file: 'dist/index.js',
      format: 'cjs',
      exports: 'named',
      sourcemap: true,
    },
    {
      file: 'dist/index.es.js',
      format: 'es',
      exports: 'named',
      sourcemap: true,
    },
  ],
  plugins: [
    peerDepsExternal(),
    resolve(),
    commonjs(),
    typescript({
      exclude: ['**/__tests__/**', '**/*.test.tsx', '**/*.test.ts'],
      clean: true,
    }),
    babel({
      exclude: 'node_modules/**',
      presets: ['@babel/preset-react'],
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    }),
    terser(),
  ],
};
