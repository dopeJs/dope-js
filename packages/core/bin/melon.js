#! /usr/bin/env node
const debug = require('debug')
const { existsSync } = require('fs')
const { resolve } = require('path')
const { performance } = require('perf_hooks')
debug('time-require').enabled && require('time-require')
const { clearConsole } = require('../lib/utils')

async function melon() {
  const entry = resolve(__dirname, '..', 'lib', 'index.js')

  const isEntryExist = existsSync(entry)

  if (isEntryExist) {
    global.__melon_start_time__ = performance.now()
    require(entry)
  } else {
    console.warn(
      'Melon JS core file missing, please reinstall @melon-js/core globally'
    )
  }
}

melon()
