const path = require('path')

module.exports = (env) => {
  const isDev = env.development
  return {
    entry: path.resolve(__dirname, './demo/index'),
    mode: isDev ? 'development' : 'production',
    output: {
      filename: 'demo.js',
      path: path.resolve(__dirname, './demo/dist'),
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
    devServer: {
      contentBase: ['demo/'],
    },
  }
}
