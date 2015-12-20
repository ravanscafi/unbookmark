'use strict';

const chai = require('chai');
const sinon = require('sinon');
const assert = chai.assert;
const expect = chai.expect;

const DomHelper = require('../../app/scripts.babel/domHelper');
const Config = require('../../app/scripts.babel/config');

describe('Options Class', () => {
  before(() => {
    global.document = {addEventListener: () => {}, getElementById: () => {}};
  });

  it('should load options when DOM is loaded', done => {
    var addEventListener = sinon.stub(document, 'addEventListener');
    var getElementById = sinon.stub(document, 'getElementById');
    var localizeI18n = sinon.stub(DomHelper, 'localizeI18n');
    var load = sinon.stub(Config, 'load');
    var save = sinon.stub(Config, 'save');
    var target = {value: 'old'};

    addEventListener.withArgs('DOMContentLoaded').yields();

    getElementById.withArgs('submit').returns({addEventListener});

    addEventListener.withArgs('click').yields({target});
    save.yields();

    chrome.i18n.getMessage.withArgs('saved').returns('new');

    require('../../app/scripts.babel/options');

    assert(localizeI18n.calledOnce);
    assert(load.calledOnce);
    expect(target).to.deep.equal({value: 'new', disabled: 'disabled'});

    setTimeout(() => {
      expect(target).to.deep.equal({value: 'old', disabled: ''});

      addEventListener.restore();
      getElementById.restore();
      localizeI18n.restore();
      load.restore();
      save.restore();
      done();
    }, 1000);
  });
});
