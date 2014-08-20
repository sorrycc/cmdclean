'use strict';

var cmdclean = require('..');
var join = require('path').join;
var fs = require('fs');

describe('cmdclean', function() {

  it('normal', function() {
    var result = cmdclean({
      filePath: join(__dirname, 'fixtures/normal.js'),
      createAnonymousAMDModule: true
    });
    assets(result, 'normal.js');
  });

  it('nodeps', function() {
    var result = cmdclean({
      filePath: join(__dirname, 'fixtures/nodeps.js'),
      createAnonymousAMDModule: true,
      prefixTransform: null
    });
    assets(result, 'nodeps.js');
  });

  it('ignore', function() {
    var result = cmdclean({
      filePath: join(__dirname, 'fixtures/ignore.js'),
      createAnonymousAMDModule: true,
      ignoreModules: ['jquery']
    });
    assets(result, 'ignore.js');
  });

  function assets(actual, dest) {
    var expected = fs.readFileSync(join(__dirname, 'fixtures/expect/', dest), 'utf-8');
    actual.should.be.equal(expected);
  }

});
