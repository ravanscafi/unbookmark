'use strict';

const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const assert = chai.assert;

const Bookmark = require('../../app/scripts.babel/bookmark');
const Config = require('../../app/scripts.babel/config');

const suggester = require('../../app/scripts.babel/suggester');

describe('Suggester Class', () => {
  before(() => {
    global.chrome = require('sinon-chrome');
  });

  it('should verify and make a suggestion', done => {
    var suggestion = {url: 'http://my-suggestion.com'};
    var sourceFolder = '123';
    var suggestedOrder = 'random';
    var triggerFrequency = 100;
    var destinationFolder = '321';

    var getSuggestion = sinon.stub(Bookmark, 'getSuggestion');
    var markBookmarkAsRead = sinon.stub(Bookmark, 'markBookmarkAsRead');
    var getAll = sinon.stub(Config, 'getAll');

    getAll.yields({sourceFolder, suggestedOrder, triggerFrequency, destinationFolder});
    getSuggestion.withArgs('123', 'random').yields(suggestion);
    markBookmarkAsRead.withArgs('123', '321').yields();

    suggester.verify(bookmark => {
      expect(bookmark).to.equal(suggestion);
      getSuggestion.restore();
      markBookmarkAsRead.restore();
      getAll.restore();
      done();
    });
  });

  it('should verify and not move an empty suggestion', done => {
    var sourceFolder = '123';
    var suggestedOrder = 'random';
    var triggerFrequency = 100;
    var destinationFolder = '321';

    var getSuggestion = sinon.stub(Bookmark, 'getSuggestion');
    var getAll = sinon.stub(Config, 'getAll');

    getAll.yields({sourceFolder, suggestedOrder, triggerFrequency, destinationFolder});
    getSuggestion.withArgs('123', 'random').yields(undefined);

    suggester.verify(bookmark => {
      expect(bookmark).to.equal(undefined);
      getSuggestion.restore();
      getAll.restore();
      done();
    });
  });

  it('should verify and not make a suggestion', done => {
    var triggerFrequency = 0;

    var getAll = sinon.stub(Config, 'getAll');

    getAll.yields({triggerFrequency});

    suggester.verify(url => {
      expect(url).to.equal(false);
      getAll.restore();
      done();
    });
  });

  it('should register listeners and respond to them correctly', done => {
    var url = 'chrome://newtab/';
    var status = 'loading';

    var bookmark = {url: 'http://suggestion'};

    var verify = sinon.stub(suggester, 'verify');

    verify.yields(bookmark);

    suggester.registerListeners();
    chrome.tabs.onUpdated.trigger('10', {url, status});

    assert(chrome.tabs.update.withArgs('10', {url: bookmark.url}).calledOnce);

    verify.restore();
    done();
  });

  it('should register listeners and ignore different events', done => {
    suggester.registerListeners();

    chrome.tabs.onUpdated.trigger('10', {
      url: 'http://otherurl.com',
      status: 'loading',
    });

    done();
  });

  it('should register listeners and do nothing if verify returns no bookmarks', done => {
    var verify = sinon.stub(suggester, 'verify');

    verify.yields(undefined);

    suggester.registerListeners();
    chrome.tabs.onUpdated.trigger('10', {
      url: 'chrome://newtab/',
      status: 'loading',
    });

    verify.restore();
    done();
  });
});
