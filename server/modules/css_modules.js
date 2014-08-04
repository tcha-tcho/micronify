var mods = {};

var sass = require('node-sass');
mods.sass_scss = function(input,options,callback){
  var stats = {};
  var result = sass.render({
      data: input.code,
      success: function(css) {
        callback({error: false, stats: stats},css);
      },
      error: function(error) {
        callback({error: error, note:"node-sass do not accept sass, just scss :("},input.code);
      },
      includePaths: [],
      outputStyle: options.outputStyle,
      stats: stats
  });
};

var less = require('less');
mods.less = function(input,options,callback){
  //TODO: less options?
  less.render(input.code, function (e, css) {
    if (e) {
      callback({error: e},input.code);
    } else {
      callback({error: false},css);
    };
  });
};

module.exports = mods;
