var utils = {};

utils.extend = function() {
  var a = arguments;
  for(var i=1,l = a.length; i<l; i++)
    for(var key in a[i])
      if(a[i].hasOwnProperty(key))
        a[0][key] = a[i][key];
  return a[0];
};

module.exports = utils;
