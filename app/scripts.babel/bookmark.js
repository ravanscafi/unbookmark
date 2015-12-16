(function(root, factory) {
  if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.queryObject = factory();
  }
})(this, function() {
  'use strict';

  var bookmark = {};

  bookmark.findFolders = (cb) => {
  	chrome.bookmarks.getTree((nodes) => {
  		var folders = [];
      var i;

      for(i = 0; i < nodes.length; i++) {
        if(nodes[i].children && nodes[i].children.length) {
          folders.push(nodes[i])
        }
      }

      cb(folders);
  	});
  };

  bookmark.getFolderBookmarks = (folderId, cb) => {
    chrome.bookmarks.getChildren(folderId, (nodes) => {
      cb(nodes);
    });
  };


  bookmark.moveBookmark = (id, destinationId, cb) => {
    chrome.bookmarks.move(id, destinationId, cb);
  };

  bookmark.deleteBookmark = (id, cb) => {
    chrome.bookmarks.remove(id, cb);
  };

  bookmark.getSuggestion = (cb) => {};
  bookmark.markBookmarkAsRead = (id, cb) => {};

  return bookmark;
});