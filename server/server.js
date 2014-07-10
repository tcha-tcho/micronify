var cluster = require('cluster')
var port = parseInt(process.env.PORT) || 3000;
var http = require('http')
var fs = require('fs')
var html = fs.readFileSync('server/index.html');
var uglify = require('uglify-js');

var mod = {};

mod.js = function(input,callback){
  try {
    var result = uglify.minify(input.code, {
      fromString: true
      // ,inSourceMap: "compiled.js.map"
      // ,outSourceMap: "minified.js.map"
    });
    callback(true,result);
  } catch(e) {
    callback(false,e.message);
  };
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
        mod[body.module](body,function(ok,output){
          if (ok) {
            res.writeHead(200, {'Content-Type': 'text/html'});
          } else {
            res.writeHead(500, {'Content-Type': 'text/html'});
          };
          res.end(JSON.stringify(output));
        })
      });
    } else {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.end(html);
    }
  }).listen(port);

  console.log("running server at PORT: " + port)
};
