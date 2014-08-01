var mods = {};

var sass = require('node-sass');
mods.sass = function(input,options,callback){
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

module.exports = mods;
