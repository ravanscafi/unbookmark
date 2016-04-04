'use strict';

/**
 * Class Suggester.
 *
 * Responsible for actually making suggestions to user, based on config.
 */
var Suggester = {};

/**
 * Bookmark class dependency. (using require() for node.js compatibility)
 */
// eslint-disable-next-line no-use-before-define
var Bookmark = Bookmark || require('./bookmark.js');

/**
 * Config class dependency. (using require() for node.js compatibility)
 */
// eslint-disable-next-line no-use-before-define
var Config = Config || require('./config.js');

const _canSuggest = triggerFrequency => {
  return Math.random() <= triggerFrequency / 100;
};

/**
 * Verifies if a suggestion can be made checking frequency.
 * If a suggestion can be made, yields it, boolean otherwise.
 *
 * @param {function} cb - Callback
 */
Suggester.verify = cb => {
  Config.getAll(options => {
    if (_canSuggest(options.triggerFrequency)) {
      Bookmark.getSuggestion(options.sourceFolder, options.suggestedOrder, bookmark => {
        cb(bookmark);
        if (bookmark) {
          Bookmark.markBookmarkAsRead(bookmark.id, options.destinationFolder, () => {});
        }
      });
    } else {
      cb(false);
    }
  });
};

/**
 * Registers Listeners to events where suggestions may occur.
 */
Suggester.registerListeners = () => {
  chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
    if (
      (changeInfo.url === 'chrome://newtab/') &&
      (changeInfo.status === 'loading')
    ) {
      Suggester.verify(bookmark => {
        if (!bookmark) {
          return;
        }

        chrome.tabs.update(tabId, {url: bookmark.url}, () => {});
      });
    }
  });
};

/* istanbul ignore next */
if (typeof exports === 'object') {
  module.exports = Suggester;
}
