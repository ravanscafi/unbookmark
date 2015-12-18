'use strict';

let chai = require('chai');
let sinon = require('sinon');
let assert = chai.assert;
let expect = chai.expect;

let option = require('../../app/scripts.babel/option');

describe('Options Class', () => {
  before(() => {
    global.chrome = require('sinon-chrome');
    global.document = {getElementById: () => {}};
  });

  describe('interacting with options page', () => {
    it('should save all options', done => {
      var expected = {
        sourceFolder: 'value-1',
        destinationFolder: 'value-2',
        triggerAction: 'value-3',
        triggerFrequency: 'value-4',
        suggestedOrder: 'value-5',
      };
      var getElementById = sinon.stub(document, 'getElementById');

      getElementById.withArgs('sourceFolder').returns({value: 'value-1'});
      getElementById.withArgs('destinationFolder').returns({value: 'value-2'});
      getElementById.withArgs('triggerAction').returns({value: 'value-3'});
      getElementById.withArgs('triggerFrequency').returns({value: 'value-4'});
      getElementById.withArgs('suggestedOrder').returns({value: 'value-5'});

      var set = sinon.stub(option, 'set');
      set.withArgs(expected).yields('ok!');

      expect(option.save(response => {
        expect(response).to.equal('ok!');
        document.getElementById.restore();
        option.set.restore();
        done();
      }));
    });

    it('should get and apply all options', done => {
      var expected = {
        sourceFolder: 'value-1',
        destinationFolder: 'value-2',
        triggerAction: 'value-3',
        triggerFrequency: 'value-4',
        suggestedOrder: 'value-5',
      };
      var getElementById = sinon.stub(document, 'getElementById');

      getElementById.withArgs('sourceFolder').returns({value: ''});
      getElementById.withArgs('destinationFolder').returns({value: ''});
      getElementById.withArgs('triggerAction').returns({value: ''});
      getElementById.withArgs('triggerFrequency').returns({value: ''});
      getElementById.withArgs('suggestedOrder').returns({value: ''});

      var get = sinon.stub(option, 'get');
      get.withArgs([
        'sourceFolder',
        'destinationFolder',
        'triggerAction',
        'triggerFrequency',
        'suggestedOrder',
      ]).yields(expected);

      expect(option.load(response => {
        expect(response).to.equal(true);
        document.getElementById.restore();
        option.get.restore();
        done();
      }));
    });
  });

  describe('interacting with chrome.storage API', () => {
    it('should set an object of options', done => {
      var options = {
        aKey: 'a-value',
        anotherKey: 'another-value',
      };

      chrome.storage.sync.set.withArgs(options).yields(true);

      option.set(options, response => {
        expect(response).to.equal(true);
        done();
      });
    });

    it('should get an object of options', done => {
      var options = {
        aKey: 'a-default-value',
        anotherKey: 'another-default-value',
      };

      var expected = {
        aKey: 'existing-value',
        anotherKey: 'another-default-value',
      };

      chrome.storage.sync.get.withArgs(options).yields(expected);

      option.get(options, response => {
        expect(response).to.equal(expected);
        done();
      });
    });
  });
});
