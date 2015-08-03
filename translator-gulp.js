var fs = require('fs');
var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

var Translator = require("./lib/translator.js");

const PLUGIN_NAME = 'gulp-translator';

var plugin = function (options) {
  var translator = new Translator(options);

  return through.obj(function(file, enc, cb){
    var self = this;

    if(file.isNull()) {
      this.push(file);
      return cb();
    }

    if(file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streaming not supported'));
      return cb();
    }
    translator.translate(String(file.contents)).then(function(content){
      file.contents = new Buffer(content);
      self.push(file);
      return cb();

    }, function(error){
      self.emit('error', new PluginError(PLUGIN_NAME, (error||'') + " and is used in " + file.path));
      return cb();
    });
  });
};

module.exports = plugin;
