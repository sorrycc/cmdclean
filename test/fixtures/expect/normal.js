;(function() {
var a_100_literaljs, a_100_relativejs, a_100_indexjs;
a_100_literaljs = 'literal';
a_100_relativejs = function (exports) {
  exports = 'relative' + a_100_literaljs;
  return exports;
}();
a_100_indexjs = function (exports) {
  var relative = a_100_relativejs;
  exports = 'foo' + relative;
  return exports;
}();
}());