import typescript from '@rollup/plugin-typescript';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/bundle.min.cjs',
      format: 'cjs',
      name: 'version',
      plugins: [terser()],
    },
  ],
  plugins: [typescript()],
};
