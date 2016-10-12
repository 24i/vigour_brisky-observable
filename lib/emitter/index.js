'use strict'
const base = require('brisky-base')
/**
 * @namespace Emitter
 * @class
 * @augments base
 * @param {*} val
 *  difference with base -- sets listeners for each key
 *  if there is a function will set a listener on fn val
 * @return {base}
 */
module.exports = base({
  inject: [
    require('./storage'),
    require('./off'),
    require('./set'),
    require('./on'),
    require('./once'),
    require('./emit')
  ],
  define: { isEmitter: true },
  noReference: true
}).Constructor
