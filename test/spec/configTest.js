'use strict';

let chai = require('chai');
let sinon = require('sinon');
let assert = chai.assert;
let expect = chai.expect;

let config = require('../../app/scripts.babel/config');

describe('Config Class', () => {
  before(() => {
    global.chrome = require('sinon-chrome');
    global.document = {getElementById: () => {}};
  });

  describe('interacting with configs page', () => {
    it('should save all configs', done => {
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

      var set = sinon.stub(config, 'set');
      set.withArgs(expected).yields('ok!');

      expect(config.save(response => {
        expect(response).to.equal('ok!');
        document.getElementById.restore();
        config.set.restore();
        done();
      }));
    });

    it('should get and apply all configs', done => {
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

      var get = sinon.stub(config, 'get');
      get.withArgs([
        'sourceFolder',
        'destinationFolder',
        'triggerAction',
        'triggerFrequency',
        'suggestedOrder',
      ]).yields(expected);

      expect(config.load(response => {
        expect(response).to.equal(true);
        document.getElementById.restore();
        config.get.restore();
        done();
      }));
    });
  });

  describe('interacting with chrome.storage API', () => {
    it('should set an object of configs', done => {
      var configs = {
        aKey: 'a-value',
        anotherKey: 'another-value',
      };

      chrome.storage.sync.set.withArgs(configs).yields(true);

      config.set(configs, response => {
        expect(response).to.equal(true);
        done();
      });
    });

    it('should get an object of configs', done => {
      var configs = {
        aKey: 'a-default-value',
        anotherKey: 'another-default-value',
      };

      var expected = {
        aKey: 'existing-value',
        anotherKey: 'another-default-value',
      };

      chrome.storage.sync.get.withArgs(configs).yields(expected);

      config.get(configs, response => {
        expect(response).to.equal(expected);
        done();
      });
    });
  });
});
