const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ImageminPlugin = require('imagemin-webpack');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

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
      filename: './css/[name].[contenthash].css'
    }),
    new ImageminPlugin({
      bail: false,
      cache: true,
      imageminOptions: {
        plugins: [
          ['gifsicle', { interlaced: true }],
          ['jpegtran', { progressive: true }],
          ['optipng', { optimizationLevel: 5 }],
          [
            'svgo',
            {
              plugins: [
                {
                  removeViewBox: false
                }
              ]
            }
          ]
        ]
      }
    }),
    new CopyWebpackPlugin({
      patterns: [
        {from: './src', to: path.resolve(__dirname, 'ready/src')}
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
        'css-loader']
      },
      {
        test: /\.(?:|png|jpg|jpeg)$/i,
        use: [{
          loader: 'file-loader',
          options: {
            name: `./img/[name].[ext]`
          }
        }]
      },
      {
        test: /\.(?:|svg)$/i,
        use: [{
          loader: 'file-loader',
          options: {
            name: `./img/icon/[name].[ext]`
          }
        }]
      },
      {
        test: /\.(?:|woff2|woff)$/i,
        use: [{
          loader: 'file-loader',
          options: {
            name: `./fonts/[name].[contenthash].[ext]`
          }
        }]
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