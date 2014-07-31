var cluster = require('cluster')
var port = parseInt(process.env.PORT) || 3000;
var http = require('http')
var fs = require('fs')
var html = fs.readFileSync('server/website/index.html');


var utils      = require('./utils.js');
var javascript = require('./modules/js_modules.js');
var CSS        = require('./modules/css_modules.js');
var HTML       = require('./modules/html_modules.js');
var defaults   = require('./modules/defaults.js');
var mod        = utils.extend(defaults, javascript, CSS, HTML);//The modules colide


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
        var mods = body.modules
        body.modules = {};

        mods.forEach(function(modifier,index){

          if (mod[modifier[0]]) {
            try {
              var options = utils.extend(mod.defaults[modifier[0]],modifier[1]);
              mod[modifier[0]](body,options,function(details,output){
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
        html = fs.readFileSync('server/website/index.html');
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
