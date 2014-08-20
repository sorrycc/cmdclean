var esprima = require('esprima');
var escodegen = require('escodegen');
var utils = require('../lib/utils');

describe('utils', function() {

  it('returnExpressionIdentifier', function() {
    var ast = utils.returnExpressionIdentifier('foo');
    escodegen.generate(ast).should.be.equal('foo;');
  });

  it('isRelativeFilePath', function() {
    utils.isRelativeFilePath('./a').should.be.ok;
    utils.isRelativeFilePath('../a').should.be.ok;
    utils.isRelativeFilePath('/a').should.not.be.ok;
  });

  it('convertToCamelCase', function() {
    utils.convertToCamelCase('foo_bar').should.be.equal('fooBar');
    utils.convertToCamelCase('foo.bar', '\\.').should.be.equal('fooBar');
  });

  it('prefixReservedWords', function() {
    utils.prefixReservedWords('class').should.be.equal('_class');
    utils.prefixReservedWords('').should.be.equal('');
  });

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
