import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'build/esm5/index.js',
  output: [
    {
      name: 'ClassValidatorCustomErrors',
      format: 'umd',
      file: 'build/bundles/class-validator-custom-errors.umd.js',
      sourcemap: true,
    },
    {
      name: 'ClassValidatorCustomErrors',
      format: 'umd',
      file: 'build/bundles/class-validator-custom-errors.umd.min.js',
      sourcemap: true,
      plugins: [terser()],
    },
  ],
  plugins: [commonjs(), nodeResolve()],
};
