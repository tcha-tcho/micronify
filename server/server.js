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
          body = JSON.parse(utils.fixed_JSON(decodeURIComponent(body)));
        } catch(e) {
          var splits = body.split('&');
          var hash = {};
          for (i = 0; i < splits.length; i++) {
            var iSplit = splits[i].split('=');
            hash[iSplit[0]] = decodeURIComponent(iSplit[1]);
            if (iSplit[0] == "modules") {
              hash[iSplit[0]] = hash[iSplit[0]].split(",");
            };
            if (iSplit[0] == "options") {
              hash[iSplit[0]] = JSON.parse(utils.fixed_JSON(hash[iSplit[0]]));
            };
          };
          body = hash;
        }
        var mods = body.modules
        body.modules = {};
        body.options = (body.options || {});
        var index = 0;

        function process_mod() {
          var modifier = mods[index];
          var use_mod = !mod[modifier]?"not_available":modifier;
          var options = utils.extend(mod.defaults[modifier],body.options[modifier]);
          mod[use_mod](body,options,function(details,output){
            body.modules[modifier] = details;
            body.code = output;
            if ((index+1) == mods.length) {
              var header = (body.header || "");
              if (header) body.code = header+"\n"+body.code;
              res.end(JSON.stringify(body));
            } else {
              index ++;
              process_mod();
            };
          });
        };
        process_mod();

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
