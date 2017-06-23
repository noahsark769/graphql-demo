var path = require('path');
var webpack = require('webpack');

module.exports = [{
  entry: {
    index: './graphql-demo/static/js/index.jsx',
  },
  output: { path: path.resolve(__dirname, "graphql-demo/static/build/js"), filename: '[name].bundle.js' },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react', 'stage-0']
        }
      }
    ]
  },
 resolve: {
    extensions: ['', '.js', '.jsx']
  }
}];