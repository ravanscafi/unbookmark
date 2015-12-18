'use strict';

var Bookmark = {};

Bookmark.findFolders = cb => {
  chrome.bookmarks.getTree(nodes => {
    var folders = [];
    var i;

    for (i = 0; i < nodes.length; i++) {
      if (nodes[i].children && nodes[i].children.length) {
        folders.push(nodes[i]);
      }
    }

    cb(folders);
  });
};

Bookmark.getFolderBookmarks = (folderId, cb) => {
  chrome.bookmarks.getChildren(folderId, nodes => {
    cb(nodes);
  });
};

Bookmark.moveBookmark = (id, destinationId, cb) => {
  chrome.bookmarks.move(id, destinationId, cb);
};

Bookmark.deleteBookmark = (id, cb) => {
  chrome.bookmarks.remove(id, cb);
};

// Bookmark.getSuggestion = cb => {};

// Bookmark.markBookmarkAsRead = (id, cb) => {};

/* istanbul ignore next */
if (typeof exports === 'object') {
  module.exports = Bookmark;
}
