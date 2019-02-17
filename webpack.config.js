module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  context: __dirname + "/src",
  entry: "./gui.ts",
  output: {
    path: __dirname + "/bin",
    filename: "snapinator_gui.bundle.js"
  },
  resolve: {
    extensions: [".ts", ".js"]
  },
  module: {
    rules: [
      { test: /\.ts$/, loader: "ts-loader" }
    ]
  }
};
