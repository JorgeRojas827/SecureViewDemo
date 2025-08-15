const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const util = require('util');
if (!util.styleText) {
  util.styleText = function (style, text) {
    return text;
  };
}

const config = {};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
