'use strict';

/* global require, exports */
var utils = require('utils');

var TimelineBuilder = function() {
};

TimelineBuilder.prototype.execute = function(options) {

};

exports.execute = function(options) {
  utils.copyToStage(options);
  (new TimelineBuilder()).execute(options);
};
