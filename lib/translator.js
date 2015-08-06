var YAML = require('yamljs');
var q = require('q');
var fs = require('fs');

var DEFAULT_REGEXP = /\{{2}([\w\.\s\"\']+\s?\|\s?translate[\w\s\|]*)\}{2}/g;


var baseTransforms = {
  translate: function(content, dictionary){
    if (!content) {
      return new Error('No content to transform (translate).');
    }
    return content.trim().split('.').reduce(function(dict, key){
        if (!dict) {
          return null;
        }
        return dict[key];
      }, dictionary) ||
      new Error('No such content (' + content + ') in locale file');
  },

  uppercase: function(content) {
    if (typeof content !== 'string') {
      return new Error('No content to transform (uppercase).');
    }
    return content.toUpperCase();
  },

  lowercase: function(content) {
    if (typeof content !== 'string') {
      return new Error('No content to transform (lowercase).');
    }
    return content.toLowerCase();
  },

  capitalize: function(content){
    if (typeof content !== 'string') {
      return new Error('No content to transform (capitalize).');
    }
    return content.charAt(0).toUpperCase() + content.substring(1).toLowerCase();
  },

  capitalizeEvery: function(content){
    if (typeof content !== 'string') {
      return new Error('No content to transform (capitalizeEvery).');
    }
    return content.toLowerCase().replace(/\b(.)/g, function(equals, word){
      return baseTransforms.capitalize(word);
    });
  },

  reverse: function(content){
    if (typeof content !== 'string') {
      return new Error('No content to transform (reverse).');
    }
    return content.split('').reduceRight(function(result, letter){
      return result + letter;
    }, '');
  }

};

var getDictionary = function(path){
  var dictionary;

  if (path.match(/\.json$/)) {
    dictionary = JSON.parse(
      fs.readFileSync(path,{
        encoding: 'utf8'
      })
    );
  }
  else if (path.match(/\.yml$/)){
    dictionary = YAML.load(path);
  }
  if (!dictionary){
    try{
      dictionary = JSON.parse(
        fs.readFileSync(path+'.json',{
          encoding: 'utf8'
        })
      );
    }
    catch(e){
      dictionary = YAML.load(path + '.yml');
    }
  }
  return dictionary;
};



module.exports = (function() {
  var Translator = function(options){
    options = options || {};
    this.pattern = options.pattern || DEFAULT_REGEXP;
    this.patternSplitter = options.patternSplitter || '|';
    this.userTransform = options.transform || {};

    if (typeof options === 'string'){
      var lang = options.match(/([\.^\/]*)\.\w{0,4}$/);
      this.lang = lang && lang[0] || 'undefined';
      this.localePath = options;
    }
    else {

      this.lang = options.lang;
      this.localePath = options.localePath;
      this.localeDirectory = options.localeDirectory;
      this.localeExt = options.localeExt;

      if (!this.localePath){
        this.localePath = this.localeDirectory + this.lang;
      }

      if (this.localeExt) {
        this.localePath += this.localeExt;
      }
    }

    this.dictionary = getDictionary(this.localePath);
    return this;
  };

  Translator.prototype.translate = function(content) {
    var resultPromise = q.defer();
    var self = this;

    resultPromise.resolve(content.replace(self.pattern, function (s, data) {

      var transforms = data.split(self.patternSplitter).map(function(filter){
        return filter.trim();
      });

      var value = transforms.splice(0, 1)[0];

      var res = transforms.reduce(function(res, transformName){
        if (res instanceof Error){
          return res;
        }
        if (typeof self.userTransform[transformName] === 'function') {
          return self.userTransform[transformName](res, self.dictionary);
        }
        else if (typeof baseTransforms[transformName] === 'function') {
          return baseTransforms[transformName](res, self.dictionary);
        } else {
          return new Error(transformName + ' filter is not supported');
        }
      }, value);

      if (res instanceof Error) {
        return resultPromise.reject(res);
      }

      return res;

    }, content));

    return resultPromise.promise;
  };

  return Translator;
}());
