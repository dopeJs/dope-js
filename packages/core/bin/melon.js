#! /usr/bin/env node
const debug = require('debug')
const { existsSync } = require('fs')
const { resolve } = require('path')
debug('time-require').enabled && require('time-require')
const { clearConsole, normolizeNodePath } = require('../lib/utils')

async function melon() {
  const entry = resolve(__dirname, '..', 'lib', 'index.js')

  const isEntryExist = existsSync(entry)

  // generate node path in case of npm not working instantly
  normolizeNodePath()

  // clear terminal view
  clearConsole()

  if (isEntryExist) {
    require(entry)
  } else {
    console.warn(
      'Melon JS core file missing, please reinstall @melon-js/core globally'
    )
  }
}

melon()
