
### 在HTML-webpack-plugin 中自定义静态资源的位置
-----------------------
[![Build Status](https://travis-ci.org/tengmaoqing/html-webpack-custom-position.svg?branch=master)](https://travis-ci.org/tengmaoqing/html-webpack-custom-position)

npm安装
------------
```shell
$ npm install --save-dev html-webpack-custom-position
```

基本用法
------------
require插件：
```javascript
const HtmlWebpackCustomPosition = require('html-webpack-custom-position');
```
在webpack插件配置中中添加：
```javascript
plugins: [
  new HtmlWebpackPlugin(),
  new HtmlWebpackCustomPosition()
]
```
因为没有配置参数，上面的写法没有任何影响。

一般使用场景是将控制css相关的js代码提前到head里面执行，从而可以避免页面闪屏。
```javascript
const webpackConfig = {
  entry: {
    fontSize: 'flexible.js'
  },
  ...
  plugins: [
    new HtmlWebpackPlugin(),
    new HtmlWebpackCustomPosition({
      head: ['fontSize']
    })
  ]
}

```

可配置选项
-------
- `head`: `array`
  数组里面的选项应该对应于对应于entry的key，或者来自于ExtractTextPlugin的filename字段值
- `body`: `array`
  同上


更多例子
-------
将 css 放到body最后，同时将 js 放到head中间
```javascript
  const webpackConfig = {
  entry: {
    fontSize: 'flexible.js'
  },
  ...
  plugins: [
    new ExtractTextPlugin({
      filename: 'style.css'
    }),
    new HtmlWebpackPlugin(),
    new Custom({
      body: ['\.css$'],
      head: ['fontSize']
    })
  ]
}
```
执行结果如下
```HTML
<head>
    <meta charset="UTF-8">
    <title>Webpack App</title>
  <script type="text/javascript" src="fontSize.js"></script></head>
  <body>
  <link href="style.css" rel="stylesheet">
</body>
```


注意
-------
由于自定义之后的资源已经失去了正确的引用关系，可能会报错找不到webpackjson方法。 如果使用`webpack.optimize.CommonsChunkPlugin `的时候将自定义位置的资源也包含进去，则运行时会报错。解决办法是不要对该资源进行公共代码抽离。

```javascript
  new webpack.optimize.CommonsChunkPlugin({
    chunks: ['js/app', 'js/view', /** 'js/fontSize' **/], // 不要对js/fontSize进行代码抽离
    names: ['js/vendor']
  }),
```

将JS代码前置后，一般配合 html-webpack-inline-source-plugin 将资源写入行内，从而加快页面渲染速度
