'use strict'
const on = require('./on')

exports.properties = {
  define: {
    on: {
      val: on,
      key: 'emitters'
    }
  }
}

exports.on = {}

exports.define = {
  on () {},
  once () {}
}
