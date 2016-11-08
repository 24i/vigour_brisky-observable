'use strict'

var Observable = require('../')
var test = require('tape')

test('references - merge with data after reference set', t => {
  const obs = new Observable({
    a: {
      b: 'c',
      d: 'e'
    },
    f: {
      g: '$root.a'
    }
  })
  t.deepEqual(obs.f.g.compute(), obs.a.compute(), 'before merge the reference should be in place')
  obs.f.set({
    g: {
      b: 'h',
      d: 'i'
    }
  })
  t.notDeepEqual(obs.f.g.compute(), obs.a.compute(), 'after merge the reference should be replaced by new data')
  t.ok(obs.f.g.b.compute() === 'h' && obs.f.g.d.compute() === 'i', 'after merge the set elements should be available')
  t.end()
})
