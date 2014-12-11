# Gulp Translator
> Almost like string replace but using locales

## Usage

First, install `gulp-translator` as a development dependency:

```shell
npm install --save-dev gulp-translator
```

Then, add it to your `gulpfile.js`:

```javascript
var translate = require('gulp-translator');

gulp.task('translate', function() {
  gulp.src('app/views/**/*.tpl.html')
    .pipe(translate('./locales/*.yml'))
    .pipe(gulp.dest('dist/views/'));
});
```

or better, handle errors:
```javascript
gulp.task('translate', function() {

  gulp.src('app/views/**/*.html')
    .pipe(
      gulpTranslateTemplate('./locales/*.yml')
      .on('error', function(){
        console.dir(arguments);
      })
    )
    .pipe(gulp.dest('dist/views/'));
});
```

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

## TODO:

  - refactor tests
  - work on matchers (sigh...)
  - add filters:
    - capitalize
    - reverse

  - add option to dynamically add filters

# License
  MIT
