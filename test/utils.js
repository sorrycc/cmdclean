var esprima = require('esprima');
var utils = require('../lib/utils');

describe('utils', function() {

  it('getRequires', function() {
    var ast;

    ast = esprima.parse('require("a");');
    utils.getRequires(ast).should.be.eql(['a']);

    ast = esprima.parse('require("a");require("b");');
    utils.getRequires(ast).should.be.eql(['a','b']);

    ast = esprima.parse('if(false)require("a");');
    utils.getRequires(ast).should.be.eql(['a']);

    ast = esprima.parse('/*require("a");*/');
    utils.getRequires(ast).should.be.eql([]);

    ast = esprima.parse('/require("a");/');
    utils.getRequires(ast).should.be.eql([]);
  });
});
