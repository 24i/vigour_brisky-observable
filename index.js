'use strict'
const Observable = require('./observable')
module.exports = (val, stamp, parent, key, params) =>
  new Observable(val, stamp, parent, key, params)
