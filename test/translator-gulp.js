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
    it('should interpolate strings  from *.yml locale file - ENGLISH', function(done) {
      var translator = gulpTranslator('./test/locales/en.yml');
      var n = 0;
      var content = new Buffer("{{ user.title | translate }} {{title | translate}}");
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

    it('should interpolate strings  from *.yml locale file - POLISH', function(done) {
      var translator = gulpTranslator('./test/locales/pl.yml');
      var n = 0;
      var content = new Buffer("{{ user.title | translate }} {{title | translate}}");
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

    it('should interpolate strings from *.json locale file - RUSSIAN', function(done) {
      var translator = gulpTranslator('./test/locales/ru.json');
      var n = 0;
      var content = new Buffer("{{ user.title | translate }} {{title | translate}}");
      var translated = "РУССКИЙ ЗАГОЛОВОК Заголовок";

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

    it("should throw error about undefined locale", function(done){
      var translator = gulpTranslator('./test/locales/pl.yml');
      var n = 0;
      var content = new Buffer("{{ unsupported | translate }}");

      var _transform = function(file, enc, callback) {
        n++;
        callback();
      };

      var _flush = function(callback) {
        assert.equal(n, 0);
        callback();
      };


      translator.on('error', function(err){
        assert.equal(err.message,
          'Error: No such content (unsupported) in locale file and is used in /path');
        done();
      });

      var t = through.obj(_transform, _flush);
      translator.pipe(t);
      translator.end(new File({
        path: '/path',
        contents: content
      }));
    });

    describe('filters', function() {
      it("should lowecase translated text", function(done){
        var translator = gulpTranslator('./test/locales/en.yml');
        var n = 0;
        var content = new Buffer("{{ title | translate }} {{title | translate | lowercase}}");
        var translated = "Title title";

        var _transform = function(file, enc, callback) {
          assert.equal(file.contents.toString('utf8'), translated);
          n++;
          callback();
          done();
        };

        var _flush = function(callback) {
          assert.equal(n, 1);
          callback();
        };

        var t = through.obj(_transform, _flush);
        translator.pipe(t);
        translator.end(new File({
          contents: content
        }));
      });

      it("should uppercase translated text", function(done){
        var translator = gulpTranslator('./test/locales/en.yml');
        var n = 0;
        var content = new Buffer("{{ title | translate }} {{title | translate | uppercase}}");
        var translated = "Title TITLE";

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






      it("should capitalize translated text", function(done){
        var translator = gulpTranslator('./test/locales/en.yml');
        var n = 0;
        var content = new Buffer("{{ title | translate }} {{user.title | translate | capitalize}}");
        var translated = "Title English user title";

        var _transform = function(file, enc, callback) {
          assert.equal(file.contents.toString('utf8'), translated);
          n++;
          callback();
          done();
        };

        var _flush = function(callback) {
          assert.equal(n, 1);
          callback();
        };

        var t = through.obj(_transform, _flush);
        translator.pipe(t);
        translator.end(new File({
          contents: content
        }));
      });

      it("should capitalize every word in translated text", function(done){
        var translator = gulpTranslator('./test/locales/en.yml');
        var n = 0;
        var content = new Buffer("{{ title | translate }} {{user.title | translate | capitalizeEvery}}");
        var translated = "Title English User Title";

        var _transform = function(file, enc, callback) {
          assert.equal(file.contents.toString('utf8'), translated);
          n++;
          callback();
          done();
        };

        var _flush = function(callback) {
          assert.equal(n, 1);
          callback();
        };

        var t = through.obj(_transform, _flush);
        translator.pipe(t);
        translator.end(new File({
          contents: content
        }));
      });

      it("should reverse translated text", function(done){
        var translator = gulpTranslator('./test/locales/en.yml');
        var n = 0;
        var content = new Buffer("{{ title | translate }} {{user.title | translate | reverse}}");
        var translated = "Title ELTIT RESU HSILGNE";

        var _transform = function(file, enc, callback) {
          assert.equal(file.contents.toString('utf8'), translated);
          n++;
          callback();
          done();
        };

        var _flush = function(callback) {
          assert.equal(n, 1);
          callback();
        };

        var t = through.obj(_transform, _flush);
        translator.pipe(t);
        translator.end(new File({
          contents: content
        }));
      });













      it("should throw error if unsupported filter", function(done){
        var translator = gulpTranslator('./test/locales/en.yml');
        var n = 0;
        var content = new Buffer("{{ title | translate }} {{title | translate | unsupported}}");

        var _transform = function(file, enc, callback) {
          assert.equal(file.contents.toString('utf8'), translated);
          n++;
          callback();
        };

        var _flush = function(callback) {
          assert.equal(n, 0);
          callback();
        };

        translator.on('error', function(err){
          assert.equal(err.message, 'Error: unsupported filter is not supported and is used in /path');
          done();
        });

        var t = through.obj(_transform, _flush);
        translator.pipe(t);
        translator.end(new File({
          path: '/path',
          contents: content
        }));
      });
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
        callback();
      };

      translator.on('error', function(err){
        assert.equal(err.message, "Streaming not supported");
        done();
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
