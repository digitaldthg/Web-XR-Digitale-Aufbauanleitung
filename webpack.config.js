const webpack = require("webpack");
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const ThreeMinifierPlugin = require("@yushijinhun/three-minifier-webpack");
const threeMinifier = new ThreeMinifierPlugin();

const path = require("path");
const { HotModuleReplacementPlugin } = require("webpack");
const WebpackDevMiddleware = require("webpack-dev-middleware");

const publicPath = path.join(__dirname, "public");

module.exports = {
  mode: 'development',
  entry : path.resolve(__dirname, "client/js/app.js"),
  output: {
    path: publicPath,
    filename: "bundle.js",
    publicPath: publicPath
  },
  optimization: {
    minimize: true,
    usedExports: true,
    splitChunks : {
      chunks: 'all',
    }
  },
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js'
    },
		plugins: [
			//threeMinifier.resolver, // <=== (2) Add resolver on the FIRST line
		]
	},
  plugins:[
    //new BundleAnalyzerPlugin(),
    //threeMinifier,
    new HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'client/template/index.html'),
      filename: 'index.html',
      inject: 'body',
      alwaysWriteToDisk: true
    }),
    new HtmlWebpackHarddiskPlugin({
      publicPath:  publicPath
    }),
    new VueLoaderPlugin()
  ],
  
  devServer : {
    hot: true,
    inline : true,
    host: '0.0.0.0',
    stats:"errors-only",
    port: 3000,
    noInfo : true,
    quite : true,
    clientLogLevel: 'none',
    stats: 'errors-only',
    watchContentBase: true,
    contentBase: publicPath,
    historyApiFallback: true,
    devMiddleware : {
      publicPath : publicPath,
      stats: {
        colors: true,
        hash: false,
        version: false,
        timings: false,
        assets: false,
        chunks: false,
        modules: false,
        reasons: false,
        children: false,
        source: false,
        errors: true,
        errorDetails: false,
        warnings: true
      }
    },
    hotMiddleware : {
      stats: {
        colors: true,
      }
    },
  },
  module: {
    rules : [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: ["babel-loader"]
      },
      {
        test: /\.(gltf)$/,
        use: [
          {
            loader: "gltf-webpack-loader"
          }
        ]
      },
      {
        test: /\.(bin)$/,
        use: [
          {
            loader: 'file-loader',
            options: {}
          }
        ]
      },
      {
        test: /\.svg$/,
        use: [
          'babel-loader',
          'vue-svg-loader',
        ],
      },
      {
        test: /\.(gif|png|jpe?g)$/i,
        use: [
          'file-loader',
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true, // webpack@1.x
              disable: true, // webpack@2.x and newer
            },
          },
        ],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [
          'vue-style-loader',
          // Creates `style` nodes from JS strings
          'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      }
    ]
  }
}