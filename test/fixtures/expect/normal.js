;(function() {
var a_100_relativejs, a_100_indexjs;
a_100_relativejs = function (exports) {
  exports = 'relative';
  return exports;
}();
a_100_indexjs = function (exports) {
  var relative = a_100_relativejs;
  exports = 'foo' + relative;
  return exports;
}(a_100_relativejs);
}());