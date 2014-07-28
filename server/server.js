var cluster = require('cluster')
var port = parseInt(process.env.PORT) || 3000;
var http = require('http')
var fs = require('fs')
var html = fs.readFileSync('server/index.html');

var mod = {};
      
var uglify = require('uglify-js');
mod.uglify = function(input,callback){
  try {
    var result = uglify.minify(input.code, {
      fromString: true
      // ,inSourceMap: "compiled.js.map"
      // ,outSourceMap: "minified.js.map"
    });
    callback(true,result.code);
  } catch(e) {
    callback(false,e.message);
  };
}

mod.test = function(input,callback){
  var result = "testing ok \n"+input.code;
  callback(true,result);
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
        body = JSON.parse(body);
        var mods = body.modules

        mods.forEach(function(modifier,index){

          mod[modifier](body,function(ok,output){
            if (!ok) res.writeHead(500, {'Content-Type': 'text/html'});
            body.code = output;
          });
          if ((index+1) == mods.length) {
            res.end(JSON.stringify(body));
          };

        })

      });
    } else {
      if (req.url == "/" || req.url == "/index.html" || req.url == "") {
        //TODO: cache all files
        res.writeHead(200, {'Content-Type': 'text/html'});
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
