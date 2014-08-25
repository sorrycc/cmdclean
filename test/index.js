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

  function assets(actual, dest) {
    var expected = fs.readFileSync(join(__dirname, 'fixtures/expect/', dest), 'utf-8');
    actual.should.be.equal(expected);
  }

});
