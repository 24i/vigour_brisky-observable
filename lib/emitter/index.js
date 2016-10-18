'use strict'
const Base = require('brisky-base/base')

exports.inject = [
  require('./emit')
]

exports.noReference = true

exports.define = {
  isEmitter: true,
  generateConstructor () {
    // maybe add prev contructor as first argument?
    return function Emitter (val, stamp, parent, key, params) {
      this._k = '_' + key
      Base.call(this, val, stamp, parent, key, params)
    }
  }
}
