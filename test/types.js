'use strict'
const Observable = require('../')
const test = require('tape')
const Base = require('brisky-base/base')

test('types - default', t => {
  const Emitter = require('../lib/emitter')

  const obs = new Observable({
    base: { type: 'base' },
    emitter: { type: 'emitter' }
  })

  t.equal(obs.base instanceof Base, true, 'type base')
  t.equal(obs.emitter instanceof Emitter, true, 'type emitter')
  const Obs = new Observable({ child: Base }).Constructor
  const instance = new Obs({
    something: { type: 'observable' }
  })
  t.equal(instance.something instanceof Observable, true, 'type observable')
  t.end()
})
