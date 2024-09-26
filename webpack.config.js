const path = require('path');

module.exports = {
  entry: './src/index.js',  // unminified source code entry point
  output: {
    filename: 'script.js',  // Output file name
    path: path.resolve(__dirname, 'dist'), // Output directory
  },
  mode: 'development',  // to ensure unminified code
  devtool: 'source-map', // add source maps for easier debugging
};