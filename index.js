/*
* @Author: Elvmx
* @Date:   2017-11-10 17:01:47
* @Last Modified by:   Elvmx
* @Last Modified time: 2017-11-14 14:24:08
*/

function customFilePlace(options) {
  // Configure your plugin with options...
  this.head = options.head || [];
  this.body = options.body || [];
}

customFilePlace.prototype.apply = function(compiler) {
  // ...
  compiler.plugin('compilation', (compilation) => {

    compilation.plugin('html-webpack-plugin-before-html-processing', (htmlPluginData, callback) => {
      // console.log(htmlPluginData.assets);
      this.chunks = htmlPluginData.assets.chunks;
      this.CSSs = htmlPluginData.assets.css;
      callback(null, htmlPluginData);
    });

    compilation.plugin('html-webpack-plugin-alter-asset-tags', (htmlPluginData, callback) => {
      const heads = htmlPluginData.head;
      const body = htmlPluginData.body;
      const changeHeads = [];
      const changeBody = [];

      this.head.forEach(chunk => {
        const chunkObj = this.chunks[chunk];
        if (!chunkObj) {
          return;
        }
        const entry = chunkObj.entry;  // ./js/manifest.28e35468.js
        // const tag1 = this.findTagFromTags(entry, heads, 'href');
        const tagID = this.findTagFromTags(entry, body);
        const removedTag = body.splice(tagID, 1)[0];
        changeHeads.push(removedTag);
      });

      this.body.forEach(chunk => {
        // const chunkObj = this.chunks[chunk];
        // if (!chunkObj) {
        //   return;
        // }
        // const entry = chunkObj.entry;  // ./js/manifest.28e35468.js
        const outputAsset = this.getAsset(chunk);
        if (!outputAsset) {
          return;
        }
        // const tag1 = this.findTagFromTags(entry, heads, 'href');
        const tagID = this.findTagFromTags(outputAsset, heads);
        const removedTag = heads.splice(tagID, 1)[0];
        changeBody.push(removedTag);
      });

      htmlPluginData.head = heads.concat(changeHeads);
      htmlPluginData.body = body.concat(changeBody);

      callback(null, htmlPluginData);
    });
  });

};

customFilePlace.prototype.findTagFromTags = function (fpath, tages) {
  return tages.findIndex(tag => {
    return tag.attributes.src === fpath || tag.attributes.href === fpath;
  });
};

customFilePlace.prototype.getAsset = function (chunk) {
  return this.CSSs.find(css => new RegExp(chunk).test(css));
}

module.exports = customFilePlace;
