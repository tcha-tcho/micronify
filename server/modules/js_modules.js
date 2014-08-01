var mods = {};


mods.not_available = function(input,options,callback){
  callback({error: "Not Available"}, input.code);
}



var coffeescript = require('coffee-script');
mods.coffeescript = function(input,options,callback){
  try {
    var result = coffeescript.compile(input.code, options);
    callback({error: false, map: result.map},result);
  } catch(e) {
    callback({error: e.message},input.code);
  };
}



var jslint = require('atropa-jslint');
mods.jslint = function(input,options,callback){
  try {
    var result = jslint.JSLINT(input.code);
    if(result) {
      callback({error: false},input.code);
    } else {
      callback({error: jslint.JSLINT.errors},input.code);
    }
  } catch(e) {
    callback({error: e.message},input.code);
  };
}



var jshint = require("jshint");
mods.jshint = function(input,options,callback){
  try {
    var hint = jshint.JSHINT;
    if(hint(input.code)) {
      callback({error: false},input.code);
    } else {
      var out = hint.data();
      callback({error: out.errors},input.code);
    }
  } catch(e) {
    callback({error: e.message},input.code);
  };
}



var uglify = require('uglify-js');
mods.uglify = function(input,options,callback){
  try {
    var result = uglify.minify(input.code, options);
    callback({error: false, map: result.map},result.code);
  } catch(e) {
    callback({error: e.message},input.code);
  };
}



// var beautify_css = require('js-beautify').css;
// var beautify_html = require('js-beautify').html;
var beautify = require('js-beautify').js;
mods.beautify = function(input,options,callback){
  try {
    var result = beautify(input.code, options);
    callback({error: false},result);
  } catch(e) {
    callback({error: e.message},input.code);
  };
}



mods.datefy = function(input,options,callback){
  var result = options.before+(new Date())[options.method]()+options.after+input.code;
  callback({error: false},result);
}



module.exports = mods;
