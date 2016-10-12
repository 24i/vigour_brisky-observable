'use strict'
const bstamp = require('brisky-stamp')
exports.define = {
  once (listener, key, unique, stamp) {
    var once, done
    const emitter = this
    if (typeof listener === 'function') {
      once = (val, stamp) => {
        if (!done) {
          emitter.clearContext()
          bstamp.done(stamp, () => emitter.off(once))
          done = true
          listener.call(this, val, stamp)
        }
      }
    } else if (listener.isBase) {
      const type = this.key
      once = (val, stamp) => {
        if (!done) {
          bstamp.done(stamp, () => emitter.off(once))
          done = true
          listener.emit(type, val, stamp)
        }
      }
    } else if (listener instanceof Array) {
      once = listener
      const internal = listener[0]
      listener[0] = function (val, stamp) {
        if (!done) {
          bstamp.done(stamp, () => emitter.off(once))
          done = true
          internal.call(this, val, stamp, listener[1])
        }
      }
    }
    return this.on(once, key, unique, stamp)
  }
}
