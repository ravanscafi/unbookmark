'use strict';

var chai = require('chai');
var sinon = require('sinon');
var assert = chai.assert;
var expect = chai.expect;

var bookmark = require('../../app/scripts.babel/bookmark');

describe('Bookmark Class', () => {

  before(() => {
    global.chrome = require('sinon-chrome');
  });

  describe('interacting with chrome.bookmarks API', () => {

    it('should find folders from bookmarks', (done) => {
      chrome.bookmarks.getTree.yields([
        {title: 'Folder 1', children: [{}]},
        {title: 'Bookmark 1'},
        {title: 'Folder 2', children: [{}, {}]},
      ]);

      bookmark.findFolders((folders) => {
        expect(folders).to.deep.equal([
          {title: 'Folder 1', children: [{}]},
          {title: 'Folder 2', children: [{}, {}]},
        ]);
        done();
      });
    });

    it('should get children bookmarks for a given folder', (done) => {
      chrome.bookmarks.getChildren.withArgs(12).yields([
        {title: 'Node 1'},
        {title: 'Node 2'},
      ]);

      bookmark.getFolderBookmarks(12, (bookmarks) => {
        expect(bookmarks).to.deep.equal([
          {title: 'Node 1'},
          {title: 'Node 2'},
        ]);

        done();
      });
    });

    xit('should get children bookmarks for a given folder recursively', (done) => {
      chrome.bookmarks.getChildren.withArgs(12).yields([
        {title: 'Node 1'},
        {title: 'Node 2', children: [{title: 'Node 3'}]},
      ]);

      bookmark.getFolderBookmarks(12, (bookmarks) => {
        expect(bookmarks).to.deep.equal([
          {title: 'Node 1'},
          {title: 'Node 3'},
        ]);

        done();
      });
    });

    it('should move a bookmark to destination', (done) => {
        bookmark.moveBookmark(5, 10);
        assert(chrome.bookmarks.move.withArgs(5, 10).calledOnce);
        done();
    });

    it('should delete a bookmark', (done) => {
        bookmark.deleteBookmark(44);
        assert(chrome.bookmarks.remove.withArgs(44).calledOnce);
        done();
    });

  });

});
