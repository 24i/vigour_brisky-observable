'use strict'
const base = require('brisky-base')
const Observable = module.exports = base({
  inject: [
    require('./on'),
    require('./emit'),
    require('./off'),
    require('./remove'),
    require('./set')
  ],
  define: {
    isObservable: true,
    keyFilter (key) {
      if (
        key !== 'emitters' &&
        key !== 'listensOnAttach' &&
        key !== 'listensOnBase' &&
        key[0] !== '$'
      ) {
        return true
      }
    }
  },
  instances: false,
  child: 'Constructor'
}, false).Constructor

Observable.prototype.set({
  types: {
    observable: Observable.prototype,
    emitter: require('../emitter').prototype
  }
}, false)
