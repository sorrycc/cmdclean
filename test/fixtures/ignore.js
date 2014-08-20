/* comment */
define('a/1.0.0/index.js', [], function(require, module, exports) {
  var $ = require('jquery');
  module.exports = $('foo');
});
define('jquery', [], function(require, module, exports) {
  module.exports = 'jquery';
});
