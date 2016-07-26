/* global before, after */

'use strict'

var sails = require('sails')
var pseudoelements = require('postcss-pseudoelements')

/**
 * Lifting sails before all tests
 */
before(function (done) {
  sails.on('hook:postcss:configuring', function () {
    sails.config.postcss = {
      enabled: false,
      plugins: [
        pseudoelements()
      ]
    }
  })

  sails
  .lift({ // configuration for testing purposes
    port: 7070,
    environment: 'test',
    log: {
      noShip: true
    },
    models: {
      migrate: 'drop'
    },
    hooks: {
      sockets: false,
      pubsub: false,
      grunt: false,
      postcss: require('../')
    }
  }, function (error, sails) {
    if (error) {
      return done(error)
    } else {
      done(null, sails)
    }
  })
})

/**
 * Lowering sails after done testing
 */
after(function (done) {
  if (sails) {
    return sails.lower(done)
  }

  return done()
})
