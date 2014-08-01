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
  ,"datefy_html": {
     method: "toGMTString"
    ,before: "<!-- "
    ,after: " -->\n"
  }
  ,"html_minifier": {
     removeComments:true
    ,removeCommentsFromCDATA:false
    ,removeCDATASectionsFromCDATA:false
    ,collapseWhitespace:true
    ,conservativeCollapse:false
    ,collapseBooleanAttributes:true
    ,removeAttributeQuotes:true
    ,removeRedundantAttributes:true
    ,useShortDoctype:true
    ,removeEmptyAttributes:true
    ,removeOptionalTags:true
    ,removeEmptyElements:false
    ,lint:false
    ,keepClosingSlash:false
    ,caseSensitive:false
    ,minifyJS:false
    ,minifyCSS:true
    ,ignoreCustomComments:false
    ,processScripts:false
    ,maxLineLength:false
    ,customAttrAssign:[]
    ,customAttrSurround:[]
  }
};

module.exports = mods;