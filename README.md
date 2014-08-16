# Gulp Translator
> Almost like string replace but with using locales.

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
      .pipe(translate('./locales/'+ translation +'.yml'))
      .pipe(gulp.dest('dist/views/' + translation));
  });
});
```

And then, pass contents of the file, everything between `{{  }}`` will be interpolated with locale.

## API

gulp-translator is called with a string

### translate(string)

#### string
Type: `String`

The string is a path to a nameOfTheFile.yml with your locales. Please look at test/locales for examples.


# License
  MIT
