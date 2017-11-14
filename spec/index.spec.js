/*
* @Author: Elvmx
* @Date:   2017-11-14 10:36:25
* @Last Modified by:   tengmaoqing
* @Last Modified time: 2017-11-14 16:08:07
*/
const webpack = require('webpack');
const rm_rf = require('rimraf');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const fs = require('fs');
const cheerio = require('cheerio');
const { isNumber } = require('../test.js');
const Custom = require('../');

const OUTPUT_DIR = path.join(__dirname, '../dist');

describe('HTMLWebpackCustomPosition', () => {

  beforeEach(done => {
    rm_rf(OUTPUT_DIR, done);
  });

  it('默认情况下，js应该在body后面， css在head里面', done => {
    webpack({
      entry: path.join(__dirname, 'test', 'entry.js'),
      output: {
        filename: 'app.js',
        path: OUTPUT_DIR
      },
      module: {
        rules: [
          {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
              fallback: "style-loader",
              use: ['css-loader']
            })
          },
        ]
      },
      plugins: [
        new ExtractTextPlugin({
          filename: 'style.css'
        }),
        new HtmlWebpackPlugin(),
      ],
    }, err => {
      expect(err).toBeFalsy();
      const htmlFile = path.resolve(OUTPUT_DIR, 'index.html');
      fs.readFile(htmlFile, 'utf8', function (er, data) {
        expect(er).toBeFalsy();
        var $ = cheerio.load(data);
        expect($('head script').length).toBe(0);
        expect($('body script').length).toBe(1);
        expect($('body link').length).toBe(0);
        expect($('head link').length).toBe(1);
        done();
      });
    })
  });

  it('指定js在head里面', done => {
    webpack({
      entry: {
        app: path.join(__dirname, 'test', 'entry.js')
      },
      output: {
        filename: 'app.js',
        path: OUTPUT_DIR
      },
      module: {
        rules: [
          {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
              fallback: "style-loader",
              use: ['css-loader']
            })
          },
        ]
      },
      plugins: [
        new ExtractTextPlugin({
          filename: 'style.css'
        }),
        new HtmlWebpackPlugin(),
        new Custom({
          head: ['app']
        })
      ],
    }, err => {
      expect(err).toBeFalsy();
      const htmlFile = path.resolve(OUTPUT_DIR, 'index.html');
      fs.readFile(htmlFile, 'utf8', function (er, data) {
        expect(er).toBeFalsy();
        var $ = cheerio.load(data);
        expect($('head script').length).toBe(1);
        expect($('body script').length).toBe(0);
        expect($('head script[src="app.js"]').length).toBe(1);
        done();
      });
    })
  });

  it('指定css在body里面', done => {
    webpack({
      entry: {
        app: path.join(__dirname, 'test', 'entry.js')
      },
      output: {
        filename: 'app.js',
        path: OUTPUT_DIR
      },
      module: {
        rules: [
          {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
              fallback: "style-loader",
              use: ['css-loader']
            })
          },
        ]
      },
      plugins: [
        new ExtractTextPlugin({
          filename: 'style.css'
        }),
        new HtmlWebpackPlugin(),
        new Custom({
          body: ['style']
        })
      ],
    }, err => {
      expect(err).toBeFalsy();
      const htmlFile = path.resolve(OUTPUT_DIR, 'index.html');
      fs.readFile(htmlFile, 'utf8', function (er, data) {
        expect(er).toBeFalsy();
        var $ = cheerio.load(data);
        expect($('head link').length).toBe(0);
        expect($('body link[href="style.css"]').length).toBe(1);
        done();
      });
    })
  });

  it('css使用正则表达式指定在body里面,并且JS在head', done => {
    webpack({
      entry: {
        app: path.join(__dirname, 'test', 'entry.js')
      },
      output: {
        filename: 'app.js',
        path: OUTPUT_DIR
      },
      module: {
        rules: [
          {
            test: /\.css$/,
            use: ExtractTextPlugin.extract({
              fallback: "style-loader",
              use: ['css-loader']
            })
          },
        ]
      },
      plugins: [
        new ExtractTextPlugin({
          filename: 'style.css'
        }),
        new HtmlWebpackPlugin(),
        new Custom({
          body: ['\.css$'],
          head: ['app']
        })
      ],
    }, err => {
      expect(err).toBeFalsy();
      const htmlFile = path.resolve(OUTPUT_DIR, 'index.html');
      fs.readFile(htmlFile, 'utf8', function (er, data) {
        expect(er).toBeFalsy();
        var $ = cheerio.load(data);
        expect($('head link').length).toBe(0);
        expect($('body link[href="style.css"]').length).toBe(1);
        expect($('head script').length).toBe(1);
        expect($('head script[src="app.js"]').length).toBe(1);
        done();
      });
    })
  });

  it('should return true', done => {
    expect(isNumber(2)).toBe(true);
    expect(isNumber(0)).toBe(true);
    expect(isNumber(Infinity)).toBe(true);
    done();
  });
});
