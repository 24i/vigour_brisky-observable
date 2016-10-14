'use strict'
const observable = require('../')
const test = require('tape')

test('on - basic', t => {
  t.plan(4)
  const obs = observable()
  obs.on('data', () => {})
  t.equal('data' in obs.emitters, true, 'added data listener')
  obs.on('special', () => {})
  t.equal('special' in obs.emitters, true, 'added special listener')
  obs.set({
    on () {
      t.pass('fires default data listener')
    }
  })
  obs.set('hello')
  obs.set({ on: { data: null } })
  console.log('???', obs.emitters.data)
  t.equal(obs.emitters.data, null, 'removed data emitter')
})

test('on - instances', t => {
  const obs = observable()
  t.plan(2)
  const a = new obs.Constructor()
  a.on('data', () => {
    t.ok(true, 'fires listener on instance')
  })
  obs.set(1)
  a.on('special', () => {
    t.ok(true, 'special fires listener on instance')
  })
  obs.emit('special')
})

test('on - remove listener trough set notation', t => {
  const obs = observable({ on: { data: { a () {} } } })
  t.equal('a' in obs._emitters.data.fn, true, 'add fn listener a')
  obs.set({ on: { data: { a: null } } })
  t.equal(obs._emitters.data.fn.a, null, 'removed fn listener a')
  t.end()
})

test('on - overwrite existing key on different type', t => {
  const obs = observable({ on: { data: { a () {} } } })
  t.same(obs.emitters.data.fn.keys(), [ 'a' ], 'add fn listener a')
  obs.set({ on: { data: { a: [ () => {} ] } } })
  t.same(obs.emitters.data.attach.keys(), [ 'a' ], 'add attach listener a')
  // make this efficient!
  t.same(obs.emitters.data.fn.keys(), [], 'remove fn listener a')
  t.end()
})

test('on - add listener to a removed target', t => {
  const obs = observable()
  obs.remove()
  obs.set({ data: { g () {} } })
  t.equal('data' in obs.emitters, false, 'did not add listener on removed observable')
  t.end()
})

test('on - removed target', t => {
  const obs = observable()
  obs.remove()
  obs.on(() => {})
  // obs.set({ on: { data: { g () {} } } }) // this does something weird... maybe block sets on removed thigns
  t.equal('data' in obs.emitters, false, 'did not add listener on removed observable')
  t.end()
})

test('on - resolve context (method)', t => {
  const obs = observable({ a: { on: { data () {} } } })
  const instance = new obs.Constructor({ key: 'instance' })
  t.same(obs.a.emitters.data.fn.keys(), [ 'val' ], 'data.fn has val')
  instance.a.on(() => {})
  t.same(obs.a.emitters.data.fn.keys(), [ 'val' ], 'data.fn does not get extra listeners')
  t.same(instance.a.emitters.data.fn.keys(), [ 'val', 1 ], 'instance has extra listener')
  t.ok(instance.a.hasOwnProperty('_emitters'), 'instance has own emitters')
  t.ok(instance.a._emitters.hasOwnProperty('_data'), 'emitters own data property')
  t.ok(instance.a._emitters._data.hasOwnProperty('fn'), 'data property has own fn')
  t.end()
})

test('on - resolve context (set)', t => {
  const obs = observable({ a: { on: { data () {} } } })
  const instance = new obs.Constructor({ key: 'instance' })
  t.same(obs.a.emitters.data.fn.keys(), [ 'val' ], 'data.fn has val')
  instance.set({ a: { on: { data: { 1 () {} } } } })
  t.same(obs.a.emitters.data.fn.keys(), [ 'val' ], 'data.fn does not get extra listeners')
  t.same(instance.a.emitters.data.fn.keys(), [ 'val', '1' ], 'instance has extra listener')
  t.ok(instance.a.hasOwnProperty('_emitters'), 'instance has own emitters')
  t.ok(instance.a._emitters.hasOwnProperty('_data'), 'emitters own data property')
  t.ok(instance.a._emitters._data.hasOwnProperty('fn'), 'data property has own fn')
  t.end()
})

test('on - resolve context remove (set)', t => {
  const obs = observable({ a: { on: { data () {} } } })
  const instance = new obs.Constructor({ key: 'instance' })
  t.same(obs.a.emitters.data.fn.keys(), [ 'val' ], 'data.fn has val')
  instance.set({ a: { on: { data: null } } })
  t.same(obs.a.emitters.data.fn.keys(), [ 'val' ], 'data.fn does not get extra listeners')
  t.same(instance.a._emitters.data, null, 'instance does not have data emitter')
  t.ok(instance.a.hasOwnProperty('_emitters'), 'instance has own emitters')
  t.ok(instance.a._emitters.hasOwnProperty('_data'), 'emitters own data property')
  t.end()
})

test('on - child', t => {
  // var cnt = 0
  const obs = observable({
    child: {
      on: {
        xxx: {
          label () {}
        }
      }
    }
  })
  obs.set({
    hello: {
      on: {
        xxx: {
          gurk () {}
        }
      }
    }
  })
  t.same(obs.hello.emitters.xxx.fn.keys(), [ 'label', 'gurk' ], 'correct resolvement of context')
  t.end()
})

test('on - child - inject', t => {
  const injectable = {
    field: {
      child: {
        on: {
          xxx: {
            label () {}
          }
        }
      }
    }
  }
  // all this stuff just work its just the set override
  const obs = observable({
    inject: injectable,
    field: {
      child: {
        on: {
          xxx: {
            x () {}
          }
        }
      },
      hello: {
        on: {
          xxx: {
            gurk () {}
          }
        }
      }
    }
  })
  t.same(obs.field.hello.emitters.xxx.fn.keys(), [ 'x', 'label', 'gurk' ], 'correct resolvement of context')
  const a = new obs.Constructor({
    field: {
      x: {
        on: {
          xxx: {
            x: null
          }
        }
      }
    }
  })

  t.same(a.field.x.emitters.xxx.fn.keys(), [ 'label' ], 'remove x on instance of obs')
  t.end()
})
