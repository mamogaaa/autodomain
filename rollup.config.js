import coffeescript from 'rollup-plugin-coffee-script';

export default {
  input: 'src/index.coffee',
  output: {
    file: 'build/index.js',
    format: 'cjs'
  },
  plugins: [
    coffeescript()
  ]
}