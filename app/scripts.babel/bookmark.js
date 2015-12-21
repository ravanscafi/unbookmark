'use strict';

/**
 * Class Bookmark.
 *
 * Responsible for interacting with chrome.bookmarks API and finding suggestions.
 */
var Bookmark = {};

/**
 * Finds which nodes are folders from given nodes.
 *
 * @param {BookmarkTreeNode[]} nodes - Node tree that will be iterated
 * @return {Object[]} - Array of results containing 'id' and 'title' keys
 */
Bookmark.recursiveFindFolders = nodes => {
  var result = [];

  nodes.forEach(node => {
    if (node.children) {
      var children = node.children;
      delete node.children;
      result.push(node);
      result = result.concat(Bookmark.recursiveFindFolders(children));
    }
  });

  return result;
};

/**
 * Finds which nodes are leaves (not folders) from given nodes.
 *
 * @param {BookmarkTreeNode[]} nodes - Node tree that will be iterated
 * @return {Object[]} - Array of results containing 'id' and 'title' keys
 */
Bookmark.recursiveFindLeaves = nodes => {
  var result = [];

  nodes.forEach(node => {
    if (node.children) {
      result = result.concat(Bookmark.recursiveFindLeaves(node.children));
    } else {
      result.push(node);
    }
  });

  return result;
};

/**
 * Finds all nodes that are folders from chrome bookmarks tree.
 *
 * @param {function} cb - Callback
 */
Bookmark.findFolders = cb => {
  chrome.bookmarks.getTree(nodes => {
    cb(Bookmark.recursiveFindFolders(nodes));
  });
};

/**
 * Finds all nodes that are leaves from given folder.
 *
 * @param {string} folderId - Folder to get bookmarks from
 * @param {function} cb - Callback
 */
Bookmark.getFolderBookmarks = (folderId, cb) => {
  chrome.bookmarks.getChildren(folderId, nodes => {
    cb(Bookmark.recursiveFindLeaves(nodes));
  });
};

/**
 * Move node from a location to another on chrome bookmarks tree.
 *
 * @param {string} id - Node to move
 * @param {string} destinationId - Folder that node will be moved to
 * @param {function} cb - Callback
 */
Bookmark.moveBookmark = (id, destinationId, cb) => {
  chrome.bookmarks.move(id, destinationId, cb);
};

/**
 * Delete a node from chrome bookmarks tree.
 *
 * @param {string} id - Node to delete
 * @param {function} cb - Callback
 */
Bookmark.deleteBookmark = (id, cb) => {
  chrome.bookmarks.remove(id, cb);
};

/**
 * Gets a single suggestion from sourceFolder based on suggestedOrder logic.
 *
 * @param {string} sourceFolder - Folder to get suggestions from
 * @param {string} suggestedOrder - Order for chosing a suggestion
 * @param {function} cb - Callback
 */
Bookmark.getSuggestion = (sourceFolder, suggestedOrder, cb) => {
  Bookmark.getFolderBookmarks(sourceFolder, bookmarks => {
    var suggestion;

    switch (suggestedOrder) {
      case 'random':
      default:
        suggestion = bookmarks[Math.floor(Math.random() * bookmarks.length)];
        break;
    }

    cb(suggestion);
  });
};

/**
 * Mark bookmark as read, moving it to destinationFolder.
 *
 * @param {string} id - Node to mark as read
 * @param {string} destinationFolder - Folder to move to
 * @param {function} cb - Callback
 */
Bookmark.markBookmarkAsRead = (id, destinationFolder, cb) => {
  Bookmark.moveBookmark(id, destinationFolder, cb);
};

/* istanbul ignore next */
if (typeof exports === 'object') {
  module.exports = Bookmark;
}
