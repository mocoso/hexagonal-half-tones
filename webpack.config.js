const path = require("path");
module.exports = {
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.png$/i,
        loader: 'file-loader',
        options: {
          name: '[path][name].[ext]',
        },
      }
    ]
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "bundle.js"
  }
};

