var YAML = require('yamljs');
var q = require('q');

module.exports = (function() {

  var EXPRESSION_REG = /\{{2}([\w\.\s\"\']+)\s?\|\stranslate([\w\s\|]*)\}{2}/g;
  var FILTER_REG = /translate(([\|\s]*)([\w]+))*/;
  var EXPRESSION_VALUE_REG = /\{{2}\s*[\'\"]?([\w\.]*)[\'\"]?/;

  var getLocale = function(dir){
    return YAML.load(dir);
  };

  var getLocaleValue = function(key, locale) {
    return key.trim().split('.').reduce(function(obj, key){
      return obj[key];
    }, locale);
  };

  // FILTERS

  var uppercase = function(content) {
    return content.toUpperCase();
  };

  var lowercase = function(content) {
    return content.toLowerCase();
  };

  // /FILTERS

  var Translator = function(options){
    this.result = q.defer();
    this.locale = getLocale(options.localePath);
  };

  Translator.prototype.translate = function(content) {
    var resultPromise = q.defer();
    var self = this;

    var localeName = Object.keys(this.locale)[0];
    var localeValues = this.locale[localeName];

    var expressions = content.match(EXPRESSION_REG);

    if(expressions) {
      resultPromise.resolve(expressions.reduce(function(content, expression) {
        var filters = expression.match(FILTER_REG)[0].split('|').slice(1).map(function(key){
          return key.trim();
        });

        var expressionValue = getLocaleValue(
          expression.match(EXPRESSION_VALUE_REG)[1],
          localeValues
        ) || resultPromise.reject("Cannot find that key in locales " + expression);

        var resultValue = filters.reduce(function(value, filter){
          if(self[filter] && typeof self[filter] === 'function') {
            return self[filter](value);
          } else {
            return resultPromise.reject(filter + " filter is not supported");
          }
        }, expressionValue);

        return content.replace(
          expression,
          resultValue
        );
      }, content));
    } else {
      resultPromise.resolve(content);
    }
    return resultPromise.promise;
  };

  Translator.prototype.uppercase = uppercase;
  Translator.prototype.lowercase = lowercase;

  return Translator;
}());
