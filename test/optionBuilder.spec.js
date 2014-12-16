/* global describe, beforeEach, it, expect */

'use strict';

var OptionBuilder = require('../app/optionBuilder.js');

describe('optionBuilder', function () {
  var current;
  var base;
  var builder;

  beforeEach(function () {
    current = {
      _options: {
        'help': 'help option data'
      },
      options: {
        'coffee': true
      },
      option: function (name, data) {
        this._options[name] = data;
      }
    };

    base = {
      _options: {
        'help': 'help option data',
        'skip-install': 'skip install option data',
        'coffee': 'coffee option data',
        'test-framework': 'test framework option data'
      }
    };

    builder = new OptionBuilder(current, base);
  });

  describe('getDelegatedDefines', function () {
    it('Get delegated option defines', function () {
      expect(builder.getDelegatedDefines())
        .toEqual({
          'skip-install': 'skip install option data',
          'coffee': 'coffee option data',
          'test-framework': 'test framework option data'
        });
    });
  });

  describe('getDelegatedValues', function () {
    it('Get delegated option values', function () {
      expect(builder.getDelegatedValues())
        .toEqual({
          'coffee': true
        });
    });

    it('If option value changed', function () {
      current.options['test-framework'] = 'jasmine';

      expect(builder.getDelegatedValues())
        .toEqual({
          'coffee': true,
          'test-framework': 'jasmine'
        });
    });
  });

  describe('copyDelegatedDefines', function () {
    it('Set delegated option defines', function () {
      builder.copyDelegatedDefines();

      expect(current._options).toEqual({
        'help': 'help option data',
        'skip-install': 'skip install option data',
        'coffee': 'coffee option data',
        'test-framework': 'test framework option data'
      });
    });
  });
});
