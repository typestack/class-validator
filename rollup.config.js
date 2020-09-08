import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'build/esm5/index.js',
  output: [
    {
      name: 'ClassValidator',
      format: 'umd',
      file: 'build/bundles/class-validator-multi-lang.umd.js',
      sourcemap: true,
    },
    {
      name: 'ClassValidator',
      format: 'umd',
      file: 'build/bundles/class-validator-multi-lang.umd.min.js',
      sourcemap: true,
      plugins: [terser()],
    },
  ],
  plugins: [commonjs(), nodeResolve()],
};
