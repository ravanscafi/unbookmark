'use strict';

var Config = {};

Config.set = (configs, cb) => {
  chrome.storage.sync.set(configs, cb);
};

Config.get = (configs, cb) => {
  chrome.storage.sync.get(configs, cb);
};

Config.save = cb => {
  var configs = {};

  configs.sourceFolder = document.getElementById('sourceFolder').value;
  configs.destinationFolder = document.getElementById('destinationFolder').value;
  configs.triggerAction = document.getElementById('triggerAction').value;
  configs.triggerFrequency = document.getElementById('triggerFrequency').value;
  configs.suggestedOrder = document.getElementById('suggestedOrder').value;

  Config.set(configs, cb);
};

Config.load = cb => {
  Config.get(
    [
      'sourceFolder',
      'destinationFolder',
      'triggerAction',
      'triggerFrequency',
      'suggestedOrder',
    ],
    configs => {
      document.getElementById('sourceFolder').value = configs.sourceFolder;
      document.getElementById('destinationFolder').value = configs.destinationFolder;
      document.getElementById('triggerAction').value = configs.triggerAction;
      document.getElementById('triggerFrequency').value = configs.triggerFrequency;
      document.getElementById('suggestedOrder').value = configs.suggestedOrder;

      cb(true);
    }
  );
};

/* istanbul ignore next */
if (typeof exports === 'object') {
  module.exports = Config;
}
