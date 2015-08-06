# Gulp Translator
> Almost like string replace but using locales
Now you can use both .json and .yml files.

## Usage

First, install `gulp-translator` as a development dependency:

```shell
npm install --save-dev gulp-translator
```

Then, add it to your `gulpfile.js`:

```javascript
var translate = require('gulp-translator');

gulp.task('translate', function() {
  var translations = ['pl', 'en'];

  translations.forEach(function(translation){
    gulp.src('app/views/**/*.html')
      .pipe(translate(options))
      .pipe(gulp.dest('dist/views/' + translation));
  });
});
```

or better, handle errors:
```javascript
gulp.task('translate', function() {
  var translations = ['pl', 'en'];

  translations.forEach(function(translation){
    gulp.src('app/views/**/*.html')
      .pipe(
        translate(options)
        .on('error', function(){
          console.error(arguments);
        })
      )
      .pipe(gulp.dest('dist/views/' + translation));
  });
});
```

## Options


`options` in `translate` function is:
  * `String` Path to locale file.
  * `Object`
    * `.localePath` String. Optional. Path to locale file.
    Or you can use `.lang`, `.localeDirectory`.
    * `.lang` String. Optional. Target language.
    * `.localeDirectory` String. Optional. Directory with locale files.
    If no `.localePath` specified, try construct it from `.localeDirectory + .lang`.
    * `.localeExt` String. Optional. If you specify path to file will transform
     `newLocalePath = oldLocalePath + .localExt`.
    * `.pattern` RegExp. Optional. Pattern to find strings to replace. You can specify your own pattern.
    To transform strings without translate.
    Default: `/\{{2}([\w\.\s\"\']+\s?\|\s?translate[\w\s\|]*)\}{2}/g`
    * `.patternSplitter` String. Some to split parts of transform. Default: `'|'`.
    * `.transform` Object. Every field is you transform function.
    First argument is an `content` to transform it.
    Second is an dictionary, that you specified.
    Function should return transformed string or `Error` object with some message.



## Usage

I'm using angular-like syntax. Expressions in `{{}}` with ` | translate `
filter will be translated.

Following examples assume that "title" in locales equals "new TITLE"

Example:
```
{{ title | translate }} will be change to "new TITLE"

```
If you'd like to use filters(look at the bottom to check available filters) just pass them after like that:

```
{{ title | translate | lowercase }} will be change to "new title"

```


```
{{ title | translate | uppercase }} will be change to "NEW TITLE"

```


If you're still not sure, please look at tests.

## API

gulp-translator is called with a string

### translate(string)

#### string
Type: `String`

The string is a path to a nameOfTheFile.yml with your locales. Please look at test/locales for examples.

## Available filters:

  - lowercase
  - uppercase
  - capitalize to capitalize only first word.
  - capitalizeEvery  to capitalize every word.
  - reverse

## User filters:

  You also can specify your own filters.
  Just add them to `.transform` parameter of `options`.
  First argument is an `content` to transform it.
  Second is an dictionary, that you specified.
  Function should return transformed string or `Error` object with some message.


## TODO:

  - refactor tests
  - work on matchers (sigh...)


# License
  MIT
