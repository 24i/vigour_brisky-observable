'use strict'
const observable = require('../../')
const perf = require('vigour-performance')
var amount = 1e4

function createObservable () {
  for (let i = 0; i < amount; i++) {
    observable(i) //eslint-disable-line
  }
}

// rly fucking slow
function createObservableWithListener () {
  for (let i = 0; i < amount; i++) {
    let obs = observable()
    obs.on(() => {})
  }
}

function createObservableWithListenerSetObj () {
  for (let i = 0; i < amount; i++) {
    // 8 times slower fuck???
    observable({ on: { data () {} } }) //eslint-disable-line
  }
}

// add base, add attach
perf(createObservableWithListener, createObservable, 1.25)
perf(createObservableWithListenerSetObj, createObservableWithListener, 1.25)

// add all those different types in here
