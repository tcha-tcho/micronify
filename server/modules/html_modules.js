var mods = {};

var haml = require('hamljs');
mods.haml = function(input,options,callback){
  try {
    var result = haml.render(input.code,options);
    callback({error: false},result);
  } catch(e) {
    callback({error: e.message},input.code);
  };
}


var jade = require("jade");
mods.jade = function(input,options,callback){
  try {
    var result = jade.render(input.code, options);
    callback({error: false},result);
  } catch(e) {
    callback({error: e.message},input.code);
  };
};


var ejs = require("ejs");
mods.ejs = function(input,options,callback){
  try {
    var result = ejs.render(input.code, options);
    callback({error: false},result);
  } catch(e) {
    callback({error: e.message},input.code);
  };
};

var mustache = require("mustache");
mods.mustache = function(input,options,callback){
  try {
    var result = mustache.render(input.code, options);
    callback({error: false},result);
  } catch(e) {
    callback({error: e.message},input.code);
  };
};

var handlebars = require("handlebars");
mods.handlebars = function(input,options,callback){
  try {
    var template = handlebars.compile(input.code);
    var result = template(options);
    callback({error: false},result);
  } catch(e) {
    callback({error: e.message},input.code);
  };
};


var html_minifier = require('html-minifier').minify;
mods.html_minifier = function(input,options,callback){
  try {
    var result = html_minifier(input.code, options);
    callback({error: false},result);
  } catch(e) {
    callback({error: e.message},input.code);
  };
}

var beautify_html = require('js-beautify').html;
mods.beautify_html = function(input,options,callback){
  try {
    var result = beautify_html(input.code, options);
    callback({error: false},result);
  } catch(e) {
    callback({error: e.message},input.code);
  };
}

mods.datefy_html = function(input,options,callback){
  var result = options.before+(new Date())[options.method]()+options.after+input.code;
  callback({error: false},result);
}

module.exports = mods;
