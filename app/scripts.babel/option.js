(function(root, factory) {
  /* istanbul ignore next */
  if (typeof exports === 'object') {
    module.exports = factory();
  } else {
    root.option = factory();
  }
})(this, function() {
  'use strict';

  var Option = {};

  Option.set = (options, cb) => {
    chrome.storage.sync.set(options, cb);
  };

  Option.get = (options, cb) => {
    chrome.storage.sync.get(options, cb);
  };

  Option.save = cb => {
    var options = {};

    options.sourceFolder = document.getElementById('sourceFolder').value;
    options.destinationFolder = document.getElementById('destinationFolder').value;
    options.triggerAction = document.getElementById('triggerAction').value;
    options.triggerFrequency = document.getElementById('triggerFrequency').value;
    options.suggestedOrder = document.getElementById('suggestedOrder').value;

    Option.set(options, cb);
  };

  Option.load = cb => {
    Option.get(
      [
        'sourceFolder',
        'destinationFolder',
        'triggerAction',
        'triggerFrequency',
        'suggestedOrder',
      ],
      options => {
        document.getElementById('sourceFolder').value = options.sourceFolder;
        document.getElementById('destinationFolder').value = options.destinationFolder;
        document.getElementById('triggerAction').value = options.triggerAction;
        document.getElementById('triggerFrequency').value = options.triggerFrequency;
        document.getElementById('suggestedOrder').value = options.suggestedOrder;

        cb(true);
      }
    );
  };

  return Option;
});
