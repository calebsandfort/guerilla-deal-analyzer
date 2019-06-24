const path = require("path");
const nodeExternals = require("webpack-node-externals");

module.exports = {
  target: "node",
  mode: "production",
  // externals: [nodeExternals()],
  entry: "./src/backend/index.js",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist_backend")
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [
              [
                "@babel/preset-env",
                {
                  targets: {
                    node: "current"
                  }
                }
              ]
            ],
            plugins: ["@babel/plugin-proposal-export-default-from", "@babel/plugin-syntax-dynamic-import"]
          }
        }
      }
    ]
  }
};
