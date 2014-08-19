'use strict';

var cmdclean = require('..');
var join = require('path').join;
var fs = require('fs');

describe('cmdclean', function() {

  it('Normal use', function() {
    var result = cmdclean({
      filePath: join(__dirname, 'fixtures/normal.js'),
      createAnonymousAMDModule: true
    });
    assets(result, 'normal.js');
  });

  function assets(actual, dest) {
    var expected = fs.readFileSync(join(__dirname, 'fixtures/expect/', dest), 'utf-8');
    actual.should.be.equal(expected);
  }

});
