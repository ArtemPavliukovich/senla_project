const isDevelopment = process.env.NODE_ENV === 'development';

const getFileName = (type = '[ext]') => isDevelopment ? `[name]${type}` : `[name].[contenthash]${type}`;

const path = require('path');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TinyImgPlugin = require('tinyimg-webpack-plugin');

module.exports = {
  mode: isDevelopment ? 'development' : 'production',
  entry: {
    main: isDevelopment ? [
      'webpack-dev-server/client?http://localhost:9001',
      'webpack/hot/dev-server',
      './js/functional.js'
    ] : './js/functional.js',
    pets: isDevelopment ? [
      'webpack-dev-server/client?http://localhost:9001',
      'webpack/hot/dev-server',
      './js/pets.js'
    ] : './js/pets.js'
  },
  output: {
    filename: `./js/${getFileName('.js')}`,
    path: path.resolve(__dirname, 'app'),
    publicPath: ''
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'app'),
    open: true,
    compress: true,
    hot: true,
    port: 9001
  },
  devtool: isDevelopment ? 'source-map' : false,
  plugins: [
    new HTMLWebpackPlugin({
      filename: 'index.html',
      template: './index.html',
      chunks: ['main'],
      minify: {collapseWhitespace: !isDevelopment}
    }),
    new HTMLWebpackPlugin({
      filename: 'pets.html',
      template: './pets.html',
      chunks: ['pets'],
      minify: {collapseWhitespace: !isDevelopment}
    }),
    new MiniCssExtractPlugin({
      filename: ({chunk}) => `./css/${chunk.name}/${getFileName('.css')}`
    }),
    new TinyImgPlugin({
      enabled: !isDevelopment,
      logged: true
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [
        {from: './src', to: path.resolve(__dirname, 'app/src')},
        {from: './img/database-img', to: path.resolve(__dirname, 'app/img/database-img')},
        {from: './img/icon/icon_map.svg', to: path.resolve(__dirname, 'app/img/icon/')},
        {from: './img/icon/icon_map-active.svg', to: path.resolve(__dirname, 'app/img/icon/')}
      ]
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [{
          loader: MiniCssExtractPlugin.loader,
          options: isDevelopment ? {
            publicPath: '/'
          } : {
            publicPath: (resourcePath, context) => {
              return path.relative(path.dirname(resourcePath), context) + '/';
            }
          }
        },
        'css-loader',
        'postcss-loader']
      },
      { 
        test: /\.html$/,
        use: [{
          loader: 'html-loader',
          options: {
            sources: {
              list: [
                {
                  tag: 'img',
                  attribute: 'src',
                  type: 'src'
                },
                {
                  tag: 'link',
                  attribute: 'href',
                  type: 'src'
                }
              ]
            },
            esModule: false
          }
        }]
      },
      {
        test: /\.js$/i,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(?:|png|jpg|jpeg)$/i,
        type: 'asset/resource',
        generator: {
          filename: `./img/${getFileName()}`
        }
      },
      {
        test: /\.(?:|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: `./img/icon/${getFileName('.svg')}`
        }
      },
      {
        test: /\.(?:|woff2|woff)$/i,
        type: 'asset/resource',
        generator: {
          filename: `./fonts/${getFileName()}`
        }
      }
    ]
  },
  optimization: {
    minimize: !isDevelopment,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserWebpackPlugin()
    ]
  }
};