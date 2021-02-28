const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TinyimgPlugin = require('tinyimg-webpack-plugin');

module.exports = {
  mode: 'none',
  entry: {
    main: './js/functional.js',
    pets: './js/pets.js'
  },
  output: {
    filename: './js/[name].[contenthash].js',
    path: path.resolve(__dirname, 'ready'),
    publicPath: ''
  },
  plugins: [
    new HTMLWebpackPlugin({
      filename: 'index.html',
      template: './index.html',
      chunks: ['main'],
      minify: {collapseWhitespace: true}
    }),
    new HTMLWebpackPlugin({
      filename: 'pets.html',
      template: './pets.html',
      chunks: ['pets'],
      minify: {collapseWhitespace: true}
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: ({chunk}) => `./css/${chunk.name}/[name].[contenthash].css`
    }),
    new TinyimgPlugin({
      enabled: true,
      logged: true
    }),
    new CopyWebpackPlugin({
      patterns: [
        {from: './src', to: path.resolve(__dirname, 'ready/src')},
        {from: './img/database-img', to: path.resolve(__dirname, 'ready/img/database-img')},
        {from: './img/icon/icon_map.svg', to: path.resolve(__dirname, 'ready/img/icon/')},
        {from: './img/icon/icon_map-active.svg', to: path.resolve(__dirname, 'ready/img/icon/')}
      ]
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [{
          loader: MiniCssExtractPlugin.loader,
          options: {
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
          filename: './img/[name].[contenthash].[ext]'
        }
      },
      {
        test: /\.(?:|svg)$/i,
        type: 'asset/resource',
        generator: {
          filename: './img/icon/[name].[contenthash].[ext]'
        }
      },
      {
        test: /\.(?:|woff2|woff)$/i,
        type: 'asset/resource',
        generator: {
          filename: './fonts/[name].[contenthash].[ext]'
        }
      }
    ]
  },
  optimization: {
    minimize: true,
    minimizer: [
      new CssMinimizerPlugin(),
      new TerserWebpackPlugin()
    ]
  }
};