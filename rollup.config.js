import babel from 'rollup-plugin-babel'
export default {
  input: './src/index.js',
  output: {
    file: './dist/vue.js',
    name: 'Vue',
    format: 'umd', // esm, es6, commonjs， umd(commonjs amd), life自执行
    sourcemap: true
  },
  plugins: [
    babel({
      exclude: 'node_module/**'
    })
  ]

}

