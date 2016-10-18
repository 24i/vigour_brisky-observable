'use strict'
const emitInstance = require('../../emitter/emit/instances').instance

module.exports = {
  type: 'base',
  child: { type: 'emitter' },
  define: {
    extend: {
      setValueInternal (method, val, stamp) {
        if (val && (typeof val === 'function' || typeof val === 'object' && val.isBase)) {
          return this.set({ data: val }, stamp)
        } else {
          return method.call(this, val, stamp)
        }
      }
    }
  },
  properties: {
    data: {
      define: {
        eInstances (instances, bind, stamp, val) {
          const len = instances.length
          for (let i = 0; i < len; i++) {
            let instance = instances[i]
            let on = instance._emitters
            let iEmitter = on && on._data
            if (iEmitter) {
              emitInstance(this, iEmitter, instance, val, stamp)
            }
          }
        }
      }
    },
    define: {
      remove: {
        val: {
          type: 'emitter',
          define: {
            eInstances (instances, bind, stamp, val) {
              const len = instances.length
              for (let i = 0; i < len; i++) {
                let instance = instances[i]
                let on = instance._emitters
                let iEmitter = on && on._removeEmitter
                if (iEmitter) {
                  emitInstance(this, iEmitter, instance, val, stamp)
                }
              }
            }
          }
        },
        key: 'removeEmitter'
      }
    }
  }
}
