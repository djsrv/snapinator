const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const profile = process.argv.indexOf('--profile') !== -1;

module.exports = {
  context: __dirname + "/src",
  entry: "./app.tsx",
  output: {
    path: __dirname + "/bin",
    filename: "snapinator_app.bundle.js"
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"]
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "ts-loader" }
    ]
  },
  plugins: []
};

if (profile) {
  module.exports.plugins.push(new BundleAnalyzerPlugin());
}
