var YAML = require('yamljs');

module.exports = (function() {
  var getLocale = function(dir){
    return YAML.load(dir);
  };

  var getLocaleValue = function(key, locale) {
    return key.trim().split('.').reduce(function(obj, key){
      return obj[key];
    }, locale);
  };

  var translateWithLocale = function(content, locale, regexp) {
    return content.match(regexp).reduce(function(content, key){
      /*
      *  If someone has passed bad(ha ha) RegExp it would result
      *  in 'undefined' strings in the contents when keys were not present
      */
      if(key && key.length > 0 ) {
        return content.replace(
          key,
          getLocaleValue(
            key.replace('{{', '').replace('}}', ''),
            locale
          )
        );
      } else {
        return content;
      }
    }, content);
  };

  var Translator = function(options){
    this.locale = getLocale(options.localePath);
    this.regexp = options.regexp || /\{\{([a-zA-Z0-9\.\ ]+)}}/g;
  };

  Translator.prototype.translate = function(content) {
    var localeName = Object.keys(this.locale)[0];
    var localeValues = this.locale[localeName];

    return translateWithLocale(content, localeValues, this.regexp);
  };

  return Translator;
}());
