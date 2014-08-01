var mods = {};

var haml = require('haml');
mods.haml = function(input,options,callback){
  // try {
    console.log(haml.render,input.code);
    var result = haml.render(input.code);
    console.log(result)
    callback({error: false},result);
  // } catch(e) {
  //   console.log(e)
  //   callback({error: e.message},input.code);
  // };
}

mods.haml_js = function(input,options,callback){
  try {
    var result = haml.compile(input.code, options);
    callback({error: false},result);
  } catch(e) {
    callback({error: e.message},input.code);
  };
}

module.exports = mods;
