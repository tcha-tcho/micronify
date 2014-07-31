var mods = {};
mods.defaults = {
   "coffeescript": {}
  ,"jslint": {}
  ,"jshint": {}
  ,"uglify": {
    fromString: true
    // ,inSourceMap: "compiled.js.map"
    // ,outSourceMap: "minified.js.map"
  }
  ,"beautify": {
    indent_size: 2
  }
  ,"datefy": {
     method: "toGMTString" //toDateString, toGMTString, toISOString, toJSON, toLocaleDateString, toLocaleTimeString, toTimeString, toUTCString
    ,before: "// "
    ,after: "\n"
  }
};

module.exports = mods;