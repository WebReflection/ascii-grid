import {nodeResolve} from '@rollup/plugin-node-resolve';
import terser from '@rollup/plugin-terser';


export default {
  input: './esm/component.js',
  plugins: [
    
    nodeResolve(),
    
    terser()
  ],
  
  output: {
    file: './component.js',
    format: 'module',
  }
};
