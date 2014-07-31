var cluster = require('cluster')
var port = parseInt(process.env.PORT) || 3000;
var http = require('http')
var fs = require('fs')
var html = fs.readFileSync('server/index.html');

var mod = {};

//JAVASCRIPT      
var coffeescript = require('coffee-script');
mod.coffeescript = function(input,options,callback){
  try {
    var result = coffeescript.compile(input.code, {
    });
    callback({error: false, map: result.map},result);
  } catch(e) {
    callback({error: e.message},input.code);
  };
}

var uglify = require('uglify-js');
mod.uglify = function(input,options,callback){
  try {
    var result = uglify.minify(input.code, {
      fromString: true
      // ,inSourceMap: "compiled.js.map"
      // ,outSourceMap: "minified.js.map"
    });
    callback({error: false, map: result.map},result.code);
  } catch(e) {
    callback({error: e.message},input.code);
  };
}


var jslint = require('atropa-jslint');
mod.jslint = function(input,options,callback){
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
mod.jshint = function(input,options,callback){
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

mod.datefy = function(input,options,callback){
  var result = "// "+(new Date()).toGMTString()+" :-)\n"+input.code;
  callback({error: false},result);
}

if ( cluster.isMaster ) {
  var processes = port == 3000?1:4;
  for ( var i=0; i<processes; ++i ) cluster.fork();
  cluster.on('exit', function(worker, code, signal) {
    if (port != 3000) {
      var exitCode = worker.process.exitCode;
      console.log('worker ' + worker.process.pid + ' died ('+exitCode+'). restarting...');
      cluster.fork();
    };
  });
} else {
  http.createServer(function (req, res) {
    if (req.method == 'POST') {
      var body = '';
      req.on('data', function (data) {
        body += data;
      });
      req.on('end', function () {
        try {
          body = JSON.parse(decodeURIComponent(body));
        } catch(e) {
          var splits = body.split('&');
          var hash = {};
          for (i = 0; i < splits.length; i++) {
            var iSplit = splits[i].split('=');
            hash[iSplit[0]] = decodeURIComponent(iSplit[1]);
            if (iSplit[0] == "modules") {
              hash[iSplit[0]] = JSON.parse(hash[iSplit[0]]);
            }
          }
          body = hash;
        }
        console.log(body)
        var mods = body.modules
        body.modules = {};

        mods.forEach(function(modifier,index){

          if (mod[modifier[0]]) {
            try {
              mod[modifier[0]](body,modifier[1],function(details,output){
                body.modules[modifier[0]] = details;
                body.code = output;
              });
            } catch (e) {
              body.modules[modifier[0]] = {error: e};
            }
          } else {
            body.modules[modifier[0]] = {error: "Not Available"};
          };
          if ((index+1) == mods.length) {
            var header = (body.header || "");
            if (header) body.code = header+"\n"+body.code;
            res.end(JSON.stringify(body));
          };

        })

      });
    } else {
      if (req.url == "/" || req.url == "/index.html" || req.url == "") {
        //TODO: cache all files
        res.writeHead(200, {'Content-Type': 'text/html'});
        html = fs.readFileSync('server/index.html');
        res.end(html);
      } else {
        fs.readFile('server'+req.url.split("?")[0],function(err,data){
          if (err) {
            res.writeHead(500, {'Content-Type': 'text/html'});
            res.end("<html><head></head><body>File not found</body></html>");
          } else {
            res.writeHead(200);
            res.end(data);
          };
        });
      };
    }
  }).listen(port);

  console.log("running server at PORT: " + port)
};
