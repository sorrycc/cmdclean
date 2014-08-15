var utils = require('./utils');
var defaultValues = require('./defaultValues');
var _ = require('lodash');

module.exports = function normalizeModuleName(name, moduleId) {
  var amdclean = this;
  var options = amdclean.options;
  var prefixMode = options.prefixMode;
  var prefixTransform = options.prefixTransform;
  var dependencyBlacklist = defaultValues.dependencyBlacklist;
  var prefixTransformValue;
  var preNormalized;
  var postNormalized;

  name = name || '';

  if(name === '{}') {
    if(dependencyBlacklist[name] === 'remove') {
      return '';
    } else {
      return name;
    }
  }

  preNormalized = utils.prefixReservedWords(name.replace(/\./g,'').
    replace(/[^A-Za-z0-9_$]/g,'_').
    replace(/^_+/,''));

  postNormalized = prefixMode === 'camelCase' ? utils.convertToCamelCase(preNormalized) : preNormalized;

  if(options.ignoreModules.indexOf(postNormalized) === -1 && amdclean.variablesStore[postNormalized]) {
    amdclean.storedModules[postNormalized] = false;
    postNormalized = (function findValidName(currentName) {
      if(amdclean.variablesStore[currentName]) {
        return findValidName('_' + currentName + '_');
      } else {
        return currentName;
      }
    }(postNormalized));
    amdclean.storedModules[postNormalized] = true;
  }

  if(_.isFunction(prefixTransform)) {
    prefixTransformValue = prefixTransform(postNormalized, moduleId);
    if(_.isString(prefixTransformValue) && prefixTransformValue.length) {
      return prefixTransformValue;
    }
  }

  return postNormalized;
};