var defaultValues = require('./defaultValues');
var _ = require('lodash');
var escodegen = require('escodegen');
var searequire = require('searequire');

var Utils = {

  // isDefine
  // --------
  // Returns if the current AST node is a define() method call
  isDefine: function(node) {
    var expression = node.expression || {},
      callee = expression.callee;

    return (_.isObject(node) &&
      node.type === 'ExpressionStatement' &&
      expression &&
      expression.type === 'CallExpression' &&
      callee.type === 'Identifier' &&
      callee.name === 'define');
  },

  // isRequire
  // ---------
  // Returns if the current AST node is a require() method call
  isRequire: function(node) {
    var expression = node.expression || {},
      callee = expression.callee;

    return (node &&
      node.type === 'ExpressionStatement' &&
      expression &&
      expression.type === 'CallExpression' &&
      callee.type === 'Identifier' &&
      callee.name === 'require');
  },

  // isModuleExports
  // ---------------
  // Is a module.exports member expression
  isModuleExports: function(node) {
    return (node &&
      node.type === 'AssignmentExpression' &&
      node.left &&
      node.left.type === 'MemberExpression' &&
      node.left.object &&
      node.left.object.type === 'Identifier' &&
      node.left.object.name === 'module' &&
      node.left.property &&
      node.left.property.type === 'Identifier' &&
      node.left.property.name === 'exports');
  },

  isExports: function(node) {
    return (node &&
      node.type === 'AssignmentExpression' &&
      node.operator === '=' &&
      node.left &&
      node.left.type === 'MemberExpression' &&
      node.left.object &&
      node.left.object.type === 'Identifier' &&
      node.left.object.name === 'exports' &&
      node.left.property &&
      node.left.property.type === 'Identifier');
  },

  hasExports: function(node) {
    return (node.body.filter(function(item) {
      if (item.type === 'ExpressionStatement'
        && item.expression
        && this.isExports(item.expression)) {
        return true;
      }
      if (item.type === 'VariableDeclaration'
        && this.hasExportsInDeclarations(item.declarations)) {
        return true;
      }
    }.bind(this)) || []).length > 0;
  },

  hasExportsInDeclarations: function(declarations) {
    if (!declarations) return false;
    for (var i=0; i<declarations.length; i++) {
      var item = declarations[i];
      if (hasExports(item.init)) {
        return true;
      }
    }

    function hasExports(node) {
      if (!node) {
        return false;
      }
      if (node.type === 'Identifier' && node.name === 'exports') {
        return true;
      }
      if (node.type === 'AssignmentExpression' && node.operator === '=') {
        return hasExports(node.left) || hasExports(node.right);
      }
      return false;
    }
  },

  hasExportsOrModuleExports: function(node) {
    if (this.hasModuleExportsString(node)) {
      return true;
    }
    if (this.hasExports(node)) {
      return true;
    }
    return (node.body.filter(function(item) {
      return item.type === 'ExpressionStatement'
        && item.expression
        && this.isModuleExports(item.expression);
    }.bind(this)) || []).length > 0;
  },

  // isRequireExpression
  // -------------------
  // Returns if the current AST node is a require() call expression
  // e.g. var example = require('someModule');
  isRequireExpression: function(node) {
    return (node &&
      node.type === 'CallExpression' &&
      node.callee &&
      node.callee.name === 'require');
  },

  // isObjectExpression
  // ------------------
  // Returns if the current AST node is an object literal
  isObjectExpression: function(expression) {
    return (expression &&
      expression &&
      expression.type === 'ObjectExpression');
  },

  // isFunctionExpression
  // --------------------
  // Returns if the current AST node is a function
  isFunctionExpression: function(expression) {
    return (expression &&
      expression &&
      expression.type === 'FunctionExpression');
  },

  // isFunctionCallExpression
  // ------------------------
  // Returns if the current AST node is a function call expression
  isFunctionCallExpression: function(expression) {
    return (expression &&
      expression &&
      expression.type === 'CallExpression' &&
      expression.callee &&
      expression.callee.type === 'FunctionExpression');
  },

  // isUseStrict
  // -----------
  // Returns if the current AST node is a 'use strict' expression
  // e.g. 'use strict'
  isUseStrict: function(expression) {
    return (expression &&
      expression &&
      expression.value === 'use strict' &&
      expression.type === 'Literal');
  },

  // returnExpressionIdentifier
  // --------------------------
  // Returns a single identifier
  // e.g. module
  returnExpressionIdentifier: function(name) {
    return {
      'type': 'ExpressionStatement',
      'expression': {
        'type': 'Identifier',
        'name': name,
        'range': defaultValues.defaultRange,
        'loc': defaultValues.defaultLOC
      },
      'range': defaultValues.defaultRange,
      'loc': defaultValues.defaultLOC
    };
  },

  // readFile
  // --------
  // Synchronous file reading for node
  readFile: function(path) {
    return require('fs').readFileSync(path, 'utf8');
  },

  // isRelativeFilePath
  // ------------------
  // Returns a boolean that determines if the file path provided is a relative file path
  // e.g. ../exampleModule -> true
  isRelativeFilePath: function(path) {
    var segments = path.split('/');

    return segments.length !== -1 && (segments[0] === '.' || segments[0] === '..');
  },

  // convertToCamelCase
  // ------------------
  // Converts a delimited string to camel case
  // e.g. some_str -> someStr
  convertToCamelCase: function(input, delimiter) {
    delimiter = delimiter || '_';

    return input.replace(new RegExp(delimiter + '(.)', 'g'), function(match, group1) {
      return group1.toUpperCase();
    });
  },

  // prefixReservedWords
  // -------------------
  // Converts a reserved word in JavaScript with an underscore
  // e.g. class -> _class
  prefixReservedWords: function(name) {
    var reservedWord = false;

    try {
      if(name.length) {
        eval('var ' + name + ' = 1;');
      }
    } catch (e) {
      reservedWord = true;
    }

    if(reservedWord === true) {
      return '_' + name;
    } else {
      return name;
    }
  },

  // normalizeDependencyName
  // -----------------------
  //  Returns a normalized dependency name that handles relative file paths
  normalizeDependencyName: function(moduleId, dep) {
    return dep;
  },

  topologicalSort: function ( nodes ) {
    var map = {};
    function isEmpty( obj ) {
      if ( !obj ) return true;
      for ( var i in obj ) {
        return false;
      }
      return true;
    }

    function clearDep( node, name ) {
      var deps = [];

      for ( var i in node.dependencies ) {
        if ( node.dependencies[i] !== name ) {
          deps.push( node.dependencies[i] );
        }
      }
      node.dependencies = deps;
    }

    var index = 0;
    while( !isEmpty( nodes ) ) {
      for ( var i in nodes ) {
        var b = nodes[ i ];
        if ( b.dependencies.length === 0 ) {
          map[b.name] = index++;
          delete nodes[ i ];
          // 清除所有该某块的依赖
          for ( var j in nodes ) {
            clearDep( nodes[j], b.name );
          }
        }
      }
    }
    return map;
  },

  hasModuleExportsString: function(node) {
    var code = escodegen.generate(node, {
      comment: false
    });
    code = code.replace(/\s/g, '');
    return code.indexOf('module.exports=') > -1;
  },

  getRequires: function(node) {
    var code = escodegen.generate(node, {
      comment: false
    });
    return searequire(code).map(function(item) {
      return item.path
    });
  },

  template: function(str, data) {
    return str.replace(/{{([a-z]*)}}/g, function(all, match) {
      return data[match] || '';
    });
  }
};

module.exports = Utils;
