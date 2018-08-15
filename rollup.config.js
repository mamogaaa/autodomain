import coffeescript from 'rollup-plugin-coffee-script';
import pug from 'rollup-plugin-pug';

export default {
  input: 'src/index.coffee',
  output: {
    file: 'build/index.js',
    format: 'cjs'
  },
  plugins: [
    coffeescript(),
    pug()
  ]
}