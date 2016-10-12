'use strict'
const observable = require('../')
const test = require('tape')

test('references - keys and remove', t => {
  var fired = 0
  const obs = observable({
    key: 'obs',
    a: true,
    properties: { b: true },
    on: { data () { fired++ } }
  })
  t.plan(5)
  t.equal(obs.keys().length, 1, 'has correct keys length')

  const reference = observable({ key: 'reference' })
  obs.set(reference)
  t.equal(fired, 1, 'setting obs to a reference fires listener')
  t.equal(obs.val, reference, 'obs val equals reference')
  reference.set(true)
  t.equal(fired, 2, 'setting reference to true fires listener')
  t.equal(obs.compute(), true, 'obs computed value equals "true"')
})

test('references - listensOnBase', t => {
  const a = observable({
    a: true,
    b: true,
    c: true
  })
  const obs = observable({
    key: 'obs',
    a: {
      val: a.b
    }
  })
  t.same(obs.a.listensOnBase.keys(), [ 1 ])
  obs.a.set(false)
  t.same(obs.a.listensOnBase.keys(), [])
  obs.a.set(a.b)
  t.same(obs.a.listensOnBase.keys(), [ 2 ])
  obs.a.remove()
  t.end()
})

test('references - listensOnBase', t => {
  const a = observable({
    a: true,
    b: true,
    c: true
  })
  const obs = observable({
    key: 'obs',
    a: {
      val: a.b
    }
  })
  t.same(obs.a.listensOnBase.keys(), [ 1 ])
  obs.a.set(false)
  t.same(obs.a.listensOnBase.keys(), [])
  obs.a.set(a.b)
  t.same(obs.a.listensOnBase.keys(), [ 2 ])
  obs.a.remove()
  t.end()
})

test('references - attach', t => {
  t.plan(2)
  var a
  const other = observable({ key: 'other' })
  const obs = observable({
    key: 'obs',
    on: {
      data: {
        a: [ function () {
          a = Array.prototype.slice.call(arguments)
        }, other ]
      }
    }
  })
  obs.set(true, 'stamp')
  t.same(a, [ true, 'stamp', other ], 'set obs to "true", attach fires')
  other.remove()
  t.same(obs._emitters.data.attach.keys(), [], 'removing the attached base removes listeners')
})

test('references - string notation', t => {
  const obs = observable({
    key: 'obs',
    items: {},
    channels: {
      items: {
        on: {
          data () {
            t.ok(true, 'fires listener')
            t.end()
          }
        }
      }
    }
  })
  obs.set({
    items: {
      a: '$root.channels.items.a'
    }
  })
})

test('references - custom emitter type', t => {
  const obs = observable()
  const ref = observable()
  ref.on('special', obs)
  obs.on('special', () => {
    t.ok(true, 'fires listener')
    t.end()
  })
  ref.emit('special')
})
