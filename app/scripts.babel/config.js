'use strict';

/**
 * Class Config.
 *
 * Responsible for interacting with chrome.storage API, saving and loading options.
 */
var Config = {};

/**
 * Bookmark class dependency. (using require() for node.js compatibility)
 */
// eslint-disable-next-line no-use-before-define
var Bookmark = Bookmark || require('./bookmark.js');

/**
 * DomHelper class dependency. (using require() for node.js compatibility)
 */
// eslint-disable-next-line no-use-before-define
var DomHelper = DomHelper || require('./domHelper.js');

/**
 * Persists settings to chrome storage.
 *
 * Example:
 * `{key: 'value', anotherKey: 'anotherValue'}`
 *
 * @param {Object} configs - Settings that will be persisted on storage
 * @param {function} cb - Callback
 */
Config.set = (configs, cb) => {
  chrome.storage.sync.set(configs, cb);
};

/**
 * Gets persisted settings from chrome storage.
 *
 * Example:
 * `{key: 'defaultValue', anotherKey: 'anotherDefaultValue'}`
 *
 * @param {Object} configs - Settings that will be retrieved. Use values as default.
 * @param {function} cb - Callback
 */
Config.get = (configs, cb) => {
  chrome.storage.sync.get(configs, cb);
};

/**
 * Gets all relevant persisted settings from chrome storage.
 *
 * @param {function} cb - Callback
 */
Config.getAll = cb => {
  var configs = {
    sourceFolder: '0',
    destinationFolder: '0',
    triggerAction: 'new_tab',
    suggestedOrder: 'random',
    triggerFrequency: 10,
  };

  chrome.storage.sync.get(configs, cb);
};

/**
 * Save options from the options page to storage.
 *
 * @param {function} cb - Callback
 */
Config.save = cb => {
  var configs = {};

  configs.sourceFolder = document.getElementById('sourceFolder').value;
  configs.destinationFolder = document.getElementById('destinationFolder').value;

  configs.triggerAction = document.querySelector('[name=triggerAction]:checked').value;
  configs.suggestedOrder = document.querySelector('[name=suggestedOrder]:checked').value;
  configs.triggerFrequency = document.getElementById('triggerFrequency').value;

  Config.set(configs, cb);
};

/**
 * Load options from storage to the options page.
 *
 * @param {function} cb - Callback
 */
Config.load = cb => {
  Config.getAll(
    configs => {
      Bookmark.findFolders(folders => {
        document.getElementById('sourceFolder')
          .innerHTML = DomHelper.generateOptions(folders, configs.sourceFolder);

        document.getElementById('destinationFolder')
          .innerHTML = DomHelper.generateOptions(folders, configs.destinationFolder);
      });

      document.querySelector('[name=triggerAction][value=' + configs.triggerAction + ']').checked = 'checked';
      document.querySelector('[name=suggestedOrder][value=' + configs.suggestedOrder + ']').checked = 'checked';

      document.getElementById('triggerFrequency').value = configs.triggerFrequency;

      cb(true);
    }
  );
};

/* istanbul ignore next */
if (typeof exports === 'object') {
  module.exports = Config;
}
