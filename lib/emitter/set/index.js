'use strict'
const isObj = require('brisky-is-obj')

exports.define = {
  set (val, stamp, nocontext) {
    if (isObj(val) && !(val instanceof Array)) {
      set(this, val, stamp, nocontext)
    } else if (val === null) {
      this.remove(stamp)
    } else {
      this.on(val, 'val', void 0, stamp, void 0, nocontext)
    }
    return this
  }
}

function set (emitter, val, stamp, nocontext) {
  let props = emitter.properties
  for (let key in val) {
    if (props[key]) {
      props[key].call(emitter, val[key], stamp, nocontext, key)
    } else {
      if (!emitter._id && !isNaN(key)) {
        // @todo: is this really nessecary? -- maybe better to check in the id generator?
        emitter._id = Number(key)
      }
      if (val[key] === null) {
        // make this on remove do less shit special -- fucks things up like context etc
        emitter.off(key)
      } else {
        emitter.on(val[key], key, void 0, stamp, void 0, nocontext)
      }
    }
  }
}
