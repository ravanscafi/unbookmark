'use strict';

/**
 * Class DomHelper.
 *
 * Responsible for helping with DOM interactions, including localization.
 */
var DomHelper = {};

/**
 * Localize i18n data for all elements on DOM.
 * A valid key from _locales/{*}/messages should be provided on `data-i18n` property.
 *
 * If element is of type input or textarea, then the value will be translated.
 * Otherwise, it will set the innerHTML property.
 *
 * Example:
 * `<div data-i18n="appName"></div>`
 * will become:
 * `<div data-i18n="appName">Unbookmark</div>`
 */
DomHelper.localizeI18n = () => {
  var objects = document.querySelectorAll('[data-i18n]');

  for (let i = 0; i < objects.length; i++) {
    var attribute = ['INPUT', 'TEXTAREA'].indexOf(objects[i].tagName) > -1 ? 'value' : 'innerHTML';

    objects[i][attribute] = chrome.i18n.getMessage(objects[i].dataset.i18n);
  }
};

/**
 * Generates <options /> for a given list of Bookmarks.
 *
 * @param {BookmarkTreeNode[]} list - a list of Bookmarks
 * @param {string} selected - default selected option
 * @return {string} - concatenated options
 */
DomHelper.generateOptions = (list, selected) => {
  var result = '';

  list.forEach(node => {
    var isSelected = node.id === selected ? ' selected="selected"' : '';

    result += '<option value="' + node.id + '"' + isSelected + '>' + node.title + '</option>\n';
  });

  return result;
};

/* istanbul ignore next */
if (typeof exports === 'object') {
  module.exports = DomHelper;
}
