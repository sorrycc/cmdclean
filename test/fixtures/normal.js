define('a/1.0.0/index.js', ['a/1.0.0/relative.js'], function(require, module, exports) {
  var relative = require('a/1.0.0/relative.js');
  module.exports = 'foo' + relative;
});
define('a/1.0.0/relative.js', ['a/1.0.0/literal.js'], function(require, module, exports) {
  module.exports = 'relative' + require('a/1.0.0/literal.js');
});
define('a/1.0.0/literal.js', [], function(require, module, exports) {
  return 'literal';
});
