'use strict';

/** This file set event listeners for the Options page. */

/**
 * DomHelper class dependency. (using require() for node.js compatibility)
 */
// eslint-disable-next-line no-use-before-define
var DomHelper = DomHelper || require('./domHelper.js');

/**
 * Config class dependency. (using require() for node.js compatibility)
 */
// eslint-disable-next-line no-use-before-define
var Config = Config || require('./config.js');

document.addEventListener('DOMContentLoaded', () => {
  DomHelper.localizeI18n();
  Config.load(() => {});
});

document.getElementById('submit').addEventListener('click', e => {
  Config.save(() => {
    var oldValue = e.target.value;

    e.target.value = chrome.i18n.getMessage('saved');
    e.target.disabled = 'disabled';

    setTimeout(() => {
      e.target.value = oldValue;
      e.target.disabled = '';
    }, 1000);
  });
});
