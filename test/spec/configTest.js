'use strict';

const chai = require('chai');
const sinon = require('sinon');
const assert = chai.assert;
const expect = chai.expect;

const config = require('../../app/scripts.babel/config');

describe('Config Class', () => {
  before(() => {
    global.chrome = require('sinon-chrome');
    global.document = {getElementById: () => {}, querySelector: () => {}};
  });

  describe('interacting with configs page', () => {
    it('should save all configs', done => {
      var expected = {
        sourceFolder: 'value-1',
        destinationFolder: 'value-2',
        triggerAction: 'value-3',
        suggestedOrder: 'value-4',
        triggerFrequency: 'value-5',
      };
      var getElementById = sinon.stub(document, 'getElementById');
      var querySelector = sinon.stub(document, 'querySelector');

      getElementById.withArgs('sourceFolder').returns({value: 'value-1'});
      getElementById.withArgs('destinationFolder').returns({value: 'value-2'});

      querySelector.withArgs('[name=triggerAction]:checked').returns({value: 'value-3'});
      querySelector.withArgs('[name=suggestedOrder]:checked').returns({value: 'value-4'});
      getElementById.withArgs('triggerFrequency').returns({value: 'value-5'});

      var set = sinon.stub(config, 'set');
      set.withArgs(expected).yields('ok!');

      expect(config.save(response => {
        expect(response).to.equal('ok!');
        getElementById.restore();
        querySelector.restore();
        set.restore();
        done();
      }));
    });

    it('should get and apply all configs', done => {
      var expected = {
        sourceFolder: 'value-1',
        destinationFolder: 'value-2',
        triggerAction: 'value-3',
        suggestedOrder: 'value-4',
        triggerFrequency: 'value-5',
      };
      var getElementById = sinon.stub(document, 'getElementById');
      var querySelector = sinon.stub(document, 'querySelector');

      getElementById.withArgs('sourceFolder').returns({value: ''});
      getElementById.withArgs('destinationFolder').returns({value: ''});
      querySelector.withArgs('[name=triggerAction][value=value-3]').returns({value: 'value-3'});
      querySelector.withArgs('[name=suggestedOrder][value=value-4]').returns({value: 'value-4'});
      getElementById.withArgs('triggerFrequency').returns({value: ''});

      var get = sinon.stub(config, 'get');
      get.withArgs({
        sourceFolder: '',
        destinationFolder: '',
        triggerAction: 'new_tab',
        suggestedOrder: 'random',
        triggerFrequency: 5,
      }).yields(expected);

      expect(config.load(response => {
        expect(response).to.equal(true);
        getElementById.restore();
        querySelector.restore();
        get.restore();
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
