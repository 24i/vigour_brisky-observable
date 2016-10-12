'use strict'
const bstamp = require('brisky-stamp')
const emitinstances = require('./emitinstances').universal

exports.define = {
  emit (key, val, stamp) {
    var created
    if (stamp === void 0) {
      stamp = bstamp.create()
      created = true
    }
    if (stamp) {
      const _key = '_' + key
      const on = this._emitters
      if (on) {
        let emitter = on[_key] || on[key]
        if (emitter) {
          emitter.emit(this, val, stamp)
        } else if (this.instances) {
          emitinstances(this.instances, _key, key, stamp, val)
        }
      }
      if (created) { bstamp.close(stamp) }
    }
  }
}
