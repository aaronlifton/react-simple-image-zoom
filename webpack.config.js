const path = require('path');

module.exports = [{
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: [
          /node_modules/,
          "./src/experimental"
        ]
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: 'ReactSimpleImageZoom.js',
    path: path.resolve(__dirname, 'dist')
  }
},{
  devtool: 'source-map',
  entry: './demo/src/App.tsx',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: {
          loader: 'ts-loader',
          options: {
            configFile: "demo/demo-tsconfig.json"
          }
        },
        exclude: [
          /node_modules/,
          "./demo/dist"
        ]
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'demo/dist')
  }
}];