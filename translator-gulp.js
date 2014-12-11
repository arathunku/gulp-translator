var through = require('through2');
var gutil = require('gulp-util');
var glob = require("glob");
var PluginError = gutil.PluginError;
var Q = require('q');
var Path = require('path');
var Translator = require("./lib/translator.js");
var File = require('vinyl');

// consts
const PLUGIN_NAME = 'gulp-translator';

function parsePath(path) {
  var extname = Path.extname(path);
  return {
    dirname: Path.dirname(path),
    basename: Path.basename(path, extname),
    extname: extname
  };
}

var plugin = function (localePath, options) {
  var replaceString = (options) ? options.replace : null;

  var translations = glob.sync(localePath);
  var translators = [];
  translations.forEach(function(item){
    translators.push(new Translator({
      localePath: item
    }));
  });


  var stream = through.obj(function(file, enc, cb){
    var self = this;

    if(file.isNull()) {
      stream.push(file);
      return cb();
    }

    if(file.isStream()) {
      stream.emit('error', new PluginError(PLUGIN_NAME, 'Streaming not supported'));
      return cb();
    }

    var parsedPath = parsePath(file.relative);
    var p = Path.join(parsedPath.dirname, parsedPath.basename + parsedPath.extname);

    var promises = [];
    translators.forEach(function(translator){
      promises.push(translator.translate(String(file.contents)));
    });

    Q.all(promises).then(function(item){
      item.forEach(function(obj){
        var path = file.path;

        if(replaceString !== null){
          path = path.replace(replaceString, obj.locale);
        }else{

          var p = parsePath(file.path).basename;
          path = file.path.replace(p, p + obj.locale)
        }

        stream.push(new File({
          cwd: file.cwd,
          base: file.base,
          path: path,
          contents: new Buffer(obj.value)
        }));
      });
      cb();
    }, function(error){
      stream.emit('error', new PluginError(PLUGIN_NAME, (error||'') + " and is used in " + file.path));
      return cb();
    });
  });

  return stream;
};

module.exports = plugin;
