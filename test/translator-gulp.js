var File = require('vinyl');
var through = require('through2');
var assert = require('assert');
var Stream = require('stream');

var gulpTranslator = require('../translator-gulp.js');

describe('gulp-translator', function() {
  describe('with null contents', function() {
    it('should let null files pass through', function(done) {
      var translator = gulpTranslator('./test/locales/en.yml');
      var n = 0;

      var _transform = function(file, enc, callback) {
        assert.equal(file.contents, null);
        n++;
        callback();
      };

      var _flush = function(callback) {
        assert.equal(n, 1);
        done();
        callback();
      };

      var t = through.obj(_transform, _flush);
      translator.pipe(t);
      translator.end(new File({
        contents: null
      }));
    });
  });

  describe('with buffer contents', function() {
    it('should interpolate strings - ENGLISH', function(done) {
      var translator = gulpTranslator('./test/locales/en.yml');
      var n = 0;
      var content = new Buffer("{{ user.title }} {{title}}");
      var translated =  "ENGLISH USER TITLE Title";

      var _transform = function(file, enc, callback) {
        assert.equal(file.contents.toString('utf8'), translated);
        n++;
        callback();
      };

      var _flush = function(callback) {
        assert.equal(n, 1);
        done();
        callback();
      };

      var t = through.obj(_transform, _flush);
      translator.pipe(t);
      translator.end(new File({
        contents: content
      }));
    });

    it('should interpolate strings - POLISH', function(done) {
      var translator = gulpTranslator('./test/locales/pl.yml');
      var n = 0;
      var content = new Buffer("{{ user.title }} {{title}}");
      var translated = "POLSKI TYTUL Tytul";

      var _transform = function(file, enc, callback) {
        assert.equal(file.contents.toString('utf8'), translated);
        n++;
        callback();
      };

      var _flush = function(callback) {
        assert.equal(n, 1);
        done();
        callback();
      };

      var t = through.obj(_transform, _flush);
      translator.pipe(t);
      translator.end(new File({
        contents: content
      }));
    });
  });

  describe('with stream contents', function() {
    it('should emit errors', function(done) {
      var translator = gulpTranslator('./test/locales/en.yml');
      var content = Readable("{{ title }} {{title}}");

      var n = 0;

      var _transform = function(file, enc, callback) {
        n++;
        callback();
      };

      var _flush = function(callback) {
        assert.equal(n, 0);
        done();
        callback();
      };

      translator.on('error', function(err){
        assert.notEqual(err, null);
      });

      var t = through.obj(_transform, _flush);

      translator.pipe(t);
      translator.end(new File({
        contents: content
      }));
    });
  });
});

function Readable(content, cb){
  var readable = new Stream.Readable();
  readable._read = function() {
    this.push(new Buffer(content));
    this.push(null); // no more data
  };
  if (cb) readable.on('end', cb);
  return readable;
}
