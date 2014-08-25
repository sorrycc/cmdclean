;(function() {
var a_100_literaljs, a_100_relativejs, a_100_indexjs;
a_100_literaljs = function () {
  var ret = 'literal';
  return ret;
}();
a_100_relativejs = function (exports) {
  exports = 'relative' + a_100_literaljs;
  return exports;
}();
a_100_indexjs = function (exports) {
  var relative = a_100_relativejs;
  exports = 'foo' + relative;
  return exports;
}();

if (typeof exports == "object") {
  module.exports = a_100_indexjs;
} else if (typeof define == "function" && define.amd) {
  define([], function(){ return a_100_indexjs });
} else {
  this["normal"] = a_100_indexjs;
}
}());