'use strict'
var obs = require('./index.js')
console.log(obs)
obs({
  bla: {
    bla: '$root.x.x.x.x.x.x.x.x.x.x.x'
  },
  on: {
    data () {
      console.log('lulllz')
    }
  }
})



// console.log(obs.set('hello'))
