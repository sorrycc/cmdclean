'use strict';

var cmdclean = require('..');
var join = require('path').join;
var fs = require('fs');
var multiline = require('multiline');

describe('cmdclean', function() {

  it('normal', function() {
    var result = cmdclean({
      filePath: join(__dirname, 'fixtures/normal.js'),
      globalModules: ['a_100_indexjs']
    });
    assets(result, 'normal.js');
  });

  it('umd', function() {
    var result = cmdclean({
      filePath: join(__dirname, 'fixtures/normal.js'),
      umd:'normal'
    });
    assets(result, 'umd.js');
  });

  it('nodeps', function() {
    var result = cmdclean({
      filePath: join(__dirname, 'fixtures/nodeps.js'),
      prefixTransform: null
    });
    assets(result, 'nodeps.js');
  });

  it('ignore', function() {
    var result = cmdclean({
      filePath: join(__dirname, 'fixtures/ignore.js'),
      ignoreModules: ['jquery']
    });
    assets(result, 'ignore.js');
  });

  it('support string', function() {
    var result = cmdclean('define("a",[],function(){1;});');
    result.should.be.equal(multiline(function(){/*
;(function() {
var a;
a = function () {
  1;
}();
}());
   */}));
   });

  it('no function wrap', function() {
    var result = cmdclean('define("a",[],function(){1;});', {wrap:null});
    result.should.be.equal(multiline(function(){/*
var a;
a = function () {
  1;
}();
     */}));
  });

  it('empty statement', function() {
    var result = cmdclean('define("a",[],function(){;});');
    result.should.be.equal(multiline(function(){/*
;(function() {
var a;
a = function () {
}();
}());
     */}));
  });

  it('rename', function() {
    var result = cmdclean('define("a",[],function(){var $=require("jquery");});', {
      rename: {
        jquery: 'jQuery'
      }
    });
    result.should.be.equal(multiline(function(){/*
;(function() {
var a, jQuery;
a = function () {
  var $ = jQuery;
}();
}());
     */}));
  });

  it('exports', function() {
    var result;

    result = cmdclean('define("a",[],function(require,module,exports){var a=exports;a.b=1;});');
    result.should.be.equal(multiline(function(){/*
;(function() {
var _a_;
_a_ = function (exports) {
  var a = exports;
  a.b = 1;
  return exports;
}({});
}());
     */}));

    result = cmdclean('define("a",[],function(require,module,exports){var a=exports={};a.b=1;});');
    result.should.be.equal(multiline(function(){/*
;(function() {
var _a_;
_a_ = function (exports) {
  var a = exports = {};
  a.b = 1;
  return exports;
}({});
}());
     */}));

    result = cmdclean('define("a",[],function(require,module,exports){var a=b=c=d=exports={};a.b=1;});');
    result.should.be.equal(multiline(function(){/*
;(function() {
var _a_;
_a_ = function (exports) {
  var a = b = c = d = exports = {};
  a.b = 1;
  return exports;
}({});
}());
     */}));

    result = cmdclean('define("a",[],function(require,module,exports){exports["a"]=1;});');
    result.should.be.equal(multiline(function(){/*
;(function() {
var a;
a = function (exports) {
  exports['a'] = 1;
  return exports;
}({});
}());
     */}));

    result = cmdclean('define("a",[],function(require,module,exports){(function(){module.exports="abc";})();});');
    result.should.be.equal(multiline(function(){/*
;(function() {
var a;
a = function (exports) {
  (function () {
    exports = 'abc';
  }());
  return exports;
}();
}());
     */}));

    result = cmdclean('define("a",[],function(require,module,exports){(function(){facotry(exports);})();});');
    result.should.be.equal(multiline(function(){/*
;(function() {
var a;
a = function (exports) {
  (function () {
    facotry(exports);
  }());
  return exports;
}({});
}());
     */}));
  });

  it('commonjs condition', function() {
    var result;
    var expected = multiline(function(){/*
;(function() {
var a;
a = function (exports) {
  (function () {
    if (true) {
      exports = 'abc';
    }
  }());
  return exports;
}();
}());
     */});

    result = cmdclean('define("a",[],function(require,module,exports){(function(){if(typeof module === "object"){module.exports="abc";}})();});');
    result.should.be.equal(expected);

    result = cmdclean('define("a",[],function(require,module,exports){(function(){if(typeof module === "object" && module.exports === "object"){module.exports="abc";}})();});');
    result.should.be.equal(expected);

    result = cmdclean('define("a",[],function(require,module,exports){(function(){if("object" === typeof module){module.exports="abc";}})();});');
    result.should.be.equal(expected);

    result = cmdclean('define("a",[],function(require,module,exports){(function(){if(typeof module !== "undefined"){module.exports="abc";}})();});');
    result.should.be.equal(expected);
  });

  it('commonjs declaraction', function() {
    var result;
    var expected = multiline(function(){/*
;(function() {
var a;
a = function () {
  var c = true;
}();
}());
     */});

    result = cmdclean('define("a",[],function(require,module,exports){var c = typeof module === \'object\';});');
    result.should.be.equal(expected);

    result = cmdclean('define("a",[],function(require,module,exports){var c = typeof module !== \'undefined\';});');
    result.should.be.equal(expected);

    result = cmdclean('define("a",[],function(require,module,exports){var c = \'undefined\' !== typeof module;});');
    result.should.be.equal(expected);
  });

  function assets(actual, dest) {
    var expected = fs.readFileSync(join(__dirname, 'fixtures/expect/', dest), 'utf-8');
    actual.should.be.equal(expected);
  }

});
