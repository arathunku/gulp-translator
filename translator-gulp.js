var fs = require('fs');
var through = require('through2');
var gutil = require('gulp-util');
var PluginError = gutil.PluginError;

var Translator = require("./lib/translator.js");

// consts
const PLUGIN_NAME = 'gulp-translator';

var plugin = function (localePath) {
  var translator = new Translator({
    localePath: localePath
  });

  return through.obj(function(file, enc, cb){
    if(file.isNull()) {
      this.push(file);
      return cb();
    }

    if(file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streaming not supported'));
      return cb();
    }

    file.contents = new Buffer(translator.translate(String(file.contents)));

    this.push(file);
    cb();
  });
};

module.exports = plugin;
