const path = require('path')

module.exports = (env) => {
  const isDev = env.development
  return {
    entry: path.resolve(__dirname, './src/index.js'),
    mode: isDev ? 'development' : 'production',
    output: {
      filename: 'index.js',
      path: path.resolve(__dirname, './dist'),
    },
    module: {
      rules: [
        {
          test: /\.(js)$/,
          exclude: /node_modules/,
          use: ['babel-loader'],
        },
      ],
    },
  }
}
