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

var stylus = require('stylus');
mods.stylus = function(input,options,callback){
  stylus.render(input.code, options, function(err, css){
    if (err) {
      callback({error: err},input.code);
    } else {
      callback({error: false},css);
    };
  });
};

var beautify_css = require('js-beautify').css;
mods.beautify_css = function(input,options,callback){
  try {
    var result = beautify_css(input.code, options);
    callback({error: false},result);
  } catch(e) {
    callback({error: e.message},input.code);
  };
}

var minify_css = require('clean-css');
mods.minify_css = function(input,options,callback){
  try {
    var result = new minify_css().minify(input.code);
    callback({error: false},result);
  } catch(e) {
    callback({error: e.message},input.code);
  };
}

mods.datefy_css = function(input,options,callback){
  var result = options.before+(new Date())[options.method]()+options.after+input.code;
  callback({error: false},result);
}

module.exports = mods;
