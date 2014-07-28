
var micronify = {
  folders: [
    {
       "name"    :"/lib"
      ,"modules" :["uglify","test"]
      ,"filename":"testing.min.js"
      ,"header"  :"/* testing.js test */"
    }
    // {
    //    "name"    :"/old_files"
    //   ,"type"    :"css"
    //   ,"filename":"testing2.min.js"
    //   ,"header"  :"/* testing.js test */"
    // }
  ]
  ,server: "http://localhost:3000"
  ,utf8: true
};


["✓"]



  
var http        = require('http')
  , querystring = require('querystring')
  , url_parser  = require('url')
  , fs          = require("fs")
  , StringDecoder = require('string_decoder').StringDecoder;
  
(function(o){
  o.http = {};

  o.http.post = function(url, data, callback) {
    var parsed_data = JSON.stringify(data);
    var parsed_url = url_parser.parse(url);
    parsed_url.method = "POST";
    parsed_url.headers = {
       'Content-Type': 'application/json'
      ,'charset': 'UTF-8'
      ,'Content-Length': parsed_data?Buffer.byteLength(parsed_data, 'utf-8'):0
    };
    parsed_url.rejectUnauthorized = false;
    o.http.request(parsed_data, parsed_url, callback);
  };

  o.http.get = function(url, callback) {
    var parsed_url = url_parser.parse(url);
    parsed_url.method = "GET"
    o.http.request(null, parsed_url, callback);
  };

  
  o.http.request = function(data, opts, callback) {
    var res_ready;
    var req = http.request(opts, function(res) {
      res.on('data', function(d) {
        res_ready = d;
      });
      res.on('end', function(){
        callback(res_ready);
      });
    }).on('error', function(e) {
      console.log("erro http.js",e);
    });
    if (opts.method.toUpperCase()=='POST') req.write(data);
    req.end();
  };

})(micronify);











(function(o){

  o.process = function(folder,files,callback){
    var data = {
       "modules"   : folder.modules
      ,"code"      : files.join("")//pure code
      ,"utf8"      : o.utf8
      ,"source_map": ""//original file to debug
      ,"download"  : ""//this will return the file as download (filename)
      ,"header"    : folder.header
    };
    o.http.post(o.server,data,function(buf){
      var decoder = new StringDecoder('utf8');
      callback(JSON.parse(decoder.write(buf)));
    });
  }

  o.files = {};
  o.files.folders = {};

  o.files.registerFiles = function(folder,callback) {
    var files = o.files.list(__dirname+folder.name);
    files.sort();
    var counter = 0;
    (function read_file(){
      var file = files[counter];
      if (file && file[0]) {
        fs.readFile( file[2], function (err, data) {
          if (err) throw err;
          if (!o.files.folders[folder.name]) o.files.folders[folder.name] = [];
          o.files.folders[folder.name].push( data.toString() );
          counter ++;
          read_file();
        });
      } else {
        if (callback) callback(o.files.folders[folder.name]);
      }
    })();
  };

  o.files.list = function(dir) {
    var results = []
    var list = fs.readdirSync(dir)
    list.forEach(function(filename) {
      file = dir + '/' + filename
      var name = filename.split(".")[0];
      var stat = fs.statSync(file)
      if (stat && stat.isDirectory()) results = results.concat(o.files.list(file))
      else results.push([name, filename, file, dir]);
    });
    return results
  };


  o.folders.forEach(function(folder,i){
    o.files.registerFiles(folder,function(files){
      o.process(folder,files,function(processed){
        fs.writeFile(folder.filename, folder.header+"\n"+processed.code, function(err) {
          if(err) {
            console.log(err);
          } else {
            console.log("The file "+folder.filename+" was saved!");
          }
        }); 
      })
    });
  });

})(micronify);
