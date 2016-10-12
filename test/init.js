'use strict'
const test = require('tape')
const bstamp = require('brisky-stamp')
test('init', t => {
  const observable = require('../')
  const obs = observable({}, false) // eslint-disable-line
  t.plan(1)
  t.equal(bstamp.cnt, 0, 'bstamp.cnt is zero')
})
