"use strict";
const webpack = require('webpack');
const path = require('path');
//const loaders = require('./webpack.loaders');

//const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

// Export with webpack 

module.exports = {
  // the entry file for the bundle
  entry: [path.join(__dirname, '/client/src/app.jsx')],
  // the bundle file we will get in the result
  output: {
    path: path.join(__dirname, '/client/dist/js'),
    filename: 'app.js',
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        include: path.join(__dirname, '/client/src'),
        exclude: '/node_modules/',
        loader: 'babel',
        query: {
          presets: ["react", "es2015"]
        }
      }
    ],
    rules: [
      /*
      your other rules for JavaScript transpiling go in here
      */
      // { // regular css files
      //   test: /\.css$/,
      //   loader: ExtractTextPlugin.extract({
      //     loader: 'css-loader?importLoaders=1',
      //   }),
      // },
      // { // sass / scss loader for webpack
      //   test: /\.(sass|scss)$/,
      //   loader: ExtractTextPlugin.extract(['css-loader', 'sass-loader'])
      // }
      // ,
      // {
      //   test: /\.(png|jpg|gif|svg)$/,
      //   loader: 'file-loader',
      //   options: {
      //     name: '[name].[ext]?[hash]'
      //   }
      // }
    ]
  },
  // plugins: [
  //   new ExtractTextPlugin({ // define where to save the file
  //     filename: 'client/dist/css/site.bundle.css',
  //     allChunks: true,
  //   }),
  // ],
  watch: true
};


