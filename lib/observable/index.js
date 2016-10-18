'use strict'
const base = require('brisky-base')
const Observable = module.exports = base({
  types: {
    emitter: require('../emitter').prototype
  },
  inject: [
    require('./on'),
    require('./emit'),
    require('./off'),
    require('./remove'),
    require('./set')
  ],
  define: {
    isObservable: true,
    keyFilter: (key) => key !== 'emitters' && key[0] !== '$'
  },
  instances: false,
  child: 'Constructor'
}, false).Constructor

// make this clean
Observable.prototype.set({
  types: {
    observable: Observable.prototype
  }
}, false)
