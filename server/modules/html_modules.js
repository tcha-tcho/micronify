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

mods.haml_compile = function(input,options,callback){
  try {
    var result = haml.compile(input.code, options);
    callback({error: false},result);
  } catch(e) {
    callback({error: e.message},input.code);
  };
}
// haml.filters.my_filter = function(str) {
//   return doSomethingWith(str)
// }

module.exports = mods;
