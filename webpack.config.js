module.exports = {
  mode: "development",
  devtool: "inline-source-map",
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
  }
};
