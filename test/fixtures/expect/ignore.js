;(function() {
/* comment */
var a_100_indexjs;
define('jquery', [], function (require, module, exports) {
  exports = exports || {};
  module.exports = 'jquery';
  return exports;
});
a_100_indexjs = function (exports) {
  var $ = require('jquery');
  exports = $('foo');
  return exports;
}();
}());