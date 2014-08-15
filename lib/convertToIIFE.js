var defaultValues = require('./defaultValues');

module.exports = function(obj) {
  var callbackFuncParams = obj.callbackFuncParams;
  var callbackFunc = obj.callbackFunc;
  var dependencyNames = obj.dependencyNames;
  var node = obj.node;
  var range = (node.range || defaultValues.defaultRange);
  var loc = (node.loc || defaultValues.defaultLOC);

  return {
    'type': 'ExpressionStatement',
    'expression': {
      'type': 'CallExpression',
      'callee': {
        'type': 'FunctionExpression',
        'id': null,
        'params': callbackFuncParams,
        'defaults': [],
        'body': callbackFunc.body,
        'rest': callbackFunc.rest,
        'generator': callbackFunc.generator,
        'expression': callbackFunc.expression,
        'range': range,
        'loc': loc
      },
      'arguments': dependencyNames,
      'range': range,
      'loc': loc
    },
    'range': range,
    'loc': loc
  };
};