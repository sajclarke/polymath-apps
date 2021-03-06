const base = require('../../config/babel.config.js');

module.exports = {
  presets: ['react-app'],
  plugins: [
    ...base.plugins,
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-transform-runtime',
    '@babel/plugin-syntax-async-generators',
    '@babel/plugin-transform-regenerator',
  ],
};
