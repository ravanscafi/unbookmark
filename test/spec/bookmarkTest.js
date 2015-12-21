'use strict';

const chai = require('chai');
const sinon = require('sinon');
const expect = chai.expect;
const assert = chai.assert;

const bookmark = require('../../app/scripts.babel/bookmark');

describe('Bookmark Class', () => {
  before(() => {
    global.chrome = require('sinon-chrome');
  });

  describe('interacting with chrome.bookmarks API', () => {
    it('should find folders from bookmarks', done => {
      chrome.bookmarks.getTree.yields([
        {id: '1', title: 'Folder 1', url: 'url1', children: []},
        {id: '2', title: 'Bookmark 1'},
        {
          id: '3',
          title: 'Folder 2',
          url: 'url2',
          children: [
            {
              id: '4',
              title: 'Folder 3',
              url: 'url3',
              children: [
                {},
                {
                  id: '5',
                  title: 'Folder 4',
                  url: 'url4',
                  children: [],
                },
              ],
            },
          ],
        },
      ]);

      bookmark.findFolders(folders => {
        expect(folders).to.deep.equal([
          {id: '1', title: 'Folder 1', url: 'url1'},
          {id: '3', title: 'Folder 2', url: 'url2'},
          {id: '4', title: 'Folder 3', url: 'url3'},
          {id: '5', title: 'Folder 4', url: 'url4'},
        ]);
        done();
      });
    });

    it('should get children bookmarks for a given folder', done => {
      chrome.bookmarks.getChildren.withArgs('12').yields([
        {id: '1', title: 'Node 1', url: 'url1'},
        {id: '2', title: 'Node 2', children: [{id: '3', title: 'Node 3', url: 'url3'}]},
        {id: '2', title: 'Node 4', children: []},
      ]);

      bookmark.getFolderBookmarks('12', bookmarks => {
        expect(bookmarks).to.deep.equal([
          {id: '1', title: 'Node 1', url: 'url1'},
          {id: '3', title: 'Node 3', url: 'url3'},
        ]);

        done();
      });
    });

    it('should move a bookmark to destination', done => {
      bookmark.moveBookmark('5', '10');
      assert(chrome.bookmarks.move.withArgs('5', '10').calledOnce);
      done();
    });

    it('should delete a bookmark', done => {
      bookmark.deleteBookmark('44');
      assert(chrome.bookmarks.remove.withArgs('44').calledOnce);
      done();
    });

    it('should receive a bookmark as suggestion', done => {
      var getFolderBookmarks = sinon.stub(bookmark, 'getFolderBookmarks');
      getFolderBookmarks.withArgs('5').yields([{id: 1, title: 'Title'}]);

      bookmark.getSuggestion('5', 'random', response => {
        expect(response).to.deep.equal({id: 1, title: 'Title'});
        getFolderBookmarks.restore();
        done();
      });
    });

    it('should mark bookmark as ready', done => {
      var moveBookmark = sinon.stub(bookmark, 'moveBookmark');
      moveBookmark.withArgs('44', '100').yields(true);

      bookmark.markBookmarkAsRead('44', '100', response => {
        expect(response).to.equal(true);
        moveBookmark.restore();
        done();
      });
    });
  });
});
