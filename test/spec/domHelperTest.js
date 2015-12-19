'use strict';

const chai = require('chai');
const sinon = require('sinon');
const assert = chai.assert;
const expect = chai.expect;

const domHelper = require('../../app/scripts.babel/domHelper');

describe('DomHelper Class', () => {
  before(() => {
    global.chrome = require('sinon-chrome');
    global.document = {querySelectorAll: () => {}};
  });

  it('should localize all i18n elements', done => {
    var querySelectorAll = sinon.stub(document, 'querySelectorAll');

    var input = {tagName: 'INPUT', dataset: {i18n: 'appName'}};
    var textarea = {tagName: 'TEXTAREA', dataset: {i18n: 'appDescription'}};
    var div = {tagName: 'DIV', dataset: {i18n: 'appAuthor'}};

    querySelectorAll.withArgs('[data-i18n]').returns([input, textarea, div]);
    chrome.i18n.getMessage.withArgs('appName').returns('Unfavoritize');
    chrome.i18n.getMessage.withArgs('appDescription').returns('Awesome!');
    chrome.i18n.getMessage.withArgs('appAuthor').returns('Ravan Scafi');

    domHelper.localizeI18n();

    expect(input.value).to.equal('Unfavoritize');
    expect(textarea.value).to.equal('Awesome!');
    expect(div.innerHTML).to.equal('Ravan Scafi');

    querySelectorAll.restore();
    done();
  });

  it('should generate options for a select', done => {
    var nodeList = [
      {id: 1, title: 'A title'},
      {id: 2, title: 'Another title'},
      {id: 3, title: 'Yet Another title'},
    ];
    var selected = 2;

    var result = domHelper.generateOptions(nodeList, selected);

    expect(result).to.equal(
      '<option value="1">A title</option>\n' +
      '<option value="2" selected="selected">Another title</option>\n' +
      '<option value="3">Yet Another title</option>\n'
    );
    done();
  });
});
