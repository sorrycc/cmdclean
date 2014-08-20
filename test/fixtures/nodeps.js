define('a/1.0.0/index.js', [], function(require, module, exports) {
  'use strict';
  var a_100_relativejs = require('a/1.0.0/relative.js');
  module.exports = $('foo' + a_100_relativejs);
});
define('a/1.0.0/relative.js', [], function(require, module, exports) {
  module.exports = 'relative';
});
